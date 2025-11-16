'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import InvoiceGenerator from '@/components/InvoiceGenerator';
import { getOrderStatus, getMockOrderData } from '@/lib/api/orders';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

function InvoiceTestContent() {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get('orderId');

  // Theme detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkTheme = () => {
      const root = document.documentElement;
      const isDarkTheme = root.classList.contains('dark');
      setIsDark(isDarkTheme);
    };
    
    checkTheme();
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  // Fetch order data
  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (orderId) {
          // Fetch real order data
          const data = await getOrderStatus(orderId);
          setOrderData(data);
        } else {
          // Use mock data for testing
          const mockData = getMockOrderData();
          setOrderData(mockData);
        }
      } catch (err) {
        console.error('Error fetching order data:', err);
        setError('Failed to fetch order data');
        // Fallback to mock data
        const mockData = getMockOrderData();
        setOrderData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gray-900' : 'bg-gray-100'
      }`}>
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-emerald-500 mx-auto mb-4" />
          <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Loading order data...
          </p>
        </div>
      </div>
    );
  }

  if (error && !orderData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gray-900' : 'bg-gray-100'
      }`}>
        <div className="text-center">
          <p className={`text-lg text-red-500 mb-4`}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      isDark ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      {/* Header */}
      <div className={`p-6 border-b ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Invoice Generator
              </h1>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {orderId ? `Order ID: ${orderId}` : 'Using mock data for testing'}
              </p>
            </div>
          </div>
          
          {orderData && (
            <InvoiceGenerator 
              orderData={orderData} 
              isDark={isDark} 
              onClose={() => {}} 
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className={`rounded-lg p-6 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Order Information
          </h2>
          
          {orderData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Order ID
                  </label>
                  <p className={`text-sm ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {orderData.order._id}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Status
                  </label>
                  <p className={`text-sm capitalize ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {orderData.order.status}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Amount
                  </label>
                  <p className={`text-sm font-semibold ${
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>
                    ₹{orderData.order.amount}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Payment Method
                  </label>
                  <p className={`text-sm capitalize ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {orderData.order.paymentMethod}
                  </p>
                </div>
              </div>
              
              <div>
                <label className={`text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Items
                </label>
                <div className="mt-2 space-y-2">
                  {orderData.order.items.map((item, index) => (
                    <div key={index} className={`p-3 rounded-lg ${
                      isDark ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <p className={`text-sm font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.itemName}
                      </p>
                      <p className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Quantity: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InvoiceTestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-emerald-500 mx-auto mb-4" />
          <p className="text-lg text-gray-900 dark:text-white">
            Loading...
          </p>
        </div>
      </div>
    }>
      <InvoiceTestContent />
    </Suspense>
  );
}
