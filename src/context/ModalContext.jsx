"use client"
import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCancelConfirm = (shouldClose) => {
    if (shouldClose) {
      setIsAddMoneyOpen(false);
      setStep(1);
      setAmount('');
      setPaymentMethod('');
    }
    setShowCancelConfirm(false);
  };

  const resetModal = () => {
    setStep(1);
    setAmount('');
    setPaymentMethod('');
    setShowCancelConfirm(false);
    setIsProcessing(false);
  };

  const openAddMoney = () => {
    setIsAddMoneyOpen(true);
  };

  const closeAddMoney = () => {
    if (step > 1) {
      setShowCancelConfirm(true);
    } else {
      resetModal();
      setIsAddMoneyOpen(false);
    }
  };

  return (
    <ModalContext.Provider
      value={{
        isAddMoneyOpen,
        showCancelConfirm,
        step,
        amount,
        paymentMethod,
        isProcessing,
        setStep,
        setAmount,
        setPaymentMethod,
        setIsProcessing,
        openAddMoney,
        closeAddMoney,
        handleCancelConfirm,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
