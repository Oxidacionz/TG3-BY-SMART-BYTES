import React, { useState, useEffect, ReactNode } from 'react';
import { User as UserIcon, Eye as EyeIcon, Sparkles, LifeBuoy } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SmartScanner } from './components/SmartScanner';
import { Tutorial, TutorialStep } from './components/Tutorial';

// START REFACTOR: Imports from SRP Modules
import { API_URL } from './config/api';
import { useFetchData } from './hooks/useFetchData';
import { Icons } from './components/ui/Icons';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Card } from './components/ui/Card';
import { StatCard } from './components/ui/StatCard';
import { Badge } from './components/ui/Badge';
import { Modal } from './components/ui/Modal';

// Views Imports (OCP)
import { DashboardView } from './views/DashboardView';
import { TransactionsView } from './views/TransactionsView';
import { AccountsView } from './views/AccountsView';
import { ClientsView } from './views/ClientsView';
import { OperatorsView } from './views/OperatorsView';
import { NotesView } from './views/NotesView';
import { ExpensesView } from './views/ExpensesView';
import { ReportsView } from './views/ReportsView';
import { InboxView } from './views/InboxView';

// Services (DIP)
import { transactionService } from './services/transactionService';
import { ratesService } from './services/ratesService';
// END REFACTOR

/**
 * =================================================================================
 * MOLECULES
 * =================================================================================
 */



/**
 * =================================================================================
 * TEMPLATES & PAGES
 * =================================================================================
 */

