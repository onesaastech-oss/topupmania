'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaArrowLeft, FaSync } from 'react-icons/fa';
import { TransactionAPI } from '@/lib/api/transactions';

function PaymentStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(false);

  // Get transaction IDs from URL params
  const clientTxnId = searchParams.get('client_txn_id');
  const txnId = searchParams.get('txn_id');

  useEffect(() => {
    // Check for dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);

    if (clientTxnId && txnId) {
      checkPaymentStatus();
    } else {
      setError('Missing required parameters: client_txn_id and txn_id');
      setIsLoading(false);
    }
  }, [clientTxnId, txnId]);

  const checkPaymentStatus = async () => {
    try {
      setIsLoading(true);
      const result = await TransactionAPI.getPaymentStatus(clientTxnId, txnId);
      
      if (result.success && result.data) {
        setPaymentStatus(result.data);
        setError(null); // Clear any previous errors
      } else {
        setError(result.message || 'Failed to fetch payment status');
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
      setError('Failed to check payment status');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
        return <FaCheckCircle className="text-green-500 text-6xl" />;
      case 'failed':
      case 'cancelled':
        return <FaTimesCircle className="text-red-500 text-6xl" />;
      case 'pending':
      case 'processing':
        return <FaSpinner className="text-yellow-500 text-6xl animate-spin" />;
      default:
        return <FaSpinner className="text-blue-500 text-6xl animate-spin" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
        return 'text-green-600';
      case 'failed':
      case 'cancelled':
        return 'text-red-600';
      case 'pending':
      case 'processing':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  const getStatusMessage = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
        return 'Payment completed successfully! Your transaction has been processed.';
      case 'failed':
        return 'Payment failed. Please try again or contact support.';
      case 'cancelled':
        return 'Payment was cancelled.';
      case 'pending':
        return 'Payment is pending. Please wait for confirmation.';
      case 'processing':
        return 'Payment is being processed. Please wait...';
      default:
        return 'Checking payment status...';
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900' 
          : 'bg-gradient-to-br from-gray-50 via-emerald-50 to-gray-100'
      }`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, #AA424A 1px, transparent 0)',
          backgroundSize: '50px 50px',
        }}></div>
        
        <div className={`text-center p-8 rounded-3xl shadow-2xl backdrop-blur-sm ${
          isDark 
            ? 'bg-gray-800/90 border border-emerald-800/30' 
            : 'bg-white/90 border border-emerald-200/50'
        }`}>
          <div className="relative">
            <FaSpinner className="text-6xl text-emerald-500 animate-spin mx-auto mb-6" />
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
          </div>
          <p className={`text-xl font-semibold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
            Checking payment status...
          </p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gray-900' : 'bg-gray-100'
      }`}>
        <div className="text-center max-w-md mx-auto p-6">
          <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
          <h1 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Error
          </h1>
          <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {error}
          </p>
          <button
            onClick={() => router.push('/checkoutpage')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center mx-auto"
          >
            <FaArrowLeft className="mr-2" />
            Back to Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      isDark ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className={`max-w-2xl mx-auto p-6 rounded-2xl shadow-xl ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center mt-12">
          <div className="flex justify-center">
            {getStatusIcon(paymentStatus?.status)}
          </div>
          
          <h1 className={`text-2xl font-bold mt-4 mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Payment Status
          </h1>

          
          <p className={`text-lg font-semibold mb-2 ${getStatusColor(paymentStatus?.status)}`}>
            {paymentStatus?.status?.toUpperCase() || 'UNKNOWN'}
          </p>
          
          <p className={`text-sm mb-6 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {getStatusMessage(paymentStatus?.status)}
          </p>

          {paymentStatus && (
            <div className="space-y-4 mb-6">
              {/* Transaction Details */}
              <div className={`space-y-3 text-left ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              } p-4 rounded-lg`}>
                <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Transaction Details
                </h3>
                
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Transaction ID:
                  </span>
                  <span className={`text-sm font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {paymentStatus.orderId}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    UTR:
                  </span>
                  <span className={`text-sm font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {paymentStatus.utr}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Amount:
                  </span>
                  <span className={`text-sm font-bold ${
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>
                    ₹{paymentStatus.amount}
                  </span>
                </div>
                
                
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Status:
                  </span>
                  <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {paymentStatus.status}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Payment Note:
                  </span>
                  <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {paymentStatus.paymentNote}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Created At:
                  </span>
                  <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {new Date(paymentStatus.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Customer Details */}
              <div className={`space-y-3 text-left ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              } p-4 rounded-lg`}>
                <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Customer Details
                </h3>
                
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Name:
                  </span>
                  <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {paymentStatus.customerName}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Email:
                  </span>
                  <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {paymentStatus.customerEmail}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Phone:
                  </span>
                  <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {paymentStatus.customerNumber}
                  </span>
                </div>
              </div>
            </div>
          )}
          

          <div className="space-y-3">
            {/* Refresh button for pending/processing payments */}
            {paymentStatus && ['pending', 'processing'].includes(paymentStatus.status?.toLowerCase()) && (
              <button
                onClick={checkPaymentStatus}
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg flex items-center justify-center"
              >
                <FaSync className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Checking...' : 'Refresh Status'}
              </button>
            )}
            
            <button
              onClick={() => router.push('/checkoutpage')}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center justify-center"
            >
              <FaArrowLeft className="mr-2" />
              Back to Checkout
            </button>
            
            <button
              onClick={() => router.push('/purchasehistory')}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
            >
              View Purchase History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function PaymentStatusLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-emerald-50 to-gray-100">
      <div className="text-center p-8 rounded-3xl shadow-2xl backdrop-blur-sm bg-white/90 border border-emerald-200/50">
        <div className="relative">
          <FaSpinner className="text-6xl text-emerald-500 animate-spin mx-auto mb-6" />
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
        </div>
        <p className="text-xl font-semibold text-emerald-700">
          Loading payment status...
        </p>
        <div className="mt-4 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<PaymentStatusLoading />}>
      <PaymentStatusContent />
    </Suspense>
  );
}