-- ==============================================================================
-- SCHEMA: TGE_FINANCE_SYSTEM (Smart Bytes) - REVISION FINAL
-- ==============================================================================
-- ADVERTENCIA: Este script reinicia el esquema. ELIMINARÁ datos existentes.
-- ==============================================================================

-- 0. LIMPIEZA PREVIA (CORREGIDA)
-- Eliminamos las tablas directamente con CASCADE. 
-- Esto elimina automáticamente los triggers y restricciones sin lanzar errores si la tabla no existe.

DROP TABLE IF EXISTS special_events CASCADE;
DROP TABLE IF EXISTS physical_assets CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS exchange_rates CASCADE;
DROP TABLE IF EXISTS counterparties CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Tablas viejas que ya no se usan (Limpieza profunda)
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS operators CASCADE;
DROP TABLE IF EXISTS financial_profiles CASCADE; 
DROP TABLE IF EXISTS financial_items CASCADE;

-- Eliminación de Tipos (ENUMs)
DROP TYPE IF EXISTS transaction_type CASCADE;
DROP TYPE IF EXISTS transaction_status CASCADE;
DROP TYPE IF EXISTS currency_code CASCADE;
DROP TYPE IF EXISTS financial_platform CASCADE;

-- 1. CONFIGURACIÓN INICIAL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TIPOS DE DATOS PERSONALIZADOS (ENUMs)
-- ==============================================================================

-- Tipos de Transacciones
CREATE TYPE transaction_type AS ENUM (
    'INGRESO',           -- Salario, Ventas
    'GASTO',             -- Comida, Servicios
    'DEUDA',             -- Préstamos dados o recibidos
    'AHORRO',            -- Movimiento a fondos de ahorro
    'REMESA_ENTRADA',    -- Dinero recibido del exterior
    'REMESA_SALIDA',     -- Dinero enviado al exterior
    'INTERCAMBIO'        -- Cambio de moneda (Ej. USD a VES)
);

-- Estado de la Transacción
CREATE TYPE transaction_status AS ENUM ('PENDIENTE', 'COMPLETADO', 'REVISION', 'CANCELADO');

-- Monedas
CREATE TYPE currency_code AS ENUM ('VES', 'USD', 'EUR', 'USDT', 'OTRO');

-- Plataformas Financieras
CREATE TYPE financial_platform AS ENUM (
    'BANESCO_VE', 'MERCANTIL_VE', 'PAGO_MOVIL', 'ZELLE', 'PAYPAL',
    'BINANCE', 'EFECTIVO', 'CUENTA_PROPIA', 'BOFA', 'WELLS_FARGO', 'OTRO'
);

-- ==============================================================================
-- 3. FUNCIÓN AUXILIAR PARA AUDITORÍA
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 4. PERFIL DEL USUARIO (`user_profiles`)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    full_name TEXT,
    monthly_income DECIMAL(12, 2) DEFAULT 0,
    monthly_expenses DECIMAL(12, 2) DEFAULT 0,
    savings_goal DECIMAL(12, 2) DEFAULT 0,
    base_currency currency_code DEFAULT 'USD',
    is_operator BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own profile" ON user_profiles FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 5. ENTIDADES DE NEGOCIO
-- ==============================================================================

-- 5.1. Contrapartes (Para "Me Deben" o clientes de remesas)
CREATE TABLE counterparties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    contact_info TEXT,
    is_trusted BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE counterparties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own counterparties" ON counterparties FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_counterparties_updated_at BEFORE UPDATE ON counterparties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5.2. Historial de Tasas de Cambio
CREATE TABLE exchange_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Null user_id significa tasa del sistema (Global)
    from_currency currency_code NOT NULL,
    to_currency currency_code NOT NULL,
    rate DECIMAL(12, 4) NOT NULL,
    is_buy_rate BOOLEAN DEFAULT TRUE,
    captured_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read public and own rates" ON exchange_rates FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "Insert own rates" ON exchange_rates FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 6. TRANSACCIONES (`transactions`)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Detalles Básicos
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Valores Financieros
    type transaction_type NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    currency currency_code NOT NULL,
    exchange_rate DECIMAL(12, 4) DEFAULT 1.0000,
    
    -- Ubicación/Origen
    platform financial_platform,
    reference_id TEXT,
    
    -- Estado
    status transaction_status DEFAULT 'COMPLETADO',
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Negocio / Deudas
    counterparty_id UUID REFERENCES counterparties(id) ON DELETE SET NULL,
    commission_fee DECIMAL(15, 2) DEFAULT 0.00,
    estimated_profit_usd DECIMAL(15, 2) DEFAULT 0.00,
    
    -- Recurrencia
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_day SMALLINT CHECK (recurrence_day BETWEEN 1 AND 31),
    
    -- Evidencia
    screenshot_url TEXT,
    
    -- Auditoría OCR (Phase 1.1)
    raw_text TEXT,
    confidence_score DECIMAL(5, 4), -- 0.0000 to 1.0000
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date DESC);
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own transactions" ON transactions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 7. ACTIVOS Y EVENTOS
-- ==============================================================================

-- 7.1. Activos Físicos (Inventario / Bienes)
CREATE TABLE IF NOT EXISTS physical_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    estimated_value DECIMAL(12, 2) NOT NULL,
    currency currency_code DEFAULT 'USD',
    description TEXT,
    purchase_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE physical_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own assets" ON physical_assets FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_physical_assets_updated_at BEFORE UPDATE ON physical_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7.2. Eventos Especiales (Recordatorios)
CREATE TABLE IF NOT EXISTS special_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(50) DEFAULT 'reminder',
    related_transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE special_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own events" ON special_events FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_special_events_updated_at BEFORE UPDATE ON special_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