// 1. Dashboard Layout Components
const SidebarItem: React.FC<{ icon: ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all relative overflow-hidden group ${active
      ? 'text-white bg-gradient-to-r from-purple-900/50 to-slate-900 border-r-4 border-amber-400'
      : 'text-slate-400 hover:text-amber-200 hover:bg-slate-800/50'
      }`}
  >
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent pointer-events-none" />
    )}
    <span className={`relative z-10 ${active ? 'text-amber-300 drop-shadow-sm' : ''}`}>{icon}</span>
    <span className={`relative z-10 ${active ? 'font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent' : ''}`}>{label}</span>
  </button>
);

const UserDropdown: React.FC<{ onRestartTutorial: () => void; onLogout: () => void; isDemoMode: boolean }> = ({ onRestartTutorial, onLogout, isDemoMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm transition-colors shadow-md ${isDemoMode ? 'bg-amber-500 hover:bg-amber-600' : 'bg-brand-800 hover:bg-brand-900 ring-2 ring-brand-600'}`}>
        {isDemoMode ? (
          <div className="relative flex items-center justify-center">
            <Icons.Camel />
            <span className="absolute -bottom-2 -right-3 bg-white text-amber-600 text-[9px] font-bold px-1 rounded-full border border-amber-500 shadow-sm">
              #1
            </span>
          </div>
        ) : (
          <Icons.Toro />
        )}
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 py-1 animate-fade-in-down">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <p className="text-sm font-bold text-slate-900 dark:text-white">{isDemoMode ? 'Operador Invitado' : 'ToroPrincipal'}</p>
              <p className={`text-xs font-bold ${isDemoMode ? 'text-amber-500' : 'text-brand-500'}`}>{isDemoMode ? 'CAMELLO / GUEST' : 'ADMIN'}</p>
              <p className="text-xs text-slate-500">{isDemoMode ? 'Entorno de Pruebas' : 'Oficina Principal'}</p>
            </div>
            {!isDemoMode && (
              <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                <Icons.Users /> Configuración
              </button>
            )}
            <button onClick={() => { setIsOpen(false); onRestartTutorial(); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
              <span className="text-amber-500">✨</span> Ver Tutorial Interactivo
            </button>
            <div className="border-t border-slate-200 dark:border-slate-700 mt-1"></div>
            <button onClick={() => { setIsOpen(false); onLogout(); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Cerrar Sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// START MOCK DATA IMPORTS
import {
  DEMO_STATS,
  DEMO_CLIENTS,
  DEMO_OPERATORS,
  DEMO_TRANSACTIONS,
  DEMO_ADMIN_NOTICES,
  DEMO_PERSONAL_NOTES,
  DEMO_MESSAGES
} from './config/mockData';
// END MOCK DATA IMPORTS

// 2. Main Application Component
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [isSupportModalOpen, setSupportModalOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showScannerTutorial, setShowScannerTutorial] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [demoTransactions, setDemoTransactions] = useState<any[]>([]);

  const SCANNER_TUTORIAL_STEPS: TutorialStep[] = [
    {
      title: 'Guía de Datos Cargados',
      description: 'El Scanner IA ha detectado los datos del comprobante. Verificaremos campo por campo.',
      target: '.form-type-selector',
      position: 'right'
    },
    {
      title: 'Monto Detectado',
      description: 'Verifica que el monto coincida exactamente con la imagen del comprobante.',
      target: '.form-amount-input',
      position: 'top'
    },
    {
      title: 'Cliente Nuevo',
      description: 'Al ser un cliente nuevo, puedes editar su nombre si el escaneo tuvo algún error.',
      target: '.form-client-input',
      position: 'top'
    },
    {
      title: 'Tasa de Cambio',
      description: 'La tasa se carga automáticamente según el operador, pero puedes ajustarla si es una excepción.',
      target: '.form-rate-input',
      position: 'top'
    },
    {
      title: 'Confirmación',
      description: 'Si todo está correcto, guarda la transacción. En modo Demo, solo se guardará en memoria temporal.',
    }
  ];

  // Check for stored session on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('toro_auth');
    if (storedAuth === 'true') {
      setIsLoggedIn(true);
      const storedDemo = localStorage.getItem('toro_is_demo');
      if (storedDemo === 'true') {
        setIsDemoMode(true);
      }
    }
  }, []);

  // Check for tutorial on mount/login
  useEffect(() => {
    if (isLoggedIn) {
      const hasSeenTutorial = localStorage.getItem('hasSeenToroTutorial');
      if (!hasSeenTutorial) {
        setShowTutorial(true);
      }
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    localStorage.setItem('toro_auth', 'true');
    // For real login, we might want to ensure demo mode is off
    setIsDemoMode(false);
    localStorage.removeItem('toro_is_demo');
  };

  const handleDemoLogin = () => {
    setIsDemoMode(true);
    setIsLoggedIn(true);
    localStorage.setItem('toro_auth', 'true');
    localStorage.setItem('toro_is_demo', 'true');
    setShowTutorial(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('toro_auth');
    localStorage.removeItem('toro_is_demo');
    window.location.reload();
  };

  // Smart Scanner Integration
  const [formData, setFormData] = useState({
    type: 'ENTRADA',
    operator: 'Camello_1',
    client: '',
    amount: '',
    currency: 'USD',
    rate: '36.00',
    commission: '',
    receivingAccount: '',
    bankOrigin: '',
    reference: '',
    notes: '',
    appliesBankFee: false, // New: Indicates if bank charges commission
    bankFeePercentage: '0.30' // New: Default to common 0.3% for transfers in VE
  });

  const handleScanComplete = (data: any) => {
    // Map SmartScanner (AI) result to form state
    // data corresponds to TransactionReceipt schema: 
    // { platform, amount, currency, reference_id, transaction_date, sender_name, ... }

    setFormData(prev => ({
      ...prev,
      amount: data.amount ? String(data.amount) : prev.amount,
      reference: data.reference_id || prev.reference,
      bankOrigin: data.platform || prev.bankOrigin,
      currency: data.currency || prev.currency,
      // Infer type (simplified logic, ideally AI analyzes this too)
      // If receiver is us, it's ENTRADA. If sender is us, it's SALIDA. keeping default for now.
      notes: `Detectado: ${data.platform} - ${data.raw_text_snippet || ''}`.substring(0, 100),
      // Heuristic: If platform is BANCO_DE_VENEZUELA, maybe set default fee? Keeping it manual for now as requested.
    }));
  };

  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleBankFee = () => {
    setFormData(prev => ({ ...prev, appliesBankFee: !prev.appliesBankFee }));
  };

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);



  // Fetch Data from Backend (or use Demo Data)
  const { data: rawTransactions, refetch: refetchTransactions } = useFetchData('/transactions/', []);
  const { data: rawStats, refetch: refetchStats } = useFetchData('/stats/', { chart_data: [], ticker: { global_rate: "---", bcv_usd: "---", binance_buy: "---", binance_sell: "---", zelle: "---" }, volume: 0, net_profit: 0, pending_count: 0 });
  const { data: clients } = useFetchData('/resources/clients', []);
  const { data: operators } = useFetchData('/resources/operators', []);

  // Compute final display data
  const stats = isDemoMode ? DEMO_STATS : rawStats;
  const transactions = isDemoMode ? [...demoTransactions, ...DEMO_TRANSACTIONS] : rawTransactions;

  // Submit Transaction Handler
  const handleSubmitTransaction = async () => {
    if (isDemoMode) {
      // 1. Mock Save
      const newTx = {
        ...formData,
        id: `DEMO-${Date.now()}`,
        status: 'PENDIENTE',
        date: new Date().toISOString(),
        // Ensure numbers are numbers
        amount: parseFloat(formData.amount) || 0,
        rate: parseFloat(formData.rate) || 0,
        commission: parseFloat(formData.commission) || 0
      };
      setDemoTransactions(prev => [newTx, ...prev]);
      setTransactionModalOpen(false);
      // Show success feedback
      alert("Operación registrada en MODO DEMO (Temporal)");
      return;
    }

    try {
      await transactionService.createTransaction(formData);
      await refetchTransactions();
      setTransactionModalOpen(false);
      // Reset form or set success message
      setFormData({
        type: 'ENTRADA',
        operator: 'Camello_1',
        client: '',
        amount: '',
        currency: 'USD',
        rate: '36.00',
        commission: '',
        receivingAccount: '',
        bankOrigin: '',
        reference: '',
        notes: '',
        appliesBankFee: false,
        bankFeePercentage: '0.30'
      });
    } catch (e) {
      console.error("Error saving transaction", e);
    }
  };

  // Force Refresh Rates Handler
  const [isRefreshingRates, setIsRefreshingRates] = useState(false);
  const handleRefreshRates = async () => {
    setIsRefreshingRates(true);
    try {
      await ratesService.forceRefresh();
      // Wait a bit for DB to settle if needed, then refetch
      setTimeout(() => refetchStats(), 1000);
    } catch (e) {
      console.error("Error refreshing rates", e);
    } finally {
      setIsRefreshingRates(false);
    }
  };

  // --- LOGIN SCREEN ---
  // --- LOGIN SCREEN (New Design) ---
  if (!isLoggedIn) {
    return (
      // Asegúrate de guardar la imagen que descargaste en tu carpeta /public
      // y llámala, por ejemplo, 'fondo-trading.png'
      <div
        className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans bg-cover bg-center"
        style={{ backgroundImage: "url('/TG3-BY-SMART-BYTES/final_fused_bg.png')" }}
      >
        {/* Capa oscura encima para asegurar que el texto se lea bien.
           Ajusta el 'opacity-60' según qué tan brillante quieras el fondo.
        */}
        <div className="absolute inset-0 bg-[#050b14] opacity-70 z-0"></div>

        {/* --- MAIN CARD --- */}
        <div className="relative z-10 w-full max-w-md p-[1px] rounded-3xl bg-gradient-to-b from-yellow-600/40 via-transparent to-yellow-600/40 shadow-2xl mt-12">
          <div className="bg-[#0f172a]/90 backdrop-blur-xl rounded-3xl w-full h-full p-8 pt-16 border border-white/5 relative flex flex-col items-center">

            {/* --- LOGO (Overlapping Top) - ADJUSTED FOR REFERENCE IMAGE --- */}
            <div className="absolute -top-20 z-20 p-1 rounded-full bg-gradient-to-b from-yellow-500/50 to-transparent">
              <div className="w-36 h-36 rounded-full bg-slate-800 border-4 border-slate-900 overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.4)]">
                {/* Increased size (w-36 h-36) and negative top margin (-top-20) to overlap more */}
                <img
                  src="/TG3-BY-SMART-BYTES/gold_bull.png"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://kkkwfimgkemxwgvqvaob.supabase.co/storage/v1/object/public/assets/toro_logo.png";
                  }}
                  alt="Toro Logo"
                  className="w-full h-full object-cover scale-[1.15]"
                />
              </div>
            </div>

            {/* Title Section */}
            <div className="mt-10 mb-6 text-center">
              <h1 className="text-3xl font-bold text-white tracking-wide drop-shadow-lg">TORO GROUP</h1>
              <h2 className="text-yellow-500 text-sm font-semibold tracking-[0.2em] mt-2 border-b border-yellow-500/20 pb-2 inline-block">FINANCIAL SERVICES</h2>
            </div>

            {/* --- FORM --- */}
            <form onSubmit={handleLogin} className="w-full space-y-5">

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Usuario</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-yellow-500 transition-colors">
                    <UserIcon size={20} />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent transition-all font-medium"
                    placeholder="Ingrese su usuario"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Contraseña</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-yellow-500 transition-colors">
                    <EyeIcon size={20} />
                  </div>
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent transition-all font-bold tracking-widest"
                    placeholder="........"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-3.5 mt-4 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/40 transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-blue-500/30">
                Iniciar Sesión
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-700/50"></div>
                <span className="flex-shrink-0 mx-4 text-[10px] text-slate-500 uppercase tracking-widest">O explora</span>
                <div className="flex-grow border-t border-slate-700/50"></div>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-3 border border-yellow-500/20 hover:bg-yellow-500/10 text-yellow-500 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all group backdrop-blur-sm"
              >
                Modo Demo Interactivo
                <Sparkles size={16} className="text-yellow-400 group-hover:animate-pulse" />
              </button>

            </form>

            {/* --- FOOTER --- */}
            <div className="mt-8 w-full border-t border-slate-800/50 pt-4 flex flex-col items-center">
              <div className="w-full flex justify-between items-center text-[10px] text-slate-500 mb-2 px-2">
                <span>v2.5.0 Stable</span>
                <div className="flex items-center gap-1 opacity-70 hover:opacity-100 cursor-pointer transition-opacity">
                  <LifeBuoy size={10} />
                  <span>Soporte 24/7</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center opacity-60 hover:opacity-90 transition-opacity duration-500">
                <span className="text-[9px] text-slate-600 uppercase tracking-[0.2em] mb-1">Developed By</span>
                <span className="font-serif italic text-yellow-500/80 text-lg tracking-wide" style={{ fontFamily: 'serif' }}>
                  SmartBytes.PF
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }




  // --- MAIN APP ---
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {showTutorial && <Tutorial onComplete={() => { setShowTutorial(false); localStorage.setItem('hasSeenToroTutorial', 'true'); }} />}
      {showScannerTutorial && <Tutorial steps={SCANNER_TUTORIAL_STEPS} onComplete={() => setShowScannerTutorial(false)} />}

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 z-20 relative overflow-hidden">
        {/* Sidebar Background Gradient Decoration */}
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />

        <div className="p-6 flex flex-col items-center border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white relative group cursor-pointer overflow-hidden ring-2 ring-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-600 to-yellow-400 group-hover:scale-110 transition-transform"></div>
              <div className="relative z-10"><Icons.Toro /></div>
            </div>
            <div>
              <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-100 font-bold text-lg leading-none">Toro Group</h2>
              <p className="text-xs text-amber-500/80 font-medium tracking-wide">Gestión Financiera</p>
            </div>
          </div>
        </div>

        <div className="p-4 smart-scanner-section relative z-10">
          <button
            onClick={() => setTransactionModalOpen(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-900/50 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] scanner-button border border-purple-400/30 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <Icons.Scan />
            <span className="tracking-wide">Escanear / Nuevo</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 space-y-1 sidebar-navigation relative z-10 scrollbar-thin scrollbar-thumb-slate-800">
          <SidebarItem icon={<Icons.Dashboard />} label="Dashboard" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
          <SidebarItem icon={<Icons.Inbox />} label="Mensajes (Inbox)" active={currentView === 'inbox'} onClick={() => setCurrentView('inbox')} />
          <SidebarItem icon={<Icons.Transactions />} label="Transacciones" active={currentView === 'transactions'} onClick={() => setCurrentView('transactions')} />
          <SidebarItem icon={<Icons.Wallet />} label="Cuentas & Bancos" active={currentView === 'accounts'} onClick={() => setCurrentView('accounts')} />
          <SidebarItem icon={<Icons.Users />} label="Clientes" active={currentView === 'clients'} onClick={() => setCurrentView('clients')} />
          <SidebarItem icon={<Icons.Camellos />} label="Camellos" active={currentView === 'operators'} onClick={() => setCurrentView('operators')} />
          <SidebarItem icon={<Icons.Notes />} label="Notas" active={currentView === 'notes'} onClick={() => setCurrentView('notes')} />
          <SidebarItem icon={<Icons.Expenses />} label="Gastos" active={currentView === 'expenses'} onClick={() => setCurrentView('expenses')} />
          <SidebarItem icon={<Icons.Reports />} label="Reportes" active={currentView === 'reports'} onClick={() => setCurrentView('reports')} />
        </nav>

        <div className="p-4 bg-slate-900/80 backdrop-blur-sm border-t border-slate-800 relative z-10">
          <button
            onClick={() => setSupportModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors border border-transparent hover:border-slate-600"
          >
            <Icons.Support /> Soporte Técnico
          </button>
          <div className="mt-6 select-none pointer-events-none flex flex-col items-center justify-center w-full pb-2">
            <span className="text-[8px] text-slate-600 uppercase tracking-[0.3em] font-light mb-0.5">Developed by</span>
            <h1 className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 opacity-80" style={{ fontFamily: '"Brush Script MT", "Segoe Script", cursive', fontStyle: 'italic' }}>
              SmartBytes.PF
            </h1>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {/* TOP HEADER */}
        <header className="bg-white dark:bg-slate-900 h-16 border-b border-transparent flex items-center justify-between px-6 flex-shrink-0 relative">
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent capitalize drop-shadow-sm">
              {currentView === 'operators' ? 'Operadores' : currentView}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
            <button className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors relative">
              <Icons.Bell />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <UserDropdown onRestartTutorial={() => setShowTutorial(true)} onLogout={handleLogout} isDemoMode={isDemoMode} />
          </div>
        </header>

        {/* CONTENT SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">

          {currentView === 'dashboard' && (
            <DashboardView
              stats={stats}
              chartType={chartType}
              setChartType={setChartType}
              isDemoMode={isDemoMode}
              onRefreshRates={handleRefreshRates}
              isRefreshingRates={isRefreshingRates}
            />
          )}

          {currentView === 'transactions' && (
            <TransactionsView
              transactions={transactions}
              onNewTransaction={() => setTransactionModalOpen(true)}
              isDemoMode={isDemoMode}
              demoTransactions={demoTransactions}
            />
          )}

          {currentView === 'accounts' && <AccountsView />}

          {currentView === 'clients' && (
            <ClientsView
              isDemoMode={isDemoMode}
              clients={clients}
              demoClients={DEMO_CLIENTS}
            />
          )}

          {currentView === 'operators' && (
            <OperatorsView
              isDemoMode={isDemoMode}
              operators={operators}
              demoOperators={DEMO_OPERATORS}
            />
          )}

          {currentView === 'notes' && <NotesView />}

          {currentView === 'expenses' && <ExpensesView />}

          {currentView === 'reports' && <ReportsView />}

          {currentView === 'inbox' && (
            <InboxView
              isDemoMode={isDemoMode}
              demoMessages={DEMO_MESSAGES}
            />
          )}

        </div>
      </main>

      {/* --- MODALS --- */}

      {/* --- MODALS --- */}

      {/* 1. New Transaction Modal */}
      <Modal
        isOpen={isTransactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        title="Registrar Transacción"
        size="lg"
      >
        <div className="flex flex-col md:flex-row gap-6 relative">
          {/* Local Tutorial Overlay for Scanner */}
          {/* Local Tutorial Overlay for Scanner - MOVED TO ROOT */}

          {/* Scan Section */}
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <SmartScanner onScanComplete={handleScanComplete} />
            {isDemoMode && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800/30 animate-fade-in text-center">
                <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-2 flex items-center justify-center gap-1"><Icons.Camel /> Modo Demostración</h4>
                <p className="text-[10px] text-slate-500 mb-3">Simula el reconocimiento IA de un comprobante y aprende a validar los datos.</p>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    // 1. Simulate Scan Data
                    handleScanComplete({
                      amount: 1250.00,
                      currency: 'USD',
                      reference_id: 'Ref-88772233',
                      platform: 'ZELLE',
                      raw_text_snippet: 'Zelle Payment Verified'
                    });

                    // 2. Auto-fill fields
                    setFormData(prev => ({
                      ...prev,
                      client: 'Cliente Demo VIP',
                      bankOrigin: 'Wells Fargo',
                      notes: 'Comprobante procesado automáticamente por SmartScanner AI (Demo Mode)',
                      operator: 'Camello Invitado' // Force operator
                    }));

                    // 3. Trigger Tutorial Guide
                    setShowScannerTutorial(true);
                  }}
                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 dark:text-amber-400"
                >
                  <span className="mr-2">✨</span> Simular Carga & Guía
                </Button>
              </div>
            )}
          </div>

          {/* Form Section */}
          <div className="flex-1 space-y-4 relative">
            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Tipo de Operación</label>
                <select name="type" value={formData.type} onChange={handleInputChange} className="w-full p-2 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none transition-all form-type-selector">
                  <option value="ENTRADA">ENTRADA (Compra)</option>
                  <option value="SALIDA">SALIDA (Venta)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Operador (Camello)</label>
                <select
                  name="operator"
                  value={isDemoMode ? 'Camello Invitado' : formData.operator}
                  onChange={handleInputChange}
                  disabled={isDemoMode}
                  className={`w-full p-2 rounded border border-slate-200 dark:border-slate-700 outline-none transition-all ${isDemoMode ? 'bg-amber-50 text-amber-600 border-amber-200 opacity-80 cursor-not-allowed font-bold' : 'bg-slate-100 dark:bg-slate-800'}`}
                >
                  {isDemoMode ? (
                    <option value="Camello Invitado">Camello Invitado (Demo)</option>
                  ) : (
                    <>
                      <option value="Camello_1">Camello_1</option>
                      <option value="Camello 2">Camello 2</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase">Cliente</label>
                <div className="flex gap-1">
                  <button className="text-xs text-slate-400 bg-slate-100 px-2 rounded hover:bg-slate-200"><Icons.Users /> Frecuente</button>
                  <button className="text-xs text-brand-600 bg-blue-50 px-2 rounded hover:bg-blue-100"><Icons.Plus /> Nuevo</button>
                </div>
              </div>
              <Input name="client" value={formData.client} onChange={handleInputChange} placeholder="Nombre completo del nuevo cliente" className="form-client-input" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Monto</label>
                <div className="flex gap-2">
                  <Input name="amount" type="number" value={formData.amount} onChange={handleInputChange} placeholder="0.00" className="flex-1 font-bold text-slate-800 dark:text-white form-amount-input" />
                  <select name="currency" value={formData.currency} onChange={handleInputChange} className="bg-slate-700 text-white rounded px-2 text-sm"><option value="VES">VES</option><option value="USD">USD</option></select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Tasa de Cambio</label>
                <Input name="rate" type="number" value={formData.rate} onChange={handleInputChange} placeholder="36.00" className="form-rate-input" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Comisión (VES)</label>
                <Input name="commission" type="number" value={formData.commission} onChange={handleInputChange} placeholder="0.00" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Cuenta que RECIBE Dinero</label>
                <select name="receivingAccount" value={formData.receivingAccount} onChange={handleInputChange} className="w-full p-2 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-sm h-[38px]">
                  <option value="">Seleccionar cuenta interna...</option>
                  <option value="Banesco Panama">Banesco Panama</option>
                  <option value="Binance">Binance</option>
                  <option value="Zelle">Zelle</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Banco Origen</label>
                <Input name="bankOrigin" value={formData.bankOrigin} onChange={handleInputChange} placeholder="Ej. Banesco, Mercantil..." />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Número de Referencia / Operación</label>
                <Input name="reference" value={formData.reference} onChange={handleInputChange} placeholder="Ej. 12345678" />
              </div>
            </div>

            {/* Bank Commission Section */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="appliesBankFee"
                    checked={formData.appliesBankFee}
                    onChange={handleToggleBankFee}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 cursor-pointer"
                  />
                  <label htmlFor="appliesBankFee" className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase cursor-pointer select-none">
                    Aplica Comisión Bancaria?
                  </label>
                </div>
                {formData.appliesBankFee && (
                  <span className="text-xs text-brand-600 font-medium bg-brand-50 px-2 py-0.5 rounded">
                    Activo
                  </span>
                )}
              </div>

              {formData.appliesBankFee && (
                <div className="grid grid-cols-2 gap-4 animate-fade-in-down">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">Porcentaje (%)</label>
                    <Input
                      name="bankFeePercentage"
                      type="number"
                      value={formData.bankFeePercentage}
                      onChange={handleInputChange}
                      placeholder="Ej. 0.30"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">Monto Calculado</label>
                    <div className="w-full p-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-sm font-mono border border-slate-300 dark:border-slate-600">
                      {formData.amount && formData.bankFeePercentage
                        ? (parseFloat(formData.amount) * (parseFloat(formData.bankFeePercentage) / 100)).toFixed(2)
                        : '0.00'}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-slate-400">
                      * Para Banco de Venezuela y transferencias interbancarias, consulte el tarifario oficial.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Ganancia Estimada (USD)</label>
              <div className="w-full p-2 bg-green-900/20 text-green-600 dark:text-green-400 font-bold rounded border border-green-900/30">
                0
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Notas Adicionales</label>
              <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-sm" rows={2} placeholder="Opcional..."></textarea>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setTransactionModalOpen(false)}>Cancelar</Button>
              <Button variant="primary" onClick={handleSubmitTransaction}>
                {isDemoMode ? 'Guardar (Demo Temporales)' : 'Guardar Transacción'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* 2. Support Modal */}
      <Modal
        isOpen={isSupportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        title="Soporte Técnico"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Envía un reporte directo a nuestro equipo de soporte.</p>
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Asunto</label>
            <Input placeholder="Ej. Problema con tasa, Error en sistema..." />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Descripción</label>
            <textarea className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" rows={4} placeholder="Describa el problema o solicitud detalladamente..."></textarea>
          </div>
          <Button className="w-full" icon={<Icons.Send />}>Enviar Correo</Button>
        </div>
      </Modal>

    </div>
  );
};

export default App;