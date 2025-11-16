"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import HeaderBar from '@/components/HeaderBar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMoneyBillWave, FaReceipt, FaWallet, FaSpinner, FaExclamationTriangle, FaCheckCircle, FaClock, FaTimes, FaGem, FaCoins, FaShoppingBag, FaChevronDown, FaChevronUp, FaBolt, FaPlus, FaMinus, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import TransactionAPI from '@/lib/api/transactions';
import InvoiceGenerator from '@/components/InvoiceGenerator';
import { httpClient } from '@/lib/api/config';

// Loading component for Suspense fallback
function PurchaseHistoryLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <HeaderBar />
      <div className="pt-16">
        <div className="w-full rounded-3xl py-16 px-4 relative overflow-hidden bg-gradient-to-r from-emerald-100 via-green-100 to-teal-100">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent"></div>
          <div className="max-w-6xl mx-auto relative z-10 text-center">
            <h1 className="text-3xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-emerald-800 mb-4">
              Reports
            </h1>
            <p className="text-sm max-w-2xl mx-auto text-emerald-800/80">
              View and manage your transaction history and account statements
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20">
          <div className="backdrop-blur-sm rounded-2xl border shadow-2xl overflow-hidden bg-gradient-to-br from-white/80 to-gray-100/80 border-emerald-500/30">
            <div className="flex justify-center items-center p-8">
              <div className="flex items-center space-x-3">
                <FaSpinner className="animate-spin text-emerald-600" size={24} />
                <span className="text-lg font-medium text-gray-700">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function PurchaseHistoryContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('payments');
  const [transactions, setTransactions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ordersError, setOrdersError] = useState(null);
  const [ledgerError, setLedgerError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [ordersPagination, setOrdersPagination] = useState(null);
  const [ledgerPagination, setLedgerPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersCurrentPage, setOrdersCurrentPage] = useState(1);
  const [ledgerCurrentPage, setLedgerCurrentPage] = useState(1);
  const [isDark, setIsDark] = useState(false);
  const [expandedTransactions, setExpandedTransactions] = useState(new Set());
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [expandedLedgerEntries, setExpandedLedgerEntries] = useState(new Set());
  const { isLoggedIn, user } = useAuth();

  // Handle complaint redirect to Telegram
  const handleComplaint = (type, data) => {
    const userName = user?.name || 'N/A';
    const userPhone = user?.phone || 'N/A';
    const userEmail = user?.email || 'N/A';

    let complaintText = '';

    if (type === 'payment') {
      complaintText = `Name: ${userName}
      Number: ${userPhone}
      Email: ${userEmail}
      Order ID: ${data.orderId || 'N/A'}
      Amount: ${data.amount || 'N/A'}
      UTR: ${data.txnId || 'null'}
      Status: ${data.status || 'N/A'}`;
    } else if (type === 'purchase') {
      complaintText = `Name: ${userName}
      Number: ${userPhone}
      Email: ${userEmail}
      Order ID: ${data.orderId || 'N/A'}
      Amount: ${data.amount || 'N/A'}
      UTR: ${data.utr || 'null'}
      Status: ${data.status || 'N/A'}`;
    }

    const encodedText = encodeURIComponent(complaintText);
    const telegramUrl = `https://t.me/credimics?text=${encodedText}`;
    window.open(telegramUrl, '_blank');
  };

  // Fetch transaction history
  const fetchTransactions = async (page = 1) => {
    if (!isLoggedIn) return;

    setLoading(true);
    setError(null);

    try {
      const dateRange = TransactionAPI.getDefaultDateRange();
      const response = await TransactionAPI.getTransactionHistory({
        ...dateRange,
        page,
        limit: 10
      });

      if (response.success) {
        const formattedTransactions = response.transactions.map(TransactionAPI.formatTransaction);
        setTransactions(formattedTransactions);
        setPagination(response.pagination);
        setCurrentPage(page);
      } else {
        setError('Failed to fetch transaction history');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Failed to fetch transaction history');
    } finally {
      setLoading(false);
    }
  };

  // Fetch order history
  const fetchOrders = async (page = 1) => {
    if (!isLoggedIn) return;

    setOrdersLoading(true);
    setOrdersError(null);

    try {
      const dateRange = TransactionAPI.getDefaultDateRange();
      const response = await TransactionAPI.getOrderHistory({
        ...dateRange,
        page,
        limit: 10
      });

      if (response.success) {
        const formattedOrders = response.orders.map(TransactionAPI.formatOrder);
        setOrders(formattedOrders);
        setOrdersPagination(response.pagination);
        setOrdersCurrentPage(page);
      } else {
        setOrdersError('Failed to fetch order history');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrdersError(err.message || 'Failed to fetch order history');
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch wallet ledger
  const fetchLedger = async (page = 1) => {
    if (!isLoggedIn) return;

    setLedgerLoading(true);
    setLedgerError(null);

    try {
      const dateRange = TransactionAPI.getDefaultDateRange();
      const response = await TransactionAPI.getWalletLedger({
        ...dateRange,
        page,
        limit: 10
      });

      if (response.success) {
        const formattedLedgerEntries = response.data.transactions.map(TransactionAPI.formatLedgerEntry);
        setLedgerEntries(formattedLedgerEntries);
        setLedgerPagination(response.pagination);
        setLedgerCurrentPage(page);
      } else {
        setLedgerError('Failed to fetch wallet ledger');
      }
    } catch (err) {
      console.error('Error fetching ledger:', err);
      setLedgerError(err.message || 'Failed to fetch wallet ledger');
    } finally {
      setLedgerLoading(false);
    }
  };

  // Theme reactivity
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial theme check
    const checkTheme = () => {
      const root = document.documentElement;
      const isDarkTheme = root.classList.contains('dark');
      setIsDark(prevIsDark => {
        // Only update if actually changed to prevent unnecessary re-renders
        return prevIsDark !== isDarkTheme ? isDarkTheme : prevIsDark;
      });
    };

    // Check theme on mount
    checkTheme();

    // Listen for theme changes with debouncing
    let timeoutId;
    const debouncedCheckTheme = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkTheme, 50);
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          debouncedCheckTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Also listen for storage changes (in case theme is changed in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        debouncedCheckTheme();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle URL parameters for authToken and activeTab
  useEffect(() => {
    const authTokenFromUrl = searchParams.get('authToken');
    const tabFromUrl = searchParams.get('activeTab');

    // Handle authToken parameter - simple token replacement like in successful login
    if (authTokenFromUrl) {
      console.log('Auth token found in URL, replacing existing token');
      // Simply set the new token, just like after successful login
      httpClient.setToken(authTokenFromUrl);

      // Clean up URL by removing the authToken parameter
      const url = new URL(window.location);
      url.searchParams.delete('authToken');
      window.history.replaceState({}, '', url);

      // Refresh the page to apply the new token
      window.location.reload();
    }

    // Handle activeTab parameter
    console.log('URL activeTab parameter:', tabFromUrl); // Debug log
    if (tabFromUrl && ['payments', 'purchase', 'ledger'].includes(tabFromUrl)) {
      console.log('Setting activeTab to:', tabFromUrl); // Debug log
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);



  useEffect(() => {
    if (activeTab === 'payments' && isLoggedIn) {
      fetchTransactions();
    } else if (activeTab === 'purchase' && isLoggedIn) {
      fetchOrders();
    } else if (activeTab === 'ledger' && isLoggedIn) {
      fetchLedger();
    }
  }, [activeTab, isLoggedIn]);

  // Toggle transaction expansion
  const toggleTransactionExpansion = (transactionId) => {
    setExpandedTransactions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(transactionId)) {
        newSet.delete(transactionId);
      } else {
        newSet.add(transactionId);
      }
      return newSet;
    });
  };

  // Toggle order expansion
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // Toggle ledger entry expansion
  const toggleLedgerExpansion = (ledgerId) => {
    setExpandedLedgerEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ledgerId)) {
        newSet.delete(ledgerId);
      } else {
        newSet.add(ledgerId);
      }
      return newSet;
    });
  };

  const renderTabContent = () => {
    const emptyState = (icon, title, description) => (
      <motion.div
        className={`p-8 text-center rounded-2xl backdrop-blur-sm border transition-colors duration-300 ${isDark
            ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-emerald-500/20'
            : 'bg-gradient-to-br from-gray-100/50 to-gray-200/50 border-emerald-500/30'
          }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-colors duration-300 ${isDark
            ? 'bg-emerald-900/30 text-emerald-400'
            : 'bg-emerald-100/50 text-emerald-600'
          }`}>
          {icon}
        </div>
        <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
          }`}>{title}</h3>
        <p className={`transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>{description}</p>
      </motion.div>
    );

    // Loading state for payments
    if (activeTab === 'payments' && loading) {
      return (
        <motion.div
          className={`p-8 text-center rounded-2xl backdrop-blur-sm border transition-colors duration-300 ${isDark
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-emerald-500/20'
              : 'bg-gradient-to-br from-gray-100/50 to-gray-200/50 border-emerald-500/30'
            }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-colors duration-300 ${isDark
              ? 'bg-emerald-900/30 text-emerald-400'
              : 'bg-emerald-100/50 text-emerald-600'
            }`}>
            <FaSpinner className="animate-spin" size={28} />
          </div>
          <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
            }`}>Loading Transactions</h3>
          <p className={`transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Please wait while we fetch your payment history...</p>
        </motion.div>
      );
    }

    // Loading state for orders
    if (activeTab === 'purchase' && ordersLoading) {
      return (
        <motion.div
          className={`p-8 text-center rounded-2xl backdrop-blur-sm border transition-colors duration-300 ${isDark
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-emerald-500/20'
              : 'bg-gradient-to-br from-gray-100/50 to-gray-200/50 border-emerald-500/30'
            }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-colors duration-300 ${isDark
              ? 'bg-emerald-900/30 text-emerald-400'
              : 'bg-emerald-100/50 text-emerald-600'
            }`}>
            <FaSpinner className="animate-spin" size={28} />
          </div>
          <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
            }`}>Loading Orders</h3>
          <p className={`transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Please wait while we fetch your order history...</p>
        </motion.div>
      );
    }

    // Loading state for ledger
    if (activeTab === 'ledger' && ledgerLoading) {
      return (
        <motion.div
          className={`p-8 text-center rounded-2xl backdrop-blur-sm border transition-colors duration-300 ${isDark
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-emerald-500/20'
              : 'bg-gradient-to-br from-gray-100/50 to-gray-200/50 border-emerald-500/30'
            }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-colors duration-300 ${isDark
              ? 'bg-emerald-900/30 text-emerald-400'
              : 'bg-emerald-100/50 text-emerald-600'
            }`}>
            <FaSpinner className="animate-spin" size={28} />
          </div>
          <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
            }`}>Loading Ledger</h3>
          <p className={`transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Please wait while we fetch your wallet ledger...</p>
        </motion.div>
      );
    }

    // Error state for payments
    if (activeTab === 'payments' && error) {
      return (
        <motion.div
          className={`p-8 text-center rounded-2xl backdrop-blur-sm border transition-colors duration-300 ${isDark
              ? 'bg-gradient-to-br from-red-800/50 to-red-900/50 border-red-500/20'
              : 'bg-gradient-to-br from-red-100/50 to-red-200/50 border-red-500/30'
            }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-colors duration-300 ${isDark
              ? 'bg-red-900/30 text-red-400'
              : 'bg-red-100/50 text-red-600'
            }`}>
            <FaExclamationTriangle size={28} />
          </div>
          <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
            }`}>Error Loading Data</h3>
          <p className={`mb-4 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>{error}</p>
          <button
            onClick={() => fetchTransactions()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      );
    }

    // Error state for orders
    if (activeTab === 'purchase' && ordersError) {
      return (
        <motion.div
          className={`p-8 text-center rounded-2xl backdrop-blur-sm border transition-colors duration-300 ${isDark
              ? 'bg-gradient-to-br from-red-800/50 to-red-900/50 border-red-500/20'
              : 'bg-gradient-to-br from-red-100/50 to-red-200/50 border-red-500/30'
            }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-colors duration-300 ${isDark
              ? 'bg-red-900/30 text-red-400'
              : 'bg-red-100/50 text-red-600'
            }`}>
            <FaExclamationTriangle size={28} />
          </div>
          <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
            }`}>Error Loading Data</h3>
          <p className={`mb-4 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>{ordersError}</p>
          <button
            onClick={() => fetchOrders()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      );
    }

    // Error state for ledger
    if (activeTab === 'ledger' && ledgerError) {
      return (
        <motion.div
          className={`p-8 text-center rounded-2xl backdrop-blur-sm border transition-colors duration-300 ${isDark
              ? 'bg-gradient-to-br from-red-800/50 to-red-900/50 border-red-500/20'
              : 'bg-gradient-to-br from-red-100/50 to-red-200/50 border-red-500/30'
            }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-colors duration-300 ${isDark
              ? 'bg-red-900/30 text-red-400'
              : 'bg-red-100/50 text-red-600'
            }`}>
            <FaExclamationTriangle size={28} />
          </div>
          <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
            }`}>Error Loading Data</h3>
          <p className={`mb-4 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>{ledgerError}</p>
          <button
            onClick={() => fetchLedger()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      );
    }

    switch (activeTab) {
      case 'payments':
        if (transactions.length === 0) {
          return emptyState(
            <FaMoneyBillWave size={28} />,
            'No Payment Records',
            'Your payment history will appear here.'
          );
        }

        return (
          <div className="space-y-2">
            {transactions.map((transaction, index) => {
              const isExpanded = expandedTransactions.has(transaction.id);
              return (
                <motion.div
                  key={transaction.id}
                  className={`backdrop-blur-sm rounded-lg border transition-all duration-200 cursor-pointer ${isDark
                      ? 'bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-emerald-500/30'
                      : 'bg-gradient-to-r from-gray-100/50 to-gray-200/50 border-gray-300/50 hover:border-emerald-500/30'
                    }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {/* Compact Row */}
                  <div
                    className="p-2 flex items-center justify-between"
                    onClick={() => toggleTransactionExpansion(transaction.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg text-sm ${transaction.statusBg}`}>
                        <FaBolt className="text-yellow-400" size={12} />
                      </div>
                      <div>
                        <h3 className={`font-semibold text-sm transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
                          }`}>Add Money</h3>
                        <p className={`text-xs transition-colors duration-300 break-all ${isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>{transaction.orderId}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className={`font-bold text-xs transition-colors duration-300 ${transaction.status === 'success' ? 'text-green-400' :
                            transaction.status === 'pending' ? 'text-yellow-400' :
                              'text-red-400'
                          }`}>{transaction.formattedAmount}</p>
                        <p className={`text-xs font-medium ${transaction.status === 'success' ? 'text-green-400' :
                            transaction.status === 'pending' ? 'text-yellow-400' :
                              'text-red-400'
                          }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </p>
                      </div>
                      <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'
                        }`}>
                        <FaChevronDown className={`transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
                          }`} size={14} />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className={`px-4 pb-4 border-t transition-colors duration-300 ${isDark ? 'border-gray-700/50' : 'border-gray-300/50'
                          }`}>
                          <div className="pt-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className={`transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
                                  }`}>Date</p>
                                <p className={`transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
                                  }`}>{transaction.formattedDate}</p>
                              </div>

                              {transaction.payerUpi && (
                                <div>
                                  <p className={`transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}>UPI ID</p>
                                  <p className={`transition-colors duration-300 break-all ${isDark ? 'text-white' : 'text-gray-900'
                                    }`}>{transaction.payerUpi}</p>
                                </div>
                              )}
                              {transaction.txnId && (
                                <div>
                                  <p className={`transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}>Transaction ID</p>
                                  <p className={`font-mono transition-colors duration-300 break-all ${isDark ? 'text-white' : 'text-gray-900'
                                    }`}>{transaction.txnId}</p>
                                </div>
                              )}
                            </div>
                            <div className={`rounded-lg transition-colors duration-300 ${isDark ? 'bg-gray-800/30' : 'bg-gray-100/50'
                              }`}>
                              <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>Description</p>
                              <p className={`transition-colors duration-300 break-words text-sm ${isDark ? 'text-white' : 'text-gray-900'
                                }`}>{transaction.paymentNote}</p>
                            </div>

                            {/* Complaint Section */}
                            <div className={`rounded-lg p-3 border transition-colors duration-300 ${isDark
                                ? 'bg-orange-900/20 border-orange-500/30'
                                : 'bg-orange-50 border-orange-200'
                              }`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className={`text-sm font-medium transition-colors duration-300 ${isDark ? 'text-orange-300' : 'text-orange-800'
                                    }`}>Have any complaint?</p>
                                  <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-orange-400/80' : 'text-orange-600'
                                    }`}>Report issues with this transaction</p>
                                </div>
                                <button
                                  onClick={() => handleComplaint('payment', transaction)}
                                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 ${isDark
                                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                                    }`}
                                >
                                  Help
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-6">
                <button
                  onClick={() => fetchTransactions(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className={`px-4 py-2 rounded-lg transition-colors ${isDark
                      ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-900'
                    }`}
                >
                  Previous
                </button>
                <span className={`px-4 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchTransactions(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`px-4 py-2 rounded-lg transition-colors ${isDark
                      ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-900'
                    }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        );

      case 'purchase':
        if (orders.length === 0) {
          return emptyState(
            <FaReceipt size={28} />,
            'No Purchase Records',
            'Your purchase history will appear here.'
          );
        }

        return (
          <div className="space-y-2">
            {orders.map((order, index) => {
              const isExpanded = expandedOrders.has(order.id);
              return (
                <motion.div
                  key={order.id}
                  className={`backdrop-blur-sm rounded-lg border transition-all duration-200 cursor-pointer ${isDark
                      ? 'bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-emerald-500/30'
                      : 'bg-gradient-to-r from-gray-100/50 to-gray-200/50 border-gray-300/50 hover:border-emerald-500/30'
                    }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {/* Compact Row */}
                  <div
                    className="p-2 flex items-center justify-between"
                    onClick={() => toggleOrderExpansion(order.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${order.statusBg}`}>
                        {order.orderType === 'diamond_pack_purchase' && <FaGem className="text-blue-400" size={16} />}
                        {order.orderType === 'coin_pack_purchase' && <FaCoins className="text-yellow-400" size={16} />}
                        {order.orderType === 'item_purchase' && <FaShoppingBag className="text-purple-400" size={16} />}
                        {!['diamond_pack_purchase', 'coin_pack_purchase', 'item_purchase'].includes(order.orderType) &&
                          <FaReceipt className="text-emerald-400" size={16} />}
                      </div>
                      <div>
                        <h3 className={`font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
                          }`}>{order.orderTypeDisplay}</h3>
                        <p className={`text-xs transition-colors duration-300 break-all ${isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>{order.orderId}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className={`font-bold text-lg transition-colors duration-300 ${order.status === 'completed' ? 'text-green-400' :
                            order.status === 'pending' ? 'text-yellow-400' :
                              'text-red-400'
                          }`}>{order.formattedAmount}</p>
                        <p className={`text-sm font-medium ${order.status === 'completed' ? 'text-green-400' :
                            order.status === 'pending' ? 'text-yellow-400' :
                              'text-red-400'
                          }`}>
                          {order.status === 'completed' ? 'Success' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </p>
                      </div>
                      <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'
                        }`}>
                        <FaChevronDown className={`transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
                          }`} size={14} />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className={`px-4 pb-4 border-t transition-colors duration-300 ${isDark ? 'border-gray-700/50' : 'border-gray-300/50'
                          }`}>
                          <div className="pt-4 space-y-3">


                            {/* Order Description */}
                            {order.description && (
                              <div className={`rounded-lg transition-colors duration-300 ${isDark ? 'bg-gray-800/20' : 'bg-gray-100/30'
                                }`}>
                                <p className={`text-sm mb-1 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
                                  }`}>Name:</p>
                                <p className={`text-sm transition-colors duration-300 break-words ${isDark ? 'text-white' : 'text-gray-900'
                                  }`}>
                                  {typeof order.description === 'object' ? order.description.text : order.description}
                                </p>
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className={`transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
                                  }`}>Date</p>
                                <p className={`transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
                                  }`}>{order.formattedDate}</p>
                              </div>
                              {/* Player ID and Server ID from description */}
                              {(() => {
                                try {
                                  const descriptionData = typeof order.description === 'string'
                                    ? JSON.parse(order.description)
                                    : order.description;

                                  if (descriptionData && (descriptionData.playerId || descriptionData.server)) {
                                    return (
                                      <div className="space-y-2">
                                        {descriptionData.playerId && (
                                          <div>
                                            <p className={`transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
                                              }`}>Player ID</p>
                                            <p className={`transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
                                              }`}>{descriptionData.playerId}</p>
                                          </div>
                                        )}
                                        {descriptionData.server && (
                                          <div>
                                            <p className={`transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
                                              }`}>Server</p>
                                            <p className={`transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
                                              }`}>{descriptionData.server}</p>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }
                                  return null;
                                } catch (error) {
                                  return null;
                                }
                              })()}

                              <div>
                                <p className={`transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
                                  }`}>Payment Method</p>
                                <p className={`capitalize transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
                                  }`}>{order.paymentMethod}</p>
                              </div>
                              <div>
                                <p className={`transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
                                  }`}>Currency</p>
                                <p className={`transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
                                  }`}>{order.currency}</p>
                              </div>
                            </div>

                            {/* Complaint Section */}
                            <div className={`rounded-lg p-3 border transition-colors duration-300 ${isDark
                                ? 'bg-orange-900/20 border-orange-500/30'
                                : 'bg-orange-50 border-orange-200'
                              }`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className={`text-sm font-medium transition-colors duration-300 ${isDark ? 'text-orange-300' : 'text-orange-800'
                                    }`}>Have any complaint?</p>
                                  <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-orange-400/80' : 'text-orange-600'
                                    }`}>Report issues with this order</p>
                                </div>
                                <button
                                  onClick={() => handleComplaint('purchase', order)}
                                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 ${isDark
                                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                                    }`}
                                >
                                  Help
                                </button>
                              </div>
                            </div>

                            {order.status === 'completed' && (
                              <div className="pt-2">
                                <InvoiceGenerator
                                  isDark={isDark}
                                  orderData={{
                                    orderId: order.orderId, order: {
                                      _id: order.id,
                                      orderId: order.orderId,
                                      amount: order.amount,
                                      currency: order.currency,
                                      status: order.status,
                                      paymentMethod: order.paymentMethod,
                                      items: order.items || [],
                                      description: typeof order.description === 'object' ? JSON.stringify(order.description) : order.description,
                                      createdAt: order.createdAt,
                                      apiResults: order.apiResults || []
                                    }
                                  }}
                                />
                              </div>
                            )}

                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* Pagination */}
            {ordersPagination && ordersPagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-6">
                <button
                  onClick={() => fetchOrders(ordersCurrentPage - 1)}
                  disabled={!ordersPagination.hasPrevPage}
                  className={`px-4 py-2 rounded-lg transition-colors ${isDark
                      ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-900'
                    }`}
                >
                  Previous
                </button>
                <span className={`px-4 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Page {ordersPagination.currentPage} of {ordersPagination.totalPages}
                </span>
                <button
                  onClick={() => fetchOrders(ordersCurrentPage + 1)}
                  disabled={!ordersPagination.hasNextPage}
                  className={`px-4 py-2 rounded-lg transition-colors ${isDark
                      ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-900'
                    }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        );
      case 'ledger':
        if (ledgerEntries.length === 0) {
          return emptyState(
            <FaWallet size={28} />,
            'No Ledger Entries',
            'Your wallet ledger entries will appear here.'
          );
        }

        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ledgerEntries.map((entry, index) => {
                return (
                  <motion.div
                    key={entry.id}
                    className={`rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${isDark
                        ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-emerald-500/30'
                        : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:border-yellow-300'
                      }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    {/* Card Content */}
                    <div className="p-4">
                      {/* Header with Description and Date */}
                      <div className="mb-3">
                        <h3 className={`font-bold text-sm leading-tight mb-1 break-words ${isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                          {entry.description}
                        </h3>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                          {entry.formattedDate}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div className="flex justify-end mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${entry.transactionType === 'credit'
                            ? isDark
                              ? 'bg-green-900/30 text-green-400'
                              : 'bg-green-100 text-green-800'
                            : isDark
                              ? 'bg-red-900/30 text-red-400'
                              : 'bg-red-100 text-red-800'
                          }`}>
                          {entry.transactionType === 'credit' ? 'Credit' : 'Debit'}
                        </span>
                      </div>

                      {/* Transaction Details */}
                      <div className="space-y-2">
                        {/* Amount */}
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-700'
                            }`}>Amount:</span>
                          <span className={`font-bold ${entry.transactionType === 'credit'
                              ? isDark ? 'text-green-400' : 'text-green-600'
                              : isDark ? 'text-red-400' : 'text-red-600'
                            }`}>
                            {entry.formattedAmount}
                          </span>
                        </div>

                        {/* Balance */}
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-700'
                            }`}>Balance:</span>
                          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                            ₹{entry.balanceAfter}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-700'
                            }`}>Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${entry.status === 'completed'
                              ? isDark
                                ? 'bg-green-900/30 text-green-400'
                                : 'bg-green-100 text-green-800'
                              : entry.status === 'pending'
                                ? isDark
                                  ? 'bg-yellow-900/30 text-yellow-400'
                                  : 'bg-yellow-100 text-yellow-800'
                                : isDark
                                  ? 'bg-red-900/30 text-red-400'
                                  : 'bg-red-100 text-red-800'
                            }`}>
                            {entry.status}
                          </span>
                        </div>

                        {/* UTR if available */}
                        {entry.utr && (
                          <div className="flex justify-between items-center">
                            <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-700'
                              }`}>UTR:</span>
                            <span className={`text-xs font-mono break-all ${isDark ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                              {entry.utr}
                            </span>
                          </div>
                        )}

                        {/* Gateway if available */}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination */}
            {ledgerPagination && ledgerPagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-6">
                <button
                  onClick={() => fetchLedger(ledgerCurrentPage - 1)}
                  disabled={!ledgerPagination.hasPrevPage}
                  className={`px-4 py-2 rounded-lg transition-colors ${isDark
                      ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-900'
                    }`}
                >
                  Previous
                </button>
                <span className={`px-4 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Page {ledgerPagination.currentPage} of {ledgerPagination.totalPages}
                </span>
                <button
                  onClick={() => fetchLedger(ledgerCurrentPage + 1)}
                  disabled={!ledgerPagination.hasNextPage}
                  className={`px-4 py-2 rounded-lg transition-colors ${isDark
                      ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-900'
                    }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark
        ? 'bg-gradient-to-br from-gray-900 to-black'
        : 'bg-gradient-to-br from-gray-50 to-white'
      }`}>
      <HeaderBar />
      <div className="pt-16">
        <div className={`w-full rounded-3xl py-16 px-4 relative overflow-hidden transition-colors duration-300 ${isDark
            ? 'bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900'
            : 'bg-gradient-to-r from-emerald-100 via-green-100 to-teal-100'
          }`}>
          <div className={`absolute inset-0 transition-colors duration-300 ${isDark
              ? 'bg-gradient-to-b from-emerald-500/10 to-transparent'
              : 'bg-gradient-to-b from-emerald-500/5 to-transparent'
            }`}></div>
          <div className="max-w-6xl mx-auto relative z-10 text-center">
            <h1 className={`text-3xl md:text-6xl font-bold bg-clip-text text-transparent mb-4 transition-colors duration-300 ${isDark
                ? 'bg-gradient-to-r from-white to-emerald-100'
                : 'bg-gradient-to-r from-gray-900 to-emerald-800'
              }`}>
              Reports
            </h1>
            <p className={`text-sm max-w-2xl mx-auto transition-colors duration-300 ${isDark
                ? 'text-emerald-100/80'
                : 'text-emerald-800/80'
              }`}>
              View and manage your transaction history and account statements
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20">
          <motion.div
            className={`backdrop-blur-sm rounded-2xl border shadow-2xl overflow-hidden transition-colors duration-300 min-h-screen ${isDark
                ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-emerald-500/20'
                : 'bg-gradient-to-br from-white/80 to-gray-100/80 border-emerald-500/30'
              }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`flex justify-center space-x-1 p-1 border-b transition-colors duration-300 ${isDark
                ? 'bg-gray-800/30 border-gray-700/50'
                : 'bg-gray-100/50 border-gray-300/50'
              }`}>
              {['payments', 'purchase', 'ledger'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === tab
                      ? isDark
                        ? 'bg-gray-700/50 text-emerald-400 shadow-lg'
                        : 'bg-gray-200/50 text-emerald-600 shadow-lg'
                      : isDark
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/30'
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Main component with Suspense wrapper
export default function purchasehistory() {
  return (
    <Suspense fallback={<PurchaseHistoryLoading />}>
      <PurchaseHistoryContent />
    </Suspense>
  );
}
