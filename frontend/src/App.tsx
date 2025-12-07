import React, { useState, useEffect, ReactNode } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SmartScanner } from './components/SmartScanner';

/**
 * =================================================================================
 * ICONS (Atoms)
 * Inline SVGs to ensure 100% offline compatibility without external fonts/libraries
 * =================================================================================
 */
const Icons = {
  Dashboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>,
  Transactions: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M12 12v.01" /></svg>,
  Wallet: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  Camellos: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  Notes: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>,
  Expenses: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>,
  Reports: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10" /><line x1="12" x2="12" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="14" /></svg>,
  Support: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5 0-2.2-1.8-4-4-4s-4 1.8-4 4c0 1.5.5 2.5 1.5 3.5.8.8 1.3 1.5 1.5 2.5" /><path d="M12 18h.01" /><circle cx="12" cy="12" r="10" /></svg>,
  Moon: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>,
  Sun: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" x2="12" y1="1" y2="3" /><line x1="12" x2="12" y1="21" y2="23" /><line x1="4.22" x2="5.64" y1="4.22" y2="5.64" /><line x1="18.36" x2="19.78" y1="18.36" y2="19.78" /><line x1="1" x2="3" y1="12" y2="12" /><line x1="21" x2="23" y1="12" y2="12" /><line x1="4.22" x2="5.64" y1="19.78" y2="18.36" /><line x1="18.36" x2="19.78" y1="5.64" y2="4.22" /></svg>,
  Bell: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>,
  Scan: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /></svg>,
  Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>,
  ChevronDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>,
  Close: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="M6 6 18 18" /></svg>,
  Camera: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>,
  Upload: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>,
  Printer: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect width="12" height="8" x="6" y="14" /></svg>,
  Download: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>,
  Send: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
  Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  Refresh: () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>,
};

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8002/api/v1' : 'https://tg3-by-smart-bytes.onrender.com/api/v1');

// Generic Fetch Hook or functions could be used, but keeping it simple inside App
const useFetchData = (endpoint: string, initialValue: any) => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`);
      if (!res.ok) throw new Error('Network error');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * =================================================================================
 * ATOMIC COMPONENTS
 * =================================================================================
 */

// 1. Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
}
const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', icon, className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";

  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 shadow-md shadow-blue-500/30",
    secondary: "bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-500",
    outline: "border border-slate-300 dark:border-slate-600 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
    ghost: "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// 2. Input
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow ${className}`}
      {...props}
    />
  );
});
Input.displayName = "Input";

// 3. Card
const Card: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>
    {children}
  </div>
);

// 4. Badge
const Badge: React.FC<{ status: string }> = ({ status }) => {
  let colorClass = "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300";
  if (status === 'Completado') colorClass = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800";
  if (status === 'Pendiente') colorClass = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800";
  if (status === 'Cancelado') colorClass = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800";

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
};

/**
 * =================================================================================
 * MOLECULES
 * =================================================================================
 */

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' }> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const widthClass = size === 'lg' ? 'max-w-4xl' : size === 'sm' ? 'max-w-md' : 'max-w-2xl';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full ${widthClass} border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <Icons.Close />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; subtext: string; icon?: ReactNode; trend?: 'up' | 'down' | 'neutral', color?: 'blue' | 'green' | 'yellow' }> = ({ title, value, subtext, icon, color = 'blue' }) => {
  const colors = {
    blue: "text-brand-600 bg-brand-50 dark:bg-brand-900/20 dark:text-brand-400",
    green: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400",
    yellow: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400",
  };

  return (
    <Card className="p-4 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <p className={`text-xs mt-2 ${colors[color].split(' ')[0]}`}>{subtext}</p>
    </Card>
  );
};

/**
 * =================================================================================
 * TEMPLATES & PAGES
 * =================================================================================
 */

