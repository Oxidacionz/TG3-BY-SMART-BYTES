import { z } from 'zod';

/**
 * Zod Validation Schemas
 * Ensures data integrity and type safety
 */

// Currency enum
export const CurrencySchema = z.enum(['USD', 'VES', 'EUR', 'USDT', 'COP']);

// Transaction type enum
export const TransactionTypeSchema = z.enum(['ENTRADA', 'SALIDA']);

// Transaction status enum
export const TransactionStatusSchema = z.enum([
    'PENDIENTE',
    'COMPLETADO',
    'FALLIDO',
    'REVISION'
]);

// Platform enum
export const PlatformSchema = z.enum([
    'BANESCO_VE',
    'MERCANTIL_VE',
    'BANCO_DE_VENEZUELA',
    'PAGO_MOVIL_GENERICO',
    'ZELLE',
    'BINANCE',
    'BANK_OF_AMERICA',
    'CHASE',
    'ZINLI',
    'PAYPAL',
    'WISE',
    'REVOLUT',
    'UNKNOWN'
]);

/**
 * Complete Comprobante Schema
 * Validates all fields of a transaction receipt
 */
export const ComprobanteSchema = z.object({
    id: z.string().uuid().optional(),
    fecha: z.string().regex(
        /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/,
        'Fecha debe estar en formato YYYY-MM-DD o YYYY-MM-DDTHH:MM:SS'
    ),
    monto: z.number().positive('El monto debe ser positivo'),
    referencia: z.string().min(1, 'La referencia no puede estar vacía'),
    bancoEmisor: z.string().min(1, 'Banco emisor requerido'),
    bancoReceptor: z.string().min(1, 'Banco receptor requerido'),
    moneda: CurrencySchema,
    tipoTransaccion: TransactionTypeSchema,
    metodoPago: z.string(),
    remitente: z.string(),
    beneficiario: z.string(),
    operador: z.string(),
    tasa: z.number().positive('La tasa debe ser positiva'),
    comision: z.number().min(0, 'La comisión no puede ser negativa'),
    confianza: z.number().min(0).max(1, 'Confianza debe estar entre 0 y 1'),
    status: TransactionStatusSchema,
    timestamp: z.string().datetime().optional(),
    imageUrl: z.string().optional(),
    manuallyReviewed: z.boolean().optional(),
    clientId: z.string().optional()
});

/**
 * Partial schema for API responses
 * Allows missing fields that will be filled by the form
 */
export const PartialComprobanteSchema = ComprobanteSchema.partial();

/**
 * Schema for Gemini API response
 * Only validates the fields that Gemini returns
 */
export const GeminiResponseSchema = z.object({
    fecha: z.string().optional(),
    monto: z.number().optional(),
    referencia: z.string().optional(),
    bancoEmisor: z.string().optional(),
    bancoReceptor: z.string().optional(),
    moneda: CurrencySchema.optional(),
    tipoTransaccion: TransactionTypeSchema.optional(),
    remitente: z.string().optional(),
    beneficiario: z.string().optional(),
    confianza: z.number().min(0).max(1).optional(),
    platform: PlatformSchema.optional()
});

/**
 * Type inference from schemas
 */
export type ValidatedComprobante = z.infer<typeof ComprobanteSchema>;
export type PartialComprobante = z.infer<typeof PartialComprobanteSchema>;
export type GeminiResponse = z.infer<typeof GeminiResponseSchema>;
export type Currency = z.infer<typeof CurrencySchema>;
export type TransactionType = z.infer<typeof TransactionTypeSchema>;
export type TransactionStatus = z.infer<typeof TransactionStatusSchema>;
export type Platform = z.infer<typeof PlatformSchema>;

/**
 * Validation helper functions
 */
export const validateComprobante = (data: unknown): ValidatedComprobante => {
    return ComprobanteSchema.parse(data);
};

export const validatePartialComprobante = (data: unknown): PartialComprobante => {
    return PartialComprobanteSchema.parse(data);
};

export const validateGeminiResponse = (data: unknown): GeminiResponse => {
    return GeminiResponseSchema.parse(data);
};
