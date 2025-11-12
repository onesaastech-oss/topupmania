'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaArrowLeft, FaSync } from 'react-icons/fa';
import InvoiceGenerator from '@/components/InvoiceGenerator';
import { getOrderStatus } from '@/lib/api/orders';

function PaymentStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderStatus, setOrderStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(false);

  // Get order ID from URL params - UPI payments use client_txn_id
  const orderId = searchParams.get('client_txn_id') || searchParams.get('orderId') || searchParams.get('order_id') || searchParams.get('transactionId');

  useEffect(() => {
    // Check for dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);

    if (orderId) {
      checkOrderStatus();
    } else {
      setError('No order ID provided');
      setIsLoading(false);
    }
  }, [orderId]);

  const checkOrderStatus = async () => {
    try {
      setIsLoading(true);
      const result = await getOrderStatus(orderId);
      
      if (result.success && result.order) {
        setOrderStatus(result.order);
        setError(null); // Clear any previous errors
      } else {
        // Check if it's specifically an "Order not found" error
        const errorMessage = result.message || result.error || 'Failed to fetch order status';
        
        if (errorMessage.toLowerCase().includes('order not found') || 
            errorMessage.toLowerCase().includes('not found') ||
            errorMessage === 'Order not found' ||
            errorMessage === 'order not found' ||
            (result.error && result.error.toLowerCase().includes('order not found'))) {
          setError('ORDER_NOT_FOUND');
        } else {
          setError(errorMessage);
        }
      }
    } catch (err) {
      console.error('Error checking order status:', err);
      setError('Failed to check order status');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
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
      case 'completed':
      case 'success':
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
      case 'completed':
      case 'success':
        return 'Payment completed successfully! Your diamonds have been added to your account.';
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
            Checking order status...
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

  // Professional Order Not Found component
  if (error === 'ORDER_NOT_FOUND') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900' 
          : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100'
      }`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, #3b82f6 1px, transparent 0)',
          backgroundSize: '50px 50px',
        }}></div>
        
        <div className={`text-center max-w-lg mx-auto p-8 rounded-3xl shadow-2xl backdrop-blur-sm ${
          isDark 
            ? 'bg-gray-800/90 border border-blue-800/30' 
            : 'bg-white/90 border border-blue-200/50'
        }`}>
          {/* Professional Icon */}
          <div className="relative mb-6">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
              isDark ? 'bg-blue-900/30' : 'bg-blue-100'
            }`}>
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-pulse"></div>
          </div>

          <h1 className={`text-3xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Order Not Found
          </h1>
          
          <p className={`text-lg mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            We couldn't locate the order you're looking for.
          </p>
          
          <p className={`text-sm mb-8 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            This could happen if the order ID is incorrect or the order hasn't been processed yet.
          </p>

          {/* Order ID Display */}
          <div className={`p-4 rounded-lg mb-6 ${
            isDark ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <p className={`text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Order ID you searched for:
            </p>
            <p className={`text-sm font-mono p-2 rounded ${
              isDark ? 'bg-gray-800 text-blue-300' : 'bg-white text-blue-600'
            }`}>
              {orderId}
            </p>
          </div>


          {/* Helpful Actions */}
          <div className="space-y-3">
            <button
              onClick={checkOrderStatus}
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-all duration-200"
            >
              <FaSync className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Searching...' : 'Try Again'}
            </button>
            
            <button
              onClick={() => router.push('/purchasehistory')}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-200"
            >
              View All Orders
            </button>
            
            <button
              onClick={() => router.push('/checkoutpage')}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-all duration-200"
            >
              <FaArrowLeft className="mr-2" />
              Create New Order
            </button>
          </div>

          {/* Support Information */}
          <div className={`mt-8 p-4 rounded-lg ${
            isDark ? 'bg-gray-700/30' : 'bg-blue-50'
          }`}>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-blue-700'
            }`}>
              Still having trouble? Contact our support team for assistance.
            </p>
            <button
              onClick={() => router.push('/support')}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium mt-2 transition-colors duration-200"
            >
              Get Support →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Generic error handling
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
    <div className={`min-h-screen mt-16 ${
      isDark ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className={`max-w-2xl mx-auto p-6 rounded-2xl shadow-xl ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center">
          <div className="flex justify-center">
            {getStatusIcon(orderStatus?.status)}
          </div>
          
          <h1 className={`text-2xl font-bold mt-4 mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Order Status
          </h1>

          
          <p className={`text-lg font-semibold mb-2 ${getStatusColor(orderStatus?.status)}`}>
            {orderStatus?.status?.toUpperCase() || 'UNKNOWN'}
          </p>
          
          <p className={`text-sm mb-6 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {getStatusMessage(orderStatus?.status)}
          </p>

          {orderStatus && (
            <div className="space-y-4 mb-6">
              {/* Order Details */}
              <div className={`space-y-3 text-left ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              } p-4 rounded-lg`}>
                <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Order Details
                </h3>
                
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Order ID:
                  </span>
                  <span className={`text-sm font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {orderId}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Amount:
                  </span>
                  <span className={`text-sm font-bold ${
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>
                    ₹{orderStatus.amount}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Payment Method:
                  </span>
                  <span className={`text-sm capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {orderStatus.paymentMethod || 'UPI'}
                  </span>
                </div>
                
                {orderStatus.items && orderStatus.items.length > 0 && (
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Item:
                    </span>
                    <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {orderStatus.items[0].itemName}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Order Date:
                  </span>
                  <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {new Date(orderStatus.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Order Status:
                  </span>
                  <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {(orderStatus?.status)}
                  </span>
                </div>
              </div>

              {/* Game Details */}
              {orderStatus.description && (
                <div className={`space-y-3 text-left ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                } p-4 rounded-lg`}>
                  <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Game Details
                  </h3>
                  
                  {(() => {
                    try {
                      const desc = JSON.parse(orderStatus.description);
                      return (
                        <>
                          <div className="flex justify-between">
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Player ID:
                            </span>
                            <span className={`text-sm font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {desc.playerId}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Server:
                            </span>
                            <span className={`text-sm font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {desc.server}
                            </span>
                          </div>
                        </>
                      );
                    } catch (e) {
                      return null;
                    }
                  })()}
                </div>
              )}
            </div>
          )}
          

          <div className="space-y-3">
            {orderStatus && ['completed','success'].includes((orderStatus.status || '').toLowerCase()) && (
              <InvoiceGenerator
                isDark={isDark}
                orderData={{ orderId: orderId, order: {
                  _id: orderStatus._id || orderId,
                  orderId: orderId,
                  amount: orderStatus.amount,
                  currency: orderStatus.currency,
                  status: orderStatus.status,
                  paymentMethod: orderStatus.paymentMethod || 'upi',
                  items: orderStatus.items || [],
                  description: typeof orderStatus.description === 'string' ? orderStatus.description : JSON.stringify(orderStatus.description || {}),
                  createdAt: orderStatus.createdAt,
                  apiResults: orderStatus.apiResults || []
                }}}
              />
            )}

            {/* Refresh button for pending/processing orders */}
            {orderStatus && ['pending', 'processing'].includes(orderStatus.status?.toLowerCase()) && (
              <button
                onClick={checkOrderStatus}
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg flex items-center justify-center"
              >
                <FaSync className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Checking...' : 'Refresh Status'}
              </button>
            )}
            
            <button
              onClick={() => router.push('/checkoutpage')}
              className="w-full bg-green-500 hover:bg-neon-600 text-white px-6 py-3 rounded-lg flex items-center justify-center"
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
          Loading order status...
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
