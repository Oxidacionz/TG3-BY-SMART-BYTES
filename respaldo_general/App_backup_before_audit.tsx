import React, { useState, useEffect, ReactNode } from 'react';
import { User as UserIcon, Eye as EyeIcon, Sparkles, LifeBuoy } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SmartScanner } from './components/SmartScanner';
import { Tutorial, TutorialStep } from './components/Tutorial';

/**
 * =================================================================================
 * ICONS (Atoms)
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
  Toro: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 6c0-2.2 1.8-4 4-4s4 1.8 4 4" /><path d="M7 6A7 7 0 0 0 2 11a5 5 0 0 0 5 5 3 3 0 0 1 3 3h4a3 3 0 0 1 3-3 5 5 0 0 0 5-5 7 7 0 0 0-5-5" /><circle cx="8" cy="11" r="1.5" className="fill-current" /><circle cx="16" cy="11" r="1.5" className="fill-current" /></svg>,
  Camel: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 19H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.5a1 1 0 0 0 .8-.4l.9-1.2C6.8 4.6 7.6 4 8.5 4c.6 0 1.2.3 1.5.8l1 1.6c.4.7 1.3.8 1.9.3l.6-.4c.7-.6 1.8-.6 2.5 0l.4.3c.7.5 1.7.5 2.4.1l.6-.4c.6-.4 1.4-.4 2 0l1 0.7C23.2 8.5 24 9.6 24 10.8V17a2 2 0 0 1-2 2h-1" /><path d="M8 19v-5" /><path d="M16 19v-5" /></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  Inbox: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>,
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
  if (status === 'Completado' || status === 'Recibido' || status === 'Pagado') colorClass = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800";
  if (status === 'Pendiente' || status === 'Pendiente Recepción' || status === 'En Revisión') colorClass = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800";
  if (status === 'Cancelado') colorClass = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800";

  const getIcon = () => {
    if (status === 'Pendiente Recepción') return <span className="mr-1">📥</span>;
    if (status === 'En Revisión') return <span className="mr-1">👀</span>;
    if (status === 'Pagado') return <span className="mr-1">💸</span>;
    if (status === 'Recibido') return <span className="mr-1">✅</span>;
    return null;
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center w-fit ${colorClass}`}>
      {getIcon()}{status}
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

// --- DEMO DATA CONSTANTS (Global) ---
const DEMO_STATS = {
  volume: "38,450.00",
  net_profit: "1,845.20",
  pending_count: 12,
  ticker: {
    global_rate: "48.50",
    bcv_usd: "46.20",
    bcv_eur: "49.10",
    binance_buy: "48.10",
    binance_sell: "48.80",
    zelle: "47.50"
  },
  chart_data: [
    { name: 'Lun', volume: 4000, profit: 240 },
    { name: 'Mar', volume: 3000, profit: 139 },
    { name: 'Mie', volume: 6000, profit: 480 },
    { name: 'Jue', volume: 2780, profit: 390 },
    { name: 'Vie', volume: 8890, profit: 980 },
    { name: 'Sab', volume: 2390, profit: 380 },
    { name: 'Dom', volume: 3490, profit: 430 },
  ]
};

const DEMO_CLIENTS = [
  'Alejandro Magno', 'María Lionza', 'Pedro Camejo', 'Luisa Cáceres',
  'Andrés Bello', 'Francisco Miranda', 'José Gregorio', 'Guaicaipuro', 'Negra Matea',
  'Tío Simón', 'Carolina Herrera', 'Gustavo Dudamel'
];

const DEMO_OPERATORS = [
  { id: 'op1', name: 'Camello Alpha', avatar: '🐫', color: 'bg-blue-100 text-blue-700' },
  { id: 'op2', name: 'Camello Beta', avatar: '🐪', color: 'bg-green-100 text-green-700' },
  { id: 'op3', name: 'Camello Gamma', avatar: '🐎', color: 'bg-purple-100 text-purple-700' },
  { id: 'op4', name: 'Camello Delta', avatar: '🐫', color: 'bg-amber-100 text-amber-700' },
];

const DEMO_TRANSACTIONS = Array.from({ length: 15 }).map((_, i) => {
  const type = Math.random() > 0.5 ? 'ENTRADA' : 'SALIDA';
  let status = 'PENDIENTE';
  if (type === 'ENTRADA') {
    status = Math.random() > 0.4 ? 'Recibido' : 'Pendiente Recepción';
  } else {
    status = Math.random() > 0.4 ? 'Pagado' : 'En Revisión';
  }

  return {
    id: `TX-DEMO-${1000 + i}`,
    date: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toLocaleString(),
    amount: (Math.random() * 2000 + 50).toFixed(2),
    currency: Math.random() > 0.5 ? 'USD' : 'USDT',
    type,
    status,
    client: DEMO_CLIENTS[i % DEMO_CLIENTS.length],
    operator: DEMO_OPERATORS[i % DEMO_OPERATORS.length].name,
    rate: (48 + Math.random()).toFixed(2),
    profit: (Math.random() * 50).toFixed(2),
    ref: `REF-${Math.floor(Math.random() * 999999)}`,
    clientBank: ['Zelle', 'Banesco', 'Mercantil', 'Binance'][Math.floor(Math.random() * 4)]
  };
});

const DEMO_ADMIN_NOTICES = [
  { id: 1, title: '⚠️ Mantenimiento Zelle', text: 'Zelle estará lento entre 2pm y 4pm hoy.', important: true },
  { id: 2, title: '🚀 Bonificación', text: 'El operador con más volumen recibe bono el Viernes.', important: false },
  { id: 3, title: 'Tasa BCV', text: 'Recuerden actualizar la tasa BCV en las notas de entrega.', important: false }
];

const DEMO_PERSONAL_NOTES = [
  { id: 1, text: 'Llamar a Cliente VIP María para confirmar saldo pendiente.', done: false },
  { id: 2, text: 'Verificar transacción REF-8821 que quedó colgada.', done: true },
  { id: 3, text: 'Organizar comprobantes de la mañana.', done: false }
];

const DEMO_MESSAGES = [
  { id: 1, sender: 'Admin', text: 'Recuerden reportar los cierres antes de las 5pm.', time: '10:30 AM', unread: true, avatar: '👑' },
  { id: 2, sender: 'Camello Alpha', text: 'Tengo un cliente con un problema en Zelle, ¿puedes revisar?', time: '09:15 AM', unread: false, avatar: '🐫' },
  { id: 3, sender: 'Soporte', text: 'El sistema estará en mantenimiento brevemente esta noche.', time: 'Ayer', unread: false, avatar: '🛠️' },
  { id: 4, sender: 'Camello Beta', text: 'Listo el reporte de la mañana.', time: 'Ayer', unread: false, avatar: '🐪' }
];

// Helper Bank Styling
const getBankStyle = (bankName: string) => {
  const styles: Record<string, string> = {
    'Zelle': 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-purple-400',
    'Chase': 'bg-gradient-to-br from-blue-800 to-blue-900 text-white border-blue-600',
    'Banesco': 'bg-gradient-to-br from-green-600 to-green-800 text-white border-green-500',
    'Banesco Panama': 'bg-gradient-to-br from-green-600 to-green-800 text-white border-green-500',
    'PayPal': 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-blue-400',
    'Binance': 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 text-black border-yellow-300',
    'Mercantil': 'bg-gradient-to-br from-blue-600 to-orange-500 text-white border-orange-400',
    'Banco de Venezuela': 'bg-gradient-to-br from-red-600 to-rose-700 text-white border-red-500',
    'Swift': 'bg-gradient-to-br from-slate-600 to-slate-800 text-white border-slate-500',
  };
  return styles[bankName] || 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-slate-200';
};

const getBankIcon = (bankName: string) => {
  if (bankName.includes('Binance')) return <svg className="w-5 h-5 text-current opacity-80" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V8h2v4zm6 2h-2v-4c0-1.1-.9-2-2-2h-3v-2h3c2.21 0 4 1.79 4 4v4z" /></svg>;
  if (bankName.includes('Zelle')) return <span className="font-bold text-lg">Z</span>;
  if (bankName.includes('PayPal')) return <span className="font-bold text-lg">P</span>;
  if (bankName.includes('Venezuela')) return <span className="font-bold text-lg">BV</span>;
  return <Icons.Wallet />;
};

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

          {/* VIEW: DASHBOARD */}
          {currentView === 'dashboard' && (
            <div className="space-y-6">
              {/* Ticker */}
              <div className="bg-slate-900 rounded-xl p-1 text-white flex items-center shadow-lg overflow-hidden ticker-dashboard">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stats-cards">
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
                  <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1 gap-1">
                    <button onClick={() => setChartType('line')} className={`p-2 rounded shadow-sm transition-all ${chartType === 'line' ? 'bg-white dark:bg-slate-600 text-brand-600 dark:text-brand-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`} title="Líneas"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg></button>
                    <button onClick={() => setChartType('bar')} className={`p-2 rounded shadow-sm transition-all ${chartType === 'bar' ? 'bg-white dark:bg-slate-600 text-brand-600 dark:text-brand-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`} title="Barras"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg></button>
                    <button onClick={() => setChartType('pie')} className={`p-2 rounded shadow-sm transition-all ${chartType === 'pie' ? 'bg-white dark:bg-slate-600 text-brand-600 dark:text-brand-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`} title="Circular"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg></button>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'line' ? (
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
                    ) : chartType === 'bar' ? (
                      <BarChart data={stats.chart_data || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip
                          cursor={{ fill: '#f1f5f9' }}
                          contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={stats.chart_data || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="volume"
                        >
                          {(stats.chart_data || []).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    )}
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
                        <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">CLIENTE / BANCO</th>
                        <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">MONTO</th>
                        <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">OPERADOR</th>
                        <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">TASA / GANANCIA</th>
                        <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">ESTADO</th>
                        <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {(isDemoMode ? DEMO_TRANSACTIONS : (transactions || [])).map((tx: any) => {
                        const op = isDemoMode ? DEMO_OPERATORS.find(o => o.name === tx.operator) : null;
                        return (
                          <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="text-slate-900 dark:text-white font-medium">{(tx.date || '').split(',')[0]}</div>
                              <div className="text-xs text-slate-500">{tx.id}</div>
                            </td>
                            <td className="px-6 py-4 text-slate-500 font-mono">{tx.ref}</td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-900 dark:text-white">{tx.client}</div>
                              <div className={`text-[10px] inline-block px-1.5 py-0.5 rounded mt-1 font-medium border ${getBankStyle(tx.clientBank || 'Zelle')}`}>
                                {tx.clientBank || 'N/A'}
                              </div>
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
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${op ? op.color : 'bg-slate-200 dark:bg-slate-700'}`}>
                                  {op ? op.avatar : (tx.operator ? tx.operator.charAt(0) : '?')}
                                </div>
                                <span className="text-xs font-medium">{tx.operator}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-xs text-slate-500">Tasa: {tx.rate}</div>
                              <div className="text-green-600 text-xs font-bold">+{tx.profit} USD</div>
                            </td>
                            <td className="px-6 py-4"><Badge status={tx.status} /></td>
                            <td className="px-6 py-4 text-center text-slate-400">
                              <button className="p-1 hover:text-brand-500 transition-colors"><Icons.Edit /></button>
                            </td>
                          </tr>
                        )
                      })}
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

              {/* International & Crypto */}
              <div className="border-l-4 border-brand-500 pl-4 mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Billeteras & Bancos Int.</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[
                  { name: 'Binance', type: 'USDT', balance: '14,250.80', count: 1 },
                  { name: 'Zelle', type: 'USD', balance: '5,100.00', count: 3 },
                  { name: 'Banesco Panama', type: 'USD', balance: '8,420.50', count: 1 },
                  { name: 'Chase', type: 'USD', balance: '12,000.00', count: 1 },
                  { name: 'PayPal', type: 'USD', balance: '1,240.00', count: 1 },
                  { name: 'Mercantil', type: 'USD', balance: '3,500.00', count: 1 },
                  { name: 'Swift', type: 'USD', balance: '25,000.00', count: 1 },
                ].map((bank) => (
                  <Card key={bank.name} className={`p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border-t-4 ${getBankStyle(bank.name).split(' ')[0].replace('bg-gradient-to-br', 'border-t-transparent')}`}>
                    {/* Background Decoration */}
                    <div className={`absolute inset-0 opacity-10 ${getBankStyle(bank.name)}`}></div>

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl shadow-lg ${getBankStyle(bank.name)}`}>
                          {getBankIcon(bank.name)}
                        </div>
                        <div className="bg-white/90 dark:bg-slate-900/90 text-slate-600 px-2 py-1 rounded text-[10px] font-bold border border-slate-200 shadow-sm">
                          {bank.type}
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">{bank.name}</h4>
                      <p className="text-xs text-slate-500 mb-6">{bank.count} Cuenta{bank.count > 1 ? 's' : ''}</p>
                      <div className="border-t border-slate-200 dark:border-slate-700/50 pt-2">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Saldo Total</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-white">{bank.balance} <span className="text-xs font-normal text-slate-500">{bank.type}</span></p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* National */}
              <div className="border-l-4 border-yellow-500 pl-4 mb-4 mt-8">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Bancos Nacionales (VES)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[
                  { name: 'Banco de Venezuela', type: 'VES', balance: '45,200.00', count: 2 },
                ].map((bank) => (
                  <Card key={bank.name} className={`p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border-t-4 border-red-500`}>
                    <div className={`absolute inset-0 opacity-10 bg-red-600`}></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl shadow-lg bg-red-600 text-white`}>
                          <span className="font-bold">BV</span>
                        </div>
                        <div className="bg-white/90 dark:bg-slate-900/90 text-yellow-600 px-2 py-1 rounded text-[10px] font-bold border border-yellow-200 shadow-sm">
                          {bank.type}
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">{bank.name}</h4>
                      <p className="text-xs text-slate-500 mb-6">{bank.count} Cuenta{bank.count > 1 ? 's' : ''}</p>
                      <div className="border-t border-slate-200 dark:border-slate-700/50 pt-2">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Saldo Total</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-white">{bank.balance} <span className="text-xs font-normal text-slate-500">{bank.type}</span></p>
                      </div>
                    </div>
                  </Card>
                ))}
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
                  {(isDemoMode ? DEMO_CLIENTS.map((name, i) => ({
                    name,
                    last: `${Math.floor(Math.random() * 24)}h ago`,
                    id: `CLI-${i}`,
                    volume: (Math.random() * 10000).toFixed(2),
                    deals: Math.floor(Math.random() * 50)
                  })) : (clients || [])).map((client: any, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedClient(client)}
                      className={`px-4 py-3 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors ${selectedClient?.id === client.id ? 'bg-blue-50 dark:bg-blue-900/20 shadow-inner' : ''}`}
                    >
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
                {(isDemoMode ? DEMO_OPERATORS.map(op => ({
                  ...op,
                  location: 'Caracas, VE',
                  last: 'Active Now',
                  active: true,
                  profit: (Math.random() * 500 + 100).toFixed(2),
                  volume: (Math.random() * 5000 + 1000).toFixed(2)
                })) : (operators || [])).map((camello: any) => (
                  <Card key={camello.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${camello.color || 'bg-slate-900 text-white'}`}>
                          {camello.avatar || camello.name.charAt(0)}
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

          {/* VIEW: INBOX */}
          {currentView === 'inbox' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Icons.Inbox /> Centro de Mensajes
                  </h2>
                  <p className="text-sm text-slate-500">Comunicación directa entre Admin y Operadores.</p>
                </div>
                <Button variant="primary" icon={<Icons.Plus />}>Nuevo Mensaje</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
                {/* Message List */}
                <Card className="col-span-1 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full bg-white dark:bg-slate-900">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="relative">
                      <Icons.Search />
                      <input type="text" placeholder="Buscar mensajes..." className="w-full pl-8 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500" />
                      <div className="absolute left-2 top-2.5 text-slate-400 pointer-events-none"><span className="w-4 h-4 ml-1"></span></div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {(isDemoMode ? DEMO_MESSAGES : []).map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => setSelectedMessageId(msg.id)}
                        className={`p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors ${selectedMessageId === msg.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-brand-500' : (msg.unread ? 'bg-blue-50/30 dark:bg-blue-900/10' : '')}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{msg.avatar}</span>
                            <span className={`font-bold text-sm ${msg.unread ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{msg.sender}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{msg.time}</span>
                        </div>
                        <p className={`text-xs ${msg.unread ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-500'} line-clamp-2`}>{msg.text}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Chat Area */}
                <Card className="col-span-1 md:col-span-2 flex flex-col h-full bg-slate-50 dark:bg-slate-950/50">
                  {selectedMessageId ? (
                    <div className="flex flex-col h-full">
                      {/* Chat Header */}
                      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{DEMO_MESSAGES.find(m => m.id === selectedMessageId)?.avatar}</span>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">{DEMO_MESSAGES.find(m => m.id === selectedMessageId)?.sender}</h3>
                            <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> En línea</p>
                          </div>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600"><Icons.Support /></button>
                      </div>

                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div className="flex justify-center"><span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">Hoy</span></div>

                        {/* Received Message */}
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm">{DEMO_MESSAGES.find(m => m.id === selectedMessageId)?.avatar}</div>
                          <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                            <p className="text-sm text-slate-700 dark:text-slate-300">{DEMO_MESSAGES.find(m => m.id === selectedMessageId)?.text}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block text-right">{DEMO_MESSAGES.find(m => m.id === selectedMessageId)?.time}</span>
                          </div>
                        </div>

                        {/* Sent Message (Mock) */}
                        <div className="flex gap-3 flex-row-reverse">
                          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-sm text-brand-600 font-bold">Yo</div>
                          <div className="bg-brand-600 text-white p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[80%]">
                            <p className="text-sm">Entendido, lo revisaré de inmediato.</p>
                            <span className="text-[10px] text-brand-200 mt-1 block text-right">Justo ahora</span>
                          </div>
                        </div>
                      </div>

                      {/* Input Area */}
                      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex gap-2">
                          <button className="p-2 text-slate-400 hover:text-slate-600"><Icons.Plus /></button>
                          <input type="text" placeholder="Escribe un mensaje..." className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all" />
                          <button className="p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors"><Icons.Send /></button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                      <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <Icons.Inbox />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Selecciona una conversación</h3>
                      <p className="text-sm">O inicia un nuevo chat para coordinar operaciones.</p>
                    </div>
                  )}
                  {/* Previous Placeholder was here, replaced by conditional rendering */}
                </Card>
              </div>
            </div>
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