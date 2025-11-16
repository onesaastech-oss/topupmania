"use client";
import React, { useState, useEffect } from 'react';
import { FaTimes, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaQrcode } from 'react-icons/fa';
import Image from 'next/image';
import { useModal } from '../context/ModalContext';
import { httpClient } from '../lib/api/config';
import { getTheme, setTheme, subscribeToThemeChanges } from '@/lib/utils/theme';

const AddMoneyModal = () => {
  const modalContext = useModal();
  console.log('AddMoneyModal component rendering... modalContext:', modalContext);
  
  const {
    isAddMoneyOpen: isOpen,
    closeAddMoney: onClose,
    step,
    setStep,
    amount,
    setAmount,
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    setIsProcessing,
    showCancelConfirm,
    handleCancelConfirm
  } = modalContext;
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  
  // Theme management
  useEffect(() => {
    setMounted(true);
    setCurrentTheme(getTheme());

    const unsubscribe = subscribeToThemeChanges((theme) => {
      setCurrentTheme(theme);
    });

    return unsubscribe;
  }, []);

  // Component mount detection
  useEffect(() => {
    console.log('AddMoneyModal component mounted!');
  }, []);
  
  // Force re-render detection
  useEffect(() => {
    console.log('useEffect triggered - isOpen changed to:', isOpen);
  }, [isOpen]);

  const isDark = currentTheme === 'dark';

  // Theme-based classes
  const themeClasses = {
    // Modal backgrounds
    modalBg: isDark ? 'bg-gray-900' : 'bg-white',
    backdropBg: isDark ? 'bg-black bg-opacity-70' : 'bg-black bg-opacity-50',
    
    // Text colors
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-200' : 'text-gray-700',
    textMuted: isDark ? 'text-gray-300' : 'text-gray-500',
    textSubtle: isDark ? 'text-gray-400' : 'text-gray-600',
    
    // Borders and dividers
    border: isDark ? 'border-gray-700' : 'border-gray-100',
    borderSecondary: isDark ? 'border-gray-600' : 'border-gray-200',
    divider: isDark ? 'bg-gray-700' : 'bg-gray-100',
    
    // Interactive elements
    inputBg: isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200',
    inputFocus: isDark ? 'focus:border-green-400 focus:ring-green-400' : 'focus:border-green-500 focus:ring-green-500',
    buttonHover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    
    // Success/Error states
    successBg: isDark ? 'bg-green-900' : 'bg-green-50',
    successText: isDark ? 'text-green-200' : 'text-green-700',
    successBorder: isDark ? 'border-green-700' : 'border-green-200',
    
    // Warning/Info states
    warningBg: isDark ? 'bg-amber-900' : 'bg-amber-50',
    warningText: isDark ? 'text-amber-200' : 'text-amber-800',
    warningBorder: isDark ? 'border-amber-700' : 'border-amber-200',
    
    // Info states
    infoBg: isDark ? 'bg-blue-900' : 'bg-blue-50',
    infoText: isDark ? 'text-blue-200' : 'text-blue-800',
    infoBorder: isDark ? 'border-blue-700' : 'border-blue-200',
    
    // Quick amount buttons
    quickAmountSelected: isDark 
      ? 'border-green-400 bg-green-900 text-green-200' 
      : 'border-green-500 bg-green-50 text-green-700',
    quickAmountDefault: isDark 
      ? 'border-gray-600 hover:border-green-400 text-gray-300' 
      : 'border-gray-200 hover:border-green-300 text-gray-700'
  };
  
   // UPI ID for QR code (you can replace this with your actual UPI ID)
   const upiId = 'topupmania@paytm';
   
   // Generate UPI payment link
   const generateUpiLink = (amount) => {
     return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=TopupMania&am=${amount}&cu=INR&tn=Add%20Money%20to%20Wallet`;
   };
   
   // This will be your actual payment URL from the API (replace when integrating with backend)
   const paymentUrl = generateUpiLink(amount);
   const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentUrl)}`;

   // API function to create payment request
   const createPaymentRequest = async (amount) => {
     try {
       setIsCreatingPayment(true);
       const response = await httpClient.post('/wallet/add', {
         amount: parseFloat(amount),
         redirectUrl: `${window.location.origin}/payment-status`
       });
       
      if (response.success) {
        setPaymentData(response.transaction);
        // Open payment URL directly in new tab
        window.location.href = response.transaction.paymentUrl;
        // Close the modal after opening payment URL
        handleClose();
      } else {
        throw new Error(response.message || 'Failed to create payment request');
      }
     } catch (error) {
       console.error('Payment creation error:', error);
       alert('Failed to create payment request. Please try again.');
     } finally {
       setIsCreatingPayment(false);
     }
   };

  const handleAmountSubmit = (e) => {
    e.preventDefault();
    if (amount) {
      setStep(2);
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (selectedPayment) {
      // Simulate payment processing
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        setStep(3);
      }, 1500);
    }
  };

  const handleClose = () => {
    if (step > 1) {
      handleCancelConfirm(true); // Show cancel confirmation
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };


  console.log('AddMoneyModal render - isOpen:', isOpen, 'step:', step);
  
  if (!isOpen) return null;

  // Cancel confirmation dialog
  if (showCancelConfirm) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-[102] p-4 pointer-events-none">
        <div className={`${themeClasses.modalBg} rounded-2xl w-full max-w-xs overflow-hidden shadow-2xl border ${themeClasses.borderSecondary} z-[103] pointer-events-auto`}>
          <div className="p-4 text-center">
            <h3 className={`text-lg font-medium mb-3 ${themeClasses.text}`}>Cancel Transaction?</h3>
            <p className={`${themeClasses.textMuted} mb-4`}>Are you sure you want to cancel this transaction?</p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleCancelConfirm(false)}
                className={`flex-1 py-2 text-sm border ${themeClasses.borderSecondary} rounded-lg font-medium ${themeClasses.buttonHover} ${themeClasses.textSecondary}`}
              >
                No, Continue
              </button>
              <button
                onClick={() => handleCancelConfirm(true)}
                className="flex-1 py-2 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 ${themeClasses.backdropBg} pointer-events-auto`}
        onClick={handleClose}
      />
      
      {/* Bottom Sheet */}
      <div className={`absolute bottom-0 left-0 right-0 ${themeClasses.modalBg} rounded-t-3xl shadow-2xl pointer-events-auto transform transition-transform duration-300 ease-out translate-y-0`}>
        <div className="w-full">
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className={`w-10 h-1 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full`}></div>
          </div>
          
          {/* Header */}
          <div className={`px-6 py-4 border-b ${themeClasses.border}`}>
            <div className="flex items-center justify-between">
              {step > 1 ? (
                <button 
                  onClick={() => setStep(step - 1)}
                  className={`p-2 ${themeClasses.buttonHover} rounded-full transition-colors`}
                >
                  <FaArrowLeft size={20} className={themeClasses.textMuted} />
                </button>
              ) : (
                <div className="w-10"></div>
              )}
              
              <h2 className={`${themeClasses.text} font-bold text-xl`}>
                {step === 1 ? 'Add Money' : 'Payment Method'}
              </h2>
              
              <button 
                onClick={handleClose}
                className={`p-2 ${themeClasses.buttonHover} rounded-full transition-colors`}
              >
                <FaTimes size={20} className={themeClasses.textMuted} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-8">
            {step === 1 && (
              <div>
                {/* Quick Amount Options */}
                <div className="mb-6">
                  <h3 className={`${themeClasses.textSecondary} font-medium mb-3`}>Quick Add</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[50, 100, 200, 500, 1000, 2000].map((quickAmount) => (
                      <button
                        key={quickAmount}
                        onClick={() => setAmount(quickAmount.toString())}
                        className={`py-3 rounded-xl border-2 transition-all ${
                          amount === quickAmount.toString()
                            ? themeClasses.quickAmountSelected
                            : themeClasses.quickAmountDefault
                        }`}
                      >
                        <div className="text-sm font-medium">₹{quickAmount}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount Input */}
                <div className="mb-6">
                  <h3 className={`${themeClasses.textSecondary} font-medium mb-3`}>Custom Amount</h3>
                  <div className="relative">
                    <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted} text-lg`}>₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={`w-full pl-10 pr-2 py-3 text-base border-2 ${themeClasses.inputBg} rounded-xl focus:ring-2 ${themeClasses.inputFocus} outline-none transition-all ${themeClasses.text}`}
                      placeholder="Enter amount"
                      min="1"
                    />
                  </div>
                  <p className={`${themeClasses.textMuted} text-xs mt-2`}>Minimum amount: ₹1</p>
                </div>

                {/* Continue Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (amount && parseFloat(amount) >= 1) {
                      createPaymentRequest(amount);
                    }
                  }}
                  disabled={!amount || parseFloat(amount) < 1 || isCreatingPayment}
                  className="w-full bg-green-600 text-white py-4 text-lg rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingPayment ? 'Creating Payment...' : `Add ₹${amount || '0'} to Wallet`}
                </button>
              </div>
            )}

            {step === 2 && !isSuccess && paymentData && (
              <div>
                {/* Amount Summary */}
                <div className="text-center mb-6">
                  <div className={`${themeClasses.successBg} rounded-2xl p-6 mb-4 border ${themeClasses.successBorder}`}>
                    <div className={`${themeClasses.successText} font-medium text-sm mb-1`}>Adding to wallet</div>
                    <div className={`text-3xl font-bold ${themeClasses.successText}`}>₹{paymentData.amount}</div>
                    <div className={`${themeClasses.textMuted} text-sm mt-1`}>Order ID: {paymentData.orderId}</div>
                  </div>
                </div>

                {/* Payment Options */}
                <div className={`${themeClasses.modalBg} border-2 ${themeClasses.borderSecondary} rounded-2xl p-6 mb-6`}>
                  <div className="text-center">
                    <div className={`${themeClasses.infoBg} rounded-xl p-4 mb-4 inline-block`}>
                      <FaQrcode className={`${themeClasses.infoText} text-3xl mx-auto`} />
                    </div>
                    <h3 className={`font-semibold ${themeClasses.text} mb-4`}>Complete Your Payment</h3>
                    
                    {/* Direct Payment Link */}
                    <div className={`${isDark ? 'bg-gradient-to-r from-blue-900 to-green-900' : 'bg-gradient-to-r from-blue-50 to-green-50'} rounded-xl p-6 mb-4`}>
                      <p className={`${themeClasses.textSecondary} text-sm mb-4`}>
                        Click the button below to open the payment gateway and complete your transaction:
                      </p>
                      <a
                        href={paymentData.paymentUrl}
                        className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <FaQrcode className="mr-3" />
                        Open Payment Gateway
                        <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <p className={`${themeClasses.textMuted} text-xs mt-3`}>
                        This will redirect you to the secure payment gateway
                      </p>
                    </div>
                    
                    {/* Payment Info */}
                    <div className={`${themeClasses.infoBg} rounded-xl p-4 text-left border ${themeClasses.infoBorder}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`${themeClasses.infoText} text-sm font-medium`}>Transaction ID:</span>
                        <span className={`${themeClasses.infoText} text-sm font-mono`}>{paymentData._id}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`${themeClasses.infoText} text-sm font-medium`}>Amount:</span>
                        <span className={`${themeClasses.infoText} text-sm font-semibold`}>₹{paymentData.amount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`${themeClasses.infoText} text-sm font-medium`}>Status:</span>
                        <span className={`${isDark ? 'text-orange-400' : 'text-orange-600'} text-sm font-medium capitalize`}>{paymentData.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className={`${themeClasses.warningBg} border ${themeClasses.warningBorder} rounded-xl p-4 mb-6`}>
                  <div className="flex items-start space-x-3">
                    <div className={`${isDark ? 'bg-amber-800' : 'bg-amber-100'} rounded-full p-1`}>
                      <svg className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className={`${themeClasses.warningText} text-sm font-medium`}>Payment Instructions</p>
                      <p className={`${themeClasses.warningText} text-xs mt-1`}>
                        Click the payment gateway button to go to the QR code page. Complete your payment and you'll be redirected back.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleCancel}
                    className={`flex-1 py-3 ${themeClasses.textSecondary} border-2 ${themeClasses.borderSecondary} rounded-xl font-medium ${themeClasses.buttonHover} transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePaymentSubmit}
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                  >
                    I've Completed Payment
                  </button>
                </div>
              </div>
            )}

            {isSuccess && (
              <div className="text-center py-8">
                <div className={`${isDark ? 'bg-green-800' : 'bg-green-100'} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6`}>
                  <FaCheckCircle className={`${isDark ? 'text-green-400' : 'text-green-600'} text-4xl`} />
                </div>
                <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>Payment Successful!</h3>
                <p className={`${themeClasses.textSecondary} mb-2`}>₹{paymentData?.amount || amount} has been added to your wallet</p>
                <p className={`${themeClasses.textMuted} text-sm mb-2`}>Transaction ID: {paymentData?._id}</p>
                <p className={`${themeClasses.textMuted} text-sm mb-8`}>Your new balance will be reflected shortly</p>
                
                <button
                  onClick={handleClose}
                  className="w-full bg-green-600 text-white py-4 text-lg rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMoneyModal;