// 1. Dashboard Layout Components
const SidebarItem: React.FC<{ icon: ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${active
      ? 'text-brand-400 bg-slate-800 border-r-2 border-brand-500'
      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
      }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 transition-colors">
        T
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 py-1 animate-fade-in-down">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <p className="text-sm font-bold text-slate-900 dark:text-white">ToroPrincipal</p>
              <p className="text-xs text-brand-500 font-bold">ADMIN</p>
              <p className="text-xs text-slate-500">Oficina Principal</p>
            </div>
            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
              <Icons.Users /> Configuración
            </button>
            <div className="border-t border-slate-200 dark:border-slate-700 mt-1"></div>
            <button onClick={() => window.location.reload()} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Cerrar Sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// 2. Main Application Component
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [isSupportModalOpen, setSupportModalOpen] = useState(false);

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

  // Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  // Fetch Data from Backend
  const { data: transactions, refetch: refetchTransactions } = useFetchData('/transactions/', []);
  const { data: stats, refetch: refetchStats } = useFetchData('/stats/', { chart_data: [], ticker: { global_rate: "---", bcv_usd: "---", binance_buy: "---", binance_sell: "---", zelle: "---" }, volume: 0, net_profit: 0, pending_count: 0 });
  const { data: clients } = useFetchData('/resources/clients', []);
  const { data: operators } = useFetchData('/resources/operators', []);

  // Submit Transaction Handler
  const handleSubmitTransaction = async () => {
    try {
      const res = await fetch(`${API_URL}/transactions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
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
      }
    } catch (e) {
      console.error("Error saving transaction", e);
    }
  };

  // Force Refresh Rates Handler
  const [isRefreshingRates, setIsRefreshingRates] = useState(false);
  const handleRefreshRates = async () => {
    setIsRefreshingRates(true);
    try {
      await fetch(`${API_URL}/rates/force-refresh`, { method: 'POST' });
      // Wait a bit for DB to settle if needed, then refetch
      setTimeout(() => refetchStats(), 1000);
    } catch (e) {
      console.error("Error refreshing rates", e);
    } finally {
      setIsRefreshingRates(false);
    }
  };

  // --- LOGIN SCREEN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200">
          <div className="bg-brand-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-brand-600 mb-4 shadow-lg">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
              </div>
              <h1 className="text-2xl font-bold text-white">TORO GROUP</h1>
              <p className="text-blue-100 text-sm mt-1">Sistema de Gestión Financiera</p>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="absolute top-4 right-4 text-white/70 hover:text-white"
            >
              {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>

          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Usuario o Email</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icons.Users />
                  </div>
                  <Input placeholder="Ingrese su usuario" className="pl-10" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Contraseña</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg>
                  </div>
                  <Input type="password" placeholder="••••••••" className="pl-10" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <Icons.Eye />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                <label htmlFor="remember" className="text-sm text-slate-600">Recordar mis datos</label>
              </div>

              <Button type="submit" className="w-full justify-center">
                Iniciar Sesión <span className="ml-2">→</span>
              </Button>
            </form>

            <div className="mt-6 text-center text-sm space-y-2">
              <a href="#" className="block text-slate-500 hover:text-brand-600">¿Olvidaste tu contraseña?</a>
              <button className="text-brand-600 font-medium flex items-center justify-center gap-1 w-full hover:underline">
                <Icons.Support /> Contactar Soporte Técnico
              </button>
              <p className="text-xs text-slate-400 mt-4">Powered by <span className="font-bold text-slate-500">SmartBytes.pf</span></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN APP ---
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 z-20">
        <div className="p-6 flex flex-col items-center border-b border-slate-800">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-none">Toro Group</h2>
              <p className="text-xs text-slate-500">Gestión Financiera</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <button
            onClick={() => setTransactionModalOpen(true)}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-900/50 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
          >
            <Icons.Scan /> Escanear / Nuevo
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 space-y-1">
          <SidebarItem icon={<Icons.Dashboard />} label="Dashboard" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
          <SidebarItem icon={<Icons.Transactions />} label="Transacciones" active={currentView === 'transactions'} onClick={() => setCurrentView('transactions')} />
          <SidebarItem icon={<Icons.Wallet />} label="Cuentas & Bancos" active={currentView === 'accounts'} onClick={() => setCurrentView('accounts')} />
          <SidebarItem icon={<Icons.Users />} label="Clientes" active={currentView === 'clients'} onClick={() => setCurrentView('clients')} />
          <SidebarItem icon={<Icons.Camellos />} label="Camellos" active={currentView === 'operators'} onClick={() => setCurrentView('operators')} />
          <SidebarItem icon={<Icons.Notes />} label="Notas" active={currentView === 'notes'} onClick={() => setCurrentView('notes')} />
          <SidebarItem icon={<Icons.Expenses />} label="Gastos" active={currentView === 'expenses'} onClick={() => setCurrentView('expenses')} />
          <SidebarItem icon={<Icons.Reports />} label="Reportes" active={currentView === 'reports'} onClick={() => setCurrentView('reports')} />
        </nav>

        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <button
            onClick={() => setSupportModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
          >
            <Icons.Support /> Soporte Técnico
          </button>
          <div className="text-center mt-4">
            <p className="text-[10px] text-slate-600 uppercase tracking-wider">Dev by SmartBytes.pf</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {/* TOP HEADER */}
        <header className="bg-white dark:bg-slate-900 h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white capitalize">
              {currentView === 'operators' ? 'Operadores' : currentView}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">
              {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
            <button className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors relative">
              <Icons.Bell />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <UserDropdown />
          </div>
        </header>

        {/* CONTENT SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">

          {/* VIEW: DASHBOARD */}
          {currentView === 'dashboard' && (
            <div className="space-y-6">
              {/* Ticker */}
              <div className="bg-slate-900 rounded-xl p-1 text-white flex items-center shadow-lg overflow-hidden">
                <div className="bg-brand-600 px-4 py-3 rounded-lg flex flex-col items-center min-w-[120px]">
                  <span className="text-xs opacity-80 flex items-center gap-2">
                    Tasa Promedio Global
                    <button onClick={handleRefreshRates} className={`hover:text-white text-brand-200 transition-colors ${isRefreshingRates ? 'animate-spin' : ''}`} title="Forzar actualización de tasas">
                      <Icons.Refresh />
                    </button>
                  </span>
                  <span className="text-xl font-bold">{stats.ticker?.global_rate || '---'}</span>
                </div>
                <div className="flex-1 flex items-center justify-between px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-brand-400">
                      <Icons.Clock />
                    </div>
                    <div className="text-sm">
                      <p className="font-mono">03:33:32 p. m.</p>
                      <p className="text-xs text-slate-400 uppercase">Viernes, 28 de Noviembre de 2025</p>
                    </div>
                  </div>

                  <div className="flex gap-8 text-sm">
                    <div className="text-right">
                      <div className="text-xs text-slate-400 flex items-center justify-end gap-1"><Icons.Refresh /> BCV Oficial</div>
                      <div className="font-bold">$ {stats.ticker?.bcv_usd}</div>
                      <div className="text-xs text-slate-500">€ {stats.ticker?.bcv_eur || '---'}</div>
                    </div>
                    <div className="text-right border-l border-slate-700 pl-8">
                      <div className="text-xs text-slate-400 flex items-center justify-end gap-1"><Icons.Refresh /> Binance P2P</div>
                      <div className="font-bold text-yellow-400">BUY {stats.ticker?.binance_buy}</div>
                      <div className="text-xs text-yellow-600">SELL {stats.ticker?.binance_sell}</div>
                    </div>
                    <div className="text-right border-l border-slate-700 pl-8">
                      <div className="text-xs text-slate-400">Zelle</div>
                      <div className="font-bold text-green-400">{stats.ticker?.zelle}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Volumen Total"
                  value={`$${stats.volume}`}
                  subtext="↗ General"
                  icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4 4-6 6"></path></svg>}
                  color="blue"
                />
                <StatCard
                  title="Ganancia Neta"
                  value={`$${stats.net_profit}`}
                  subtext="Margen global"
                  icon={<span className="text-xl font-bold">$</span>}
                  color="green"
                />
                <StatCard
                  title="Pendientes"
                  value={`${stats.pending_count}`}
                  subtext="Por verificar"
                  icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>}
                  color="yellow"
                />
              </div>

              {/* Chart Section */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Tendencia de Volumen vs Ganancia</h3>
                  <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                    <button className="p-2 bg-white dark:bg-slate-600 rounded shadow-sm text-slate-800 dark:text-white"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg></button>
                    <button className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg></button>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.chart_data || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Line type="monotone" dataKey="volume" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}

          {/* VIEW: TRANSACTIONS */}
          {currentView === 'transactions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Transacciones</h2>
                  <p className="text-sm text-slate-500">Historial de operaciones y estados</p>
                </div>
                <Button variant="primary" onClick={() => setTransactionModalOpen(true)} icon={<Icons.Scan />}>Escanear Comprobante</Button>
              </div>

              {/* Filters */}
              <Card className="p-4 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icons.Search /></div>
                  <Input placeholder="Buscar por cliente, referencia o nota..." className="pl-10" />
                </div>
                <div className="flex gap-2">
                  <select className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none">
                    <option>Todos los Tipos</option>
                    <option>Entrada</option>
                    <option>Salida</option>
                  </select>
                  <select className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none">
                    <option>Todos los Estados</option>
                    <option>Completado</option>
                    <option>Pendiente</option>
                  </select>
                </div>
              </Card>

              {/* Table */}
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">FECHA / ID</th>
                        <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">REFERENCIA</th>
                        <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">CLIENTE</th>
                        <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">MONTO</th>
                        <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">OPERADOR</th>
                        <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">TASA / GANANCIA</th>
                        <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">ESTADO</th>
                        <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {(transactions || []).map((tx: any) => (
                        <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-slate-900 dark:text-white font-medium">{tx.date}</div>
                            <div className="text-xs text-slate-500">{tx.id}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-mono">{tx.ref}</td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900 dark:text-white">{tx.client}</div>
                            <div className="text-xs text-slate-500">{tx.clientBank}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`p-1 rounded ${tx.type === 'ENTRADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {tx.type === 'ENTRADA' ? <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg> : <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>}
                              </span>
                              <span className="font-bold">{tx.amount} {tx.currency}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
                                {tx.operator ? tx.operator.charAt(0) : '?'}
                              </div>
                              <span>{tx.operator}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs text-slate-500">Tasa: {tx.rate}</div>
                            <div className="text-green-600 text-xs font-bold">+{tx.profit} USD</div>
                          </td>
                          <td className="px-6 py-4"><Badge status={tx.status} /></td>
                          <td className="px-6 py-4 text-center text-slate-400">--</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* VIEW: ACCOUNTS */}
          {currentView === 'accounts' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button variant="secondary" icon={<Icons.Plus />}>Agregar Cuenta</Button>
              </div>

              {/* International */}
              <div className="border-l-4 border-brand-500 pl-4 mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Bancos Internacionales & Crypto</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <Card className="p-6 relative overflow-hidden group">
                  <div className="absolute top-4 right-4 bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold border border-blue-100">USD</div>
                  <div className="mb-4 text-slate-400 group-hover:text-brand-500 transition-colors"><Icons.Wallet /></div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Banesco Panama</h4>
                  <p className="text-xs text-slate-500 mb-6">1 Cuenta</p>
                  <p className="text-xs text-slate-400 uppercase">Saldo Total</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">5,400.00 <span className="text-sm font-normal text-slate-500">USD</span></p>
                </Card>
                {/* Card 2 */}
                <Card className="p-6 relative overflow-hidden group">
                  <div className="absolute top-4 right-4 bg-green-50 text-green-600 px-2 py-1 rounded text-xs font-bold border border-green-100">USDT</div>
                  <div className="mb-4 text-slate-400 group-hover:text-green-500 transition-colors"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="2" y="5" width="20" height="14" rx="2" /></svg></div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Binance</h4>
                  <p className="text-xs text-slate-500 mb-6">1 Cuenta</p>
                  <p className="text-xs text-slate-400 uppercase">Saldo Total</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">12,050.20 <span className="text-sm font-normal text-slate-500">USDT</span></p>
                </Card>
                {/* Card 3 */}
                <Card className="p-6 relative overflow-hidden group">
                  <div className="absolute top-4 right-4 bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold border border-blue-100">USD</div>
                  <div className="mb-4 text-slate-400 group-hover:text-purple-500 transition-colors"><Icons.Wallet /></div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Zelle</h4>
                  <p className="text-xs text-slate-500 mb-6">1 Cuenta</p>
                  <p className="text-xs text-slate-400 uppercase">Saldo Total</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">3,200.00 <span className="text-sm font-normal text-slate-500">USD</span></p>
                </Card>
              </div>

              {/* National */}
              <div className="border-l-4 border-yellow-500 pl-4 mb-4 mt-8">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Bancos Nacionales (VES)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 relative overflow-hidden group">
                  <div className="absolute top-4 right-4 bg-yellow-50 text-yellow-600 px-2 py-1 rounded text-xs font-bold border border-yellow-100">VES</div>
                  <div className="mb-4 text-slate-400 group-hover:text-yellow-600 transition-colors"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 21h18M5 21V7l8-4 8 4v14M8 21v-9a4 4 0 018 0v9" /></svg></div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Banco de Venezuela</h4>
                  <p className="text-xs text-slate-500 mb-6">1 Cuenta</p>
                  <p className="text-xs text-slate-400 uppercase">Saldo Total</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">1,500.00 <span className="text-sm font-normal text-slate-500">VES</span></p>
                </Card>
              </div>
            </div>
          )}

          {/* VIEW: CLIENTS */}
          {currentView === 'clients' && (
            <div className="h-full flex gap-6">
              <Card className="w-1/3 flex flex-col h-full overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 dark:text-white">Directorio de Clientes</h3>
                  <button className="bg-brand-600 text-white rounded p-1 hover:bg-brand-700"><Icons.Plus /></button>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icons.Search /></div>
                    <Input placeholder="Buscar cliente..." className="pl-10" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {(clients || []).map((client: any, idx: number) => (
                    <div key={idx} className={`px-4 py-3 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 ${idx === 0 ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-sm">
                        {client.name ? client.name.substring(0, 2).toUpperCase() : '??'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{client.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1"><Icons.Clock /> Última: {client.last}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <div className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-600">
                  <Icons.Users />
                </div>
                <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">Selecciona un cliente</h3>
                <p className="text-sm">Haz clic en un cliente o agrega uno nuevo para ver detalles.</p>
              </div>
            </div>
          )}

          {/* VIEW: OPERATORS (Camellos) */}
          {currentView === 'operators' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Panel de Operadores (Camellos)</h2>
                  <p className="text-sm text-slate-500">Gestión de rendimientos y habilitación de cuentas.</p>
                </div>
                <Button variant="secondary" icon={<Icons.Plus />}>Gestionar / Agregar Camellos</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(operators || []).map((camello: any) => (
                  <Card key={camello.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                          {camello.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white">{camello.name}</h3>
                          <p className="text-xs text-slate-500">{camello.location}</p>
                        </div>
                      </div>
                      <div className="text-right text-xs text-slate-400">
                        Última actividad <br /> {camello.last}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className={`p-3 rounded-lg ${camello.active ? 'bg-green-50 dark:bg-green-900/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                        <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                          {camello.active && <span className="text-green-500">↗</span>} Ganancia
                        </p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">${camello.profit}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><span className="text-blue-500">Activity</span> Volumen</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">${camello.volume}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs text-slate-400">
                      <span>ID: {camello.id}</span>
                      <button className="text-brand-600 hover:underline">Ver Detalles / Gestionar</button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: NOTES */}
          {currentView === 'notes' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Notas & Recordatorios</h2>
                  <p className="text-sm text-slate-500">Apuntes rápidos y tareas pendientes.</p>
                </div>
                <Button variant="secondary" icon={<Icons.Plus />}>Nueva Nota</Button>
              </div>
              <div className="h-96 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400">
                <div className="w-12 h-12 mb-2 opacity-50"><Icons.Notes /></div>
                <p>No tienes notas guardadas.</p>
              </div>
            </div>
          )}

          {/* VIEW: EXPENSES */}
          {currentView === 'expenses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Control de Gastos</h2>
                  <p className="text-sm text-slate-500">Gestión de gastos operativos y consumos de logística.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" icon={<Icons.Printer />}>Imprimir Reporte</Button>
                  <Button variant="secondary" icon={<Icons.Plus />}>Registrar Gasto</Button>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <button className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 font-medium flex items-center gap-2"><Icons.Expenses /> Gastos Operativos</button>
                <button className="px-4 py-2 bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Consumos / Logística</button>
              </div>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg></div>
                  <h3 className="font-bold text-slate-800 dark:text-white">Total Operativo</h3>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">0 <span className="text-lg font-normal text-slate-400">USD (Est.)</span></h2>
                <p className="text-xs text-slate-500">Acumulado del mes actual</p>
              </Card>

              <Card className="min-h-[200px] flex items-center justify-center text-slate-400">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">FECHA</th>
                      <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">DESCRIPCIÓN</th>
                      <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">MONTO</th>
                      <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400 text-right">ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400">No hay registros en esta categoría.</td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* VIEW: REPORTS */}
          {currentView === 'reports' && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><Icons.Reports /> Reportes & Datos</h2>
                <p className="text-sm text-slate-500">Exporta historial o importa datos desde documentos externos.</p>
              </div>

              <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-1">
                <button className="px-4 py-2 text-sm font-medium border-b-2 border-brand-600 text-brand-600">Generar Reportes</button>
                <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Importar Datos</button>
              </div>

              <Card className="p-8">
                <h3 className="font-bold text-slate-800 dark:text-white mb-2">Exportar Transacciones</h3>
                <p className="text-sm text-slate-500 mb-6">Descarga el historial completo de transacciones para auditoría externa o imprímelo directamente.</p>

                <div className="flex gap-4">
                  <button className="flex-1 p-4 border border-green-100 bg-green-50 dark:bg-green-900/10 rounded-lg flex items-center justify-center gap-3 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors">
                    <Icons.Download />
                    <div className="text-left">
                      <div className="font-bold">Descargar Excel (CSV)</div>
                      <div className="text-xs opacity-70">Formato compatible universal</div>
                    </div>
                  </button>
                  <button className="flex-1 p-4 border border-red-100 bg-red-50 dark:bg-red-900/10 rounded-lg flex items-center justify-center gap-3 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                    <Icons.Printer />
                    <div className="text-left">
                      <div className="font-bold">Imprimir / PDF</div>
                      <div className="text-xs opacity-70">Vista de impresión del navegador</div>
                    </div>
                  </button>
                </div>

                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900 text-sm text-blue-800 dark:text-blue-300 flex gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <p>Nota: El reporte incluye todas las transacciones visibles actualmente. Para filtrar por fechas específicas, utilice los filtros en la pestaña "Transacciones" antes de exportar, o filtre el archivo Excel descargado.</p>
                </div>
              </Card>
            </div>
          )}

        </div>
      </main>

      {/* --- MODALS --- */}

      {/* 1. New Transaction Modal */}
      <Modal
        isOpen={isTransactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        title="Registrar Transacción"
        size="lg"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Scan Section */}
          <div className="w-full md:w-1/3">
            <SmartScanner onScanComplete={handleScanComplete} />
          </div>

          {/* Form Section */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Tipo de Operación</label>
                <select name="type" value={formData.type} onChange={handleInputChange} className="w-full p-2 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                  <option value="ENTRADA">ENTRADA (Compra)</option>
                  <option value="SALIDA">SALIDA (Venta)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Operador (Camello)</label>
                <select name="operator" value={formData.operator} onChange={handleInputChange} className="w-full p-2 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                  <option value="Camello_1">Camello_1</option>
                  <option value="Camello 2">Camello 2</option>
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
              <Input name="client" value={formData.client} onChange={handleInputChange} placeholder="Nombre completo del nuevo cliente" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Monto</label>
                <div className="flex gap-2">
                  <Input name="amount" type="number" value={formData.amount} onChange={handleInputChange} placeholder="0.00" className="flex-1" />
                  <select name="currency" value={formData.currency} onChange={handleInputChange} className="bg-slate-700 text-white rounded px-2 text-sm"><option value="VES">VES</option><option value="USD">USD</option></select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Tasa de Cambio</label>
                <Input name="rate" type="number" value={formData.rate} onChange={handleInputChange} placeholder="36.00" />
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
                    Aplcia Comisión Bancaria?
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
              <Button variant="primary" onClick={handleSubmitTransaction}>Guardar Transacción</Button>
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