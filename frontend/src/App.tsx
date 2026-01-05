import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { useScannerForm } from './hooks/useScannerForm';
import { useTransactions } from './hooks/useTransactions';
import { useMarketData } from './hooks/useMarketData';
import { useFetchData } from './hooks/useFetchData';

// Templates & Organisms
import { LoginTemplate } from './components/templates/LoginTemplate';
import { MainLayout } from './components/templates/MainLayout';
import { DashboardModals } from './components/organisms/DashboardModals';

// Components & Views
import { DashboardView } from './features/Dashboard/pages/DashboardPage';
import { TransactionsView } from './features/Transactions/pages/TransactionsPage';
import { AccountsView } from './views/AccountsView';
import { ClientsView } from './views/ClientsView';
import { OperatorsView } from './views/OperatorsView';
import { NotesView } from './views/NotesView';
import { ExpensesView } from './views/ExpensesView';
import { ReportsView } from './views/ReportsView';
import { InboxView } from './views/InboxView';
import { AccountBookView } from './views/AccountBookView';
import { WhatsAppConnect } from './components/WhatsAppConnect';
import { Card } from './components/atoms/Card'; // For WhatsApp wrapper
import { DEMO_STATS, DEMO_TRANSACTIONS, DEMO_CLIENTS, DEMO_OPERATORS, DEMO_MESSAGES } from './config/mockData';

const App = () => {
  const { isLoggedIn, isDemoMode, login, demoLogin, logout, restartTutorial } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [currentView, setCurrentView] = useState('dashboard');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSupportModalOpen, setSupportModalOpen] = useState(false);

  // Business Logic with Hooks
  const { formData, handleInputChange, handleScanComplete, setFormData, resetForm } = useScannerForm();
  const { transactions, isTransactionModalOpen, setTransactionModalOpen, handleSubmitTransaction, demoTransactions } = useTransactions(isDemoMode);
  const { stats, isRefreshingRates, handleRefreshRates, refetchStats } = useMarketData(isDemoMode);
  const { data: clients } = useFetchData('/resources/clients', []);
  const { data: operators } = useFetchData('/resources/operators', []);

  // Transaction Handlers
  const handleNewEntry = () => {
    resetForm();
    setFormData(prev => ({ ...prev, type: 'ENTRADA', category: 'VENTA', status: 'COMPLETED' }));
    setTransactionModalOpen(true);
  };

  const handleNewExit = () => {
    resetForm();
    setFormData(prev => ({ ...prev, type: 'SALIDA', category: 'GASTO_OPERATIVO', status: 'COMPLETED' }));
    setTransactionModalOpen(true);
  };

  if (!isLoggedIn) return <LoginTemplate onLogin={(e) => { e.preventDefault(); login(); }} onDemoLogin={demoLogin} />;

  return (
    <MainLayout
      currentView={currentView} setCurrentView={setCurrentView} isDarkMode={isDarkMode} toggleTheme={toggleTheme}
      onLogout={logout} restartTutorial={restartTutorial} isDemoMode={isDemoMode}
      isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen}
      onNewTransaction={() => setTransactionModalOpen(true)} // Legacy fallback
      onNewEntry={handleNewEntry}
      onNewExit={handleNewExit}
      onSupport={() => setSupportModalOpen(true)}
    >
      {currentView === 'dashboard' && <DashboardView stats={isDemoMode ? DEMO_STATS : stats} chartType={chartType} setChartType={setChartType} isDemoMode={isDemoMode} onRefreshRates={handleRefreshRates} isRefreshingRates={isRefreshingRates} onNavigateToAccountBook={() => setCurrentView('account_book')} recentTransactions={isDemoMode ? DEMO_TRANSACTIONS : transactions} />}

      {currentView === 'accounts' && <AccountsView />}
      {currentView === 'account_book' && <AccountBookView isDemoMode={isDemoMode} demoTransactions={DEMO_TRANSACTIONS} />}
      {currentView === 'clients' && <ClientsView isDemoMode={isDemoMode} clients={clients} demoClients={DEMO_CLIENTS} />}
      {currentView === 'operators' && <OperatorsView isDemoMode={isDemoMode} operators={operators} demoOperators={DEMO_OPERATORS} />}
      {currentView === 'notes' && <NotesView />}
      {currentView === 'expenses' && <ExpensesView />}
      {currentView === 'reports' && <ReportsView />}
      {currentView === 'inbox' && <InboxView isDemoMode={isDemoMode} demoMessages={DEMO_MESSAGES} />}

      {currentView === 'whatsapp' && <Card className="p-6"><h2 className="text-xl font-bold mb-4 dark:text-white">Conexión de WhatsApp</h2><WhatsAppConnect /></Card>}

      <DashboardModals
        isTransactionModalOpen={isTransactionModalOpen} setTransactionModalOpen={setTransactionModalOpen}
        isSupportModalOpen={isSupportModalOpen} setSupportModalOpen={setSupportModalOpen}
        isDemoMode={isDemoMode} handleScanComplete={handleScanComplete} formData={formData}
        handleInputChange={handleInputChange}
        onSubmitTransaction={(shouldClose) => handleSubmitTransaction(formData, () => { if (shouldClose) resetForm(); refetchStats(); }, shouldClose)}
        onNewExit={handleNewExit}
      />
    </MainLayout>
  );
};

export default App;