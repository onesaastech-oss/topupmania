'use client';

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaCheck, FaInstagram, FaWhatsapp, FaTelegram, FaYoutube, FaSpinner, FaTimes, FaFileInvoice, FaClipboardList, FaCheckCircle, FaCoins, FaCreditCard } from "react-icons/fa";
import { validateUser, createDiamondPackOrder, createDiamondPackOrderUPI, getGameDiamondPacks, getValidationHistory } from "@/lib/api/games";
import InvoiceGenerator from "@/components/InvoiceGenerator";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("wallet");
  const [diamondPacks, setDiamondPacks] = useState([]);
  const [gameData, setGameData] = useState(null);
  const [isLoadingPacks, setIsLoadingPacks] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPack, setSelectedPack] = useState(null);
  const [validationFields, setValidationFields] = useState({});
  const [validationStatus, setValidationStatus] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [username, setUsername] = useState('');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showProductPopup, setShowProductPopup] = useState(false);
  const [selectedProductForPopup, setSelectedProductForPopup] = useState(null);
  const [popupAnimating, setPopupAnimating] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [notification, setNotification] = useState(null);
  const [validationHistory, setValidationHistory] = useState([]);
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const [showHistorySelector, setShowHistorySelector] = useState(false);
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availableCategories, setAvailableCategories] = useState([]);

  // User data - replace with actual auth context
  const user = {
    walletBalance: 150.50
  };

  // Notification system
  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(null);
    }, duration);
  };

  const closeNotification = () => {
    setNotification(null);
  };

  // Effect to handle order modal animation and body scroll
  useEffect(() => {
    if (orderResult) {
      // Prevent body scroll when modal opens
      document.body.style.overflow = 'hidden';
      setTimeout(() => setShowOrderModal(true), 100);
    } else {
      // Restore body scroll when modal closes
      document.body.style.overflow = 'unset';
      setShowOrderModal(false);
    }

    // Cleanup function to ensure body scroll is restored
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [orderResult]);

  // Function to close modal with animation
  const closeOrderModal = useCallback(() => {
    setShowOrderModal(false);
    setTimeout(() => {
      setOrderResult(null);
      // Ensure body scroll is restored
      document.body.style.overflow = 'unset';
    }, 300);
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && orderResult) {
        closeOrderModal();
      }
    };

    if (orderResult) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [orderResult, closeOrderModal]);

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      // Ensure body scroll is always restored when component unmounts
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Get game details from URL params
  const gameId = searchParams.get("gameId") || "ml";
  const gameName = searchParams.get("gameName") || searchParams.get("game") || "Mobile Legends";
  const gamePublisher = searchParams.get("publisher") || "Moonton";
  const gameImage = searchParams.get("image") || "https://api.credimi.in/static/uploads/erwnpd-908ec342-2250-432a-baa9-5d444c9475ab.webp";
  const [ogcode, setOgcode] = useState(null);


  // Get wallet balance from user data
  const walletBalance = user?.walletBalance || 0;

  // Calculate payable amount based on selected pack
  const selectedPackAmount = selectedPack?.amount || 0;
  const payableAmount = selectedPayment === "wallet"
    ? Math.max(0, selectedPackAmount - walletBalance)
    : selectedPackAmount;

  // Filter diamond packs by category - only show active packs
  const filteredDiamondPacks = selectedCategory === 'all' 
    ? diamondPacks.filter(pack => pack.status === "active")
    : diamondPacks.filter(pack => pack.category === selectedCategory && pack.status === "active");

  // Theme detection effect
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

    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        checkTheme();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Load diamond packs
  useEffect(() => {
    const loadPacks = async () => {
      setIsLoadingPacks(true);
      try {
        // Use gameId from URL params, default to Mobile Legends gameId
        const realGameId = gameId === "ml" ? "68c18d6344fcb919aaa88213" : gameId;

        const result = await getGameDiamondPacks(realGameId);

        if (result.success && result.diamondPacks.length > 0) {
          // Transform API data to match frontend format
          const transformedPacks = result.diamondPacks.map(pack => ({
            id: pack._id,
            description: pack.description,
            amount: pack.amount,
            cashback: pack.cashback,
            logo: pack.logo,
            category: pack.category,
            status: pack.status
          }));

          setDiamondPacks(transformedPacks);
          setGameData(result.gameData || {
            name: gameName,
            publisher: gamePublisher,
            image: gameImage,
            validationFields: result.gameData?.validationFields || ['playerId', 'server']
          });
          setOgcode(result.gameData?.ogcode || null);

          // Extract unique categories
          const categories = [...new Set(transformedPacks.map(pack => pack.category).filter(Boolean))];
          setAvailableCategories(['all', ...categories]);

          if (transformedPacks.length > 0) {
            setSelectedPack(transformedPacks[0]);
            showNotification('Diamond packs loaded successfully!', 'success');
          }
        } else {
          console.warn('API failed:', result.error);
          setError('No diamond packs available for this game');
          showNotification('No diamond packs available for this game', 'error');
        }
      } catch (err) {
        console.error('Failed to load diamond packs:', err);
        setError('Failed to load diamond packs. Please try again later.');
        showNotification('Failed to load diamond packs. Please try again later.', 'error');
      } finally {
        setIsLoadingPacks(false);
      }
    };

    loadPacks();
  }, [gameId]);

  // Initialize validation fields when gameData changes
  useEffect(() => {
    if (gameData?.validationFields) {
      const fields = {};
      gameData.validationFields.forEach(field => {
        fields[field] = '';
      });
      setValidationFields(fields);
    }
  }, [gameData]);

  // Fetch validation history when gameData is available
  useEffect(() => {
    const fetchValidationHistory = async () => {
      if (gameData?._id) {
        const result = await getValidationHistory(gameData._id);
        if (result.success && result.validationHistory.length > 0) {
          setValidationHistory(result.validationHistory.slice(0, 5)); // Only keep last 5
          // Show popup asking if user wants to use last validation
          setShowHistoryPopup(true);
        }
      }
    };

    fetchValidationHistory();
  }, [gameData]);

  // Cleanup effect for body scroll
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleValidation = async () => {
    // Check if user is authenticated by checking authToken in localStorage
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    
    if (!authToken) {
      // User is not authenticated, redirect to login
      setValidationStatus('invalid');
      setValidationMessage('Please login to continue with your purchase');
      setValidationResult({
        status: false,
        message: 'Please login to continue with your purchase'
      });
      
      // Show notification and redirect to login
      showNotification('Please login to continue with your purchase', 'warning', 3000);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }

    // Check if all required validation fields are filled
    const requiredFields = gameData?.validationFields || ['playerId', 'server'];
    const missingFields = requiredFields.filter(field => !validationFields[field]?.trim());

    if (missingFields.length > 0) {
      const hasRegionList = gameData?.regionList && gameData.regionList.length > 0;
      const fieldNames = missingFields.map(field => {
        switch (field) {
          case 'playerId': return 'Player ID';
          case 'server': return hasRegionList ? 'Region' : 'Server';
          default: return field;
        }
      }).join(', ');
      setValidationMessage(`Please enter ${fieldNames}`);
      setValidationStatus('invalid');
      return;
    }

    setIsValidating(true);
    setValidationStatus('validating');
    setValidationMessage('');
    setValidationResult(null);
    setUsername('');

    try {
      // Call real validation API
      const validationData = {
        gameId: gameData?._id,
        ogcode: ogcode,
        ...validationFields
      };

      const result = await validateUser(validationData);
      console.log(result);

      if (result.success && result.isValid) {
        // Successful validation
        setValidationResult({
          status: true,
          message: result.message,
          username: result.userInfo?.username,
          server: result.userInfo?.server
        });
        setUsername(result.userInfo?.username || 'Unknown Player');
        setValidationStatus('valid');
        setValidationMessage(result.message || 'User validation successful!');
      } else {
        // Failed validation
        setValidationStatus('invalid');
        setValidationMessage(result.message || "Invalid User ID or Server ID");
        setValidationResult({
          status: false,
          message: result.message || "Invalid User ID or Server ID"
        });
      }
    } catch (error) {
      console.error('Validation error:', error);
      setValidationStatus('invalid');
      setValidationMessage("Validation failed. Please try again.");
      setValidationResult({ status: false, message: "Validation failed. Please try again." });
    } finally {
      setIsValidating(false);
    }
  };

  // Handle using last validation data
  const handleUseLastValidation = () => {
    if (validationHistory.length > 0) {
      const lastValidation = validationHistory[0];
      const newFields = {};

      // Map history data to validation fields
      if (lastValidation.playerId) newFields.playerId = lastValidation.playerId;
      if (lastValidation.server) newFields.server = lastValidation.server;

      setValidationFields(newFields);
      
      // Set validation status to valid since this is from previous successful validation
      setValidationStatus('valid');
      setValidationMessage('User validation successful!');
      setValidationResult({
        status: true,
        message: 'User validated from history',
        username: lastValidation.playerName || lastValidation.username || lastValidation.nickname || 'Unknown Player',
        server: lastValidation.server
      });
      setUsername(lastValidation.playerName || lastValidation.username || lastValidation.nickname || 'Unknown Player');
      setSelectedHistoryIndex(0);
      
      setShowHistoryPopup(false);
    }
  };

  // Handle opening history selector
  const handleShowHistorySelector = () => {
    setShowHistoryPopup(false);
    setShowHistorySelector(true);
  };

  // Handle selecting from history
  const handleSelectHistory = (index) => {
    const selectedValidation = validationHistory[index];
    const newFields = {};

    // Map history data to validation fields
    if (selectedValidation.playerId) newFields.playerId = selectedValidation.playerId;
    if (selectedValidation.server) newFields.server = selectedValidation.server;

    setValidationFields(newFields);
    
    // Set validation status to valid and populate player info
    setValidationStatus('valid');
    setValidationMessage('User validation successful!');
    setValidationResult({
      status: true,
      message: 'User validated from history',
      username: selectedValidation.playerName || selectedValidation.username || selectedValidation.nickname || 'Unknown Player',
      server: selectedValidation.server
    });
    setUsername(selectedValidation.playerName || selectedValidation.username || selectedValidation.nickname || 'Unknown Player');
    
    setSelectedHistoryIndex(index);
    setShowHistorySelector(false);
  };

  const handleProductSelect = (pack) => {
    setSelectedProductForPopup(pack);
    setShowProductPopup(true);

    setTimeout(() => {
      setPopupAnimating(true);
    }, 10);

    document.body.style.overflow = 'hidden';
  };

  const handleClosePopup = () => {
    setPopupAnimating(false);
    document.body.style.overflow = 'unset';

    setTimeout(() => {
      setShowProductPopup(false);
      setSelectedProductForPopup(null);
    }, 300);
  };

  const handleBuyWithCoin = async () => {
    if (validationStatus !== 'valid') {
      showNotification('Please validate your Character ID and Server ID first', 'error');
      return;
    }

    if (!selectedProductForPopup || !selectedProductForPopup.id) {
      showNotification('Invalid diamond pack selected', 'error');
      return;
    }

    setIsProcessingOrder(true);
    setOrderResult(null);

    try {
      // Create real order with wallet payment
      const orderData = {
        diamondPackId: selectedProductForPopup.id,
        ...validationFields,
        quantity: 1
      };

      const result = await createDiamondPackOrder(orderData);

      if (result.success) {
        setOrderResult(result);
        setShowProductPopup(false);
        showNotification(`Order created successfully! Order ID: ${result.orderId}`, 'success');
      } else {
        showNotification('Order failed: Please contact customer support', 'error');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      showNotification('An error occurred while creating the order. Please try again.', 'error');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const handleBuyWithUPI = async () => {
    if (validationStatus !== 'valid') {
      showNotification('Please validate your Character ID and Server ID first', 'error');
      return;
    }

    if (!selectedProductForPopup || !selectedProductForPopup.id) {
      showNotification('Invalid diamond pack selected', 'error');
      return;
    }

    setIsProcessingOrder(true);
    setOrderResult(null);

    try {
      // Create real UPI order
      const orderData = {
        diamondPackId: selectedProductForPopup.id,
        ...validationFields,
        quantity: 1,
        redirectUrl: `${window.location.origin}/order-status`
      };

      const result = await createDiamondPackOrderUPI(orderData);

      if (result.success && result.paymentUrl) {
        // Redirect to payment URL to show QR code
        showNotification('Redirecting to payment gateway...', 'info');
        window.location.href = result.paymentUrl;
      } else if (result.success) {
        // Order created but no payment URL - show order details
        showNotification(`UPI Order created successfully! Order ID: ${result.orderId || result.transaction?.orderId}`, 'success');
        setOrderResult(result);
        setShowProductPopup(false);
      } else {
        // Order failed
        const errorMessage = result.message || result.error || 'Unknown error occurred';
        console.error('UPI Order failed:', errorMessage);
        showNotification(`UPI Order failed: ${errorMessage}`, 'error');
      }
    } catch (error) {
      console.error('UPI Order creation error:', error);
      showNotification('An error occurred while creating the UPI order. Please try again.', 'error');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col relative ${isDark
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-gray-100'
        : 'bg-gray-200 text-gray-900'
      }`}>

      {/* Notification Component */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className={`rounded-lg shadow-lg border-l-4 p-4 transform transition-all duration-300 ${notification.type === 'success'
              ? 'bg-green-50 border-green-500 text-green-800'
              : notification.type === 'error'
                ? 'bg-red-50 border-red-500 text-red-800'
                : 'bg-blue-50 border-blue-500 text-blue-800'
            }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {notification.type === 'success' && <FaCheckCircle className="w-5 h-5 mr-2" />}
                {notification.type === 'error' && <FaTimes className="w-5 h-5 mr-2" />}
                {notification.type === 'info' && <FaSpinner className="w-5 h-5 mr-2 animate-spin" />}
                <span className="text-sm font-medium">{notification.message}</span>
              </div>
              <button
                onClick={closeNotification}
                className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10">
        {/* Modern Hero Banner */}
        <section className={`relative w-full rounded-3xl min-h-[280px] md:min-h-[280px] overflow-hidden mt-16 ${isDark
            ? 'bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900'
            : 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600'
          }`}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, #AA424A 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}></div>

          {/* Dynamic Grid Pattern */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: isDark
              ? 'linear-gradient(rgba(100, 13, 20, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 13, 20, 0.25) 1px, transparent 1px)'
              : 'linear-gradient(rgba(170, 66, 74, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(170, 66, 74, 0.2) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 70%)',
          }}></div>

          {/* Animated gradient overlay */}
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(circle at 15% 25%, rgba(100, 13, 20, 0.5) 0%, transparent 25%),
              radial-gradient(circle at 85% 75%, rgba(170, 66, 74, 0.45) 0%, transparent 25%),
              linear-gradient(45deg, rgba(170, 66, 74, 0.15) 0%, transparent 100%)
            `,
            backgroundSize: '200% 200%',
          }}></div>

          <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Diamond Checkout
              </h1>
              <p className="text-emerald-100 max-w-2xl">
                Purchase diamonds instantly and securely
              </p>
            </div>
          </div>

          {/* Bottom wave effect */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500/10 via-teal-400/10 to-cyan-400/20 backdrop-blur-md"></div>
        </section>

        <div className="relative z-10 -mt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 flex-1">
          {/* Main Container Card */}
          <div className={`rounded-2xl shadow-2xl overflow-hidden p-6 space-y-6 ${isDark
              ? 'bg-gray-800/95 border border-gray-700/50'
              : 'bg-white border border-gray-200'
            }`}>

            <div className="space-y-4">
              {/* Game Info Card */}
              <div className={`rounded-xl p-4 ${isDark
                  ? 'bg-gray-800/60 border border-gray-700/50'
                  : 'bg-gray-50 border border-gray-200 shadow-sm'
                }`}>
                <div className="flex items-center">
                  <div className={`w-30 h-16 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg overflow-hidden flex-shrink-0`}>
                    <Image
                      src={gameData?.image || gameImage}
                      alt={gameData?.name || gameName}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <h2 className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'
                      }`}>{gameData?.name || gameName}</h2>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>{gameData?.publisher || gamePublisher}</p>
                  </div>
                </div>
              </div>

              {/* Social Media Card */}
              <div className={`rounded-xl p-4 ${isDark
                  ? 'bg-gray-800/60 border border-gray-700/50'
                  : 'bg-gray-50 border border-gray-200 shadow-sm'
                }`}>
                <h3 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>Follow us on</h3>
                <div className="flex justify-between max-w-md mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-10">
                  <a
                    href="https://www.instagram.com/credimi.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white hover:opacity-90 transition-all hover:scale-105 shadow-lg"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="text-2xl" />
                  </a>
                  <a
                    href="https://whatsapp.com/channel/0029VapeuCHHbFV1MPDEnR26"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-whatsapp-500 to-whatsapp-600 flex items-center justify-center text-white hover:opacity-90 transition-all hover:scale-105 shadow-lg"
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp className="text-2xl" />
                  </a>
                  <a
                    href="https://t.me/credimics"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white hover:opacity-90 transition-all hover:scale-105 shadow-lg"
                    aria-label="Telegram"
                  >
                    <FaTelegram className="text-2xl" />
                  </a>
                  <a
                    href="https://youtube.com/@credimi?si=lRsWtrN5Rw-ryM3w"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white hover:opacity-90 transition-all hover:scale-105 shadow-lg"
                    aria-label="YouTube"
                  >
                    <FaYoutube className="text-2xl" />
                  </a>
                </div>
              </div>

              {/* C Coin Wallet Card */}
              {/* <div className={`rounded-xl p-4 ${
                isDark 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-gray-50/60 border border-gray-200/50'
              }`}>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between w-full">
                      <h4 className={`font-medium text-lg ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>C Coin Wallet</h4>
                      {isLoading ? (
                        <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                      ) : user ? (
                        <p className="text-[#AA424A] font-medium text-lg">
                          ₹{walletBalance.toFixed(2)}
                        </p>
                      ) : (
                        <p className="text-red-400 font-medium text-sm">
                          Please login
                        </p>
                      )}
                    </div>

                    {!isLoading && user && (
                      <div className="mt-3">
                        <div
                          style={{
                            width: `${Math.min(
                              100,
                              (walletBalance / selectedPackAmount) * 100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div> */}

              {/* Dynamic Validation Fields Card */}
              <div className={`rounded-xl p-4 ${isDark
                  ? 'bg-gray-800/60 border border-gray-700/50'
                  : 'bg-white border border-gray-200 shadow-sm'
                }`}>
                {gameData?.validationFields?.map((field, index) => {
                  const isLastField = index === gameData.validationFields.length - 1;
                  const showRegionDropdown = field === 'server' && 
                    gameData?.validationFields?.includes('server') && 
                    gameData?.regionList && 
                    gameData.regionList.length > 0;

                  const fieldLabel = (() => {
                    switch (field) {
                      case 'playerId': return 'Player ID';
                      case 'server': return showRegionDropdown ? 'Region' : 'Server';
                      default: return field;
                    }
                  })();

                  return (
                    <div key={field}>
                      <h3 className={`font-medium mb-1 mt-3 text-sm ${isDark ? 'text-white' : 'text-gray-900'
                        }`}>{fieldLabel}</h3>
                      <div className={isLastField ? "relative" : "flex gap-2"}>
                        {showRegionDropdown ? (
                          <select
                            value={validationFields.server || ''}
                            onChange={(e) => {
                              setValidationFields(prev => ({
                                ...prev,
                                server: e.target.value
                              }));
                              if (validationStatus !== null) {
                                setValidationStatus(null);
                                setValidationMessage('');
                                setValidationResult(null);
                                setUsername('');
                              }
                            }}
                            className={`${isLastField ? 'w-full pr-24' : 'flex-1'} text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${isDark
                                ? 'bg-gray-700/60 text-white border border-gray-600'
                                : 'bg-gray-50 text-gray-900 border border-gray-300'
                              } ${validationStatus === 'valid'
                                ? 'border-green-500 focus:ring-green-500'
                                : validationStatus === 'invalid'
                                  ? 'border-red-500 focus:ring-red-500'
                                : 'focus:ring-[#AA424A]'
                              }`}
                          >
                            <option value="">Select Region</option>
                            {gameData.regionList.map((serverOption) => (
                              <option key={serverOption.code} value={serverOption.code}>
                                {serverOption.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="tel"
                            value={validationFields[field] || ''}
                            onChange={(e) => {
                              setValidationFields(prev => ({
                                ...prev,
                                [field]: e.target.value
                              }));
                              if (validationStatus !== null) {
                                setValidationStatus(null);
                                setValidationMessage('');
                                setValidationResult(null);
                                setUsername('');
                              }
                            }}
                            placeholder={`Your ${fieldLabel}`}
                            className={`${isLastField ? 'w-full pr-24' : 'flex-1'} text-sm rounded-lg px-4 py-2 placeholder-gray-500 placeholder:text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${isDark
                                ? 'bg-gray-700/60 text-white border border-gray-600'
                                : 'bg-gray-50 text-gray-900 border border-gray-300'
                              } ${validationStatus === 'valid'
                                ? 'border-green-500 focus:ring-green-500'
                                : validationStatus === 'invalid'
                                  ? 'border-red-500 focus:ring-red-500'
                                  : 'focus:ring-[#AA424A]'
                              }`}
                          />
                        )}
                        {isLastField && (
                          <button
                            onClick={handleValidation}
                            disabled={isValidating || !Object.values(validationFields).every(value => value?.trim())}
                            className="absolute right-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#AA424A] to-[#7D1724] text-white font-medium px-3 py-1.5 rounded-md text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          >
                            {isValidating ? (
                              <>
                                <FaSpinner className="animate-spin mr-1 text-xs" />
                                Validating
                              </>
                            ) : (
                              'Validate'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Validation Status Message */}
                {validationMessage && (
                  <div className={`mt-3 p-3 rounded-lg text-sm flex items-center ${validationStatus === 'valid'
                      ? (isDark
                        ? 'bg-green-900/20 border border-green-500/20 text-green-400'
                        : 'bg-green-100 border border-green-300 text-green-700')
                      : validationStatus === 'invalid'
                        ? (isDark
                          ? 'bg-red-900/20 border border-red-500/20 text-red-400'
                          : 'bg-red-100 border border-red-300 text-red-700')
                        : (isDark
                          ? 'bg-blue-900/20 border border-blue-500/20 text-blue-400'
                          : 'bg-blue-100 border border-blue-300 text-blue-700')
                    }`}>
                    {validationStatus === 'valid' && <FaCheck className="mr-2 flex-shrink-0" />}
                    {validationStatus === 'invalid' && <span className="mr-2 flex-shrink-0">⚠️</span>}
                    {validationStatus === 'validating' && <FaSpinner className="animate-spin mr-2 flex-shrink-0" />}
                    <div className="flex flex-col">
                      <span>{validationMessage}</span>
                      {username && validationStatus === 'valid' && (
                        <span className={`text-xs mt-1 ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                          Username: {username}
                        </span>
                      )}
                      {
                        validationStatus === 'valid' && validationResult?.server && validationResult.server !== 'null' && validationResult.server !== null && (
                          <div className="flex justify-start items-center mt-1">
                            <span className={`text-xs ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`}>Server:</span>
                            <span className={`text-xs font-mono font-medium ml-1 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`}>
                              {validationResult.server}
                            </span>
                          </div>
                        )
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Success Modal */}
          {orderResult && (
            <div
              className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${showOrderModal ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/0'
                }`}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: 0,
                padding: '1rem'
              }}
              onClick={closeOrderModal}
            >
              <div
                className={`relative w-full max-w-md mx-auto transform transition-all duration-500 ease-out ${showOrderModal ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
                  } ${isDark
                    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900'
                    : 'bg-gradient-to-br from-white via-gray-50 to-emerald-50'
                  } rounded-2xl shadow-2xl border ${isDark ? 'border-emerald-500/20' : 'border-emerald-200'
                  }`}
                onClick={(e) => e.stopPropagation()}
              >

                {/* Close Button */}
                <button
                  onClick={closeOrderModal}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:scale-110 ${isDark
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <FaTimes className="w-5 h-5" />
                </button>

                {/* Success Animation */}
                <div className="text-center pt-8 pb-6">
                  <div className={`relative inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'
                    }`}>
                    <div className={`absolute inset-0 rounded-full animate-ping ${isDark ? 'bg-emerald-400/30' : 'bg-emerald-200'
                      }`}></div>
                    <FaCheckCircle className={`relative w-10 h-10 ${isDark ? 'text-emerald-400' : 'text-emerald-600'
                      }`} />
                  </div>

                  <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                    Order Successful!
                  </h3>

                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                    Your order has been processed successfully
                  </p>
                </div>

                {/* Order Details */}
                <div className={`mx-6 mb-6 p-4 rounded-xl ${isDark
                    ? 'bg-gray-800/50 border border-gray-700'
                    : 'bg-gray-50 border border-gray-200'
                  }`}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Order ID:</span>
                      <span className={`text-sm font-mono font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {orderResult.order._id}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status:</span>
                      <span className={`text-sm font-medium capitalize px-2 py-1 rounded-full ${isDark
                          ? 'text-emerald-300 bg-emerald-900/30'
                          : 'text-emerald-700 bg-emerald-100'
                        }`}>
                        {orderResult.order.status}
                      </span>
                    </div>
                    {validationFields.playerId && (
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Character ID:</span>
                        <span className={`text-sm font-mono font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {validationFields.playerId}
                        </span>
                      </div>
                    )}

                    {validationFields.server && (
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Server ID:</span>
                        <span className={`text-sm font-mono font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {validationFields.server}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Amount:</span>
                      <span className={`text-lg font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'
                        }`}>
                        ₹{orderResult.order.amount}
                      </span>
                    </div>

                    {/* {orderResult.externalApiResponse && (
                      <>
                        <div className={`border-t pt-3 ${
                          isDark ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>External Order ID:</span>
                            <span className={`text-sm font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {orderResult.externalApiResponse.order_id}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total:</span>
                            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              ₹{orderResult.externalApiResponse.total}
                            </span>
                          </div>
                        </div>
                      </>
                    )} */}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <InvoiceGenerator
                      orderData={orderResult}
                      isDark={isDark}
                      onClose={() => { }}
                    />

                    <button
                      onClick={() => {
                        router.push(`/purchasehistory?activeTab=purchase`);
                      }}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105 ${isDark
                          ? 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                      <FaClipboardList className="w-4 h-4" />
                      Order Report
                    </button>
                  </div>

                  <button
                    onClick={closeOrderModal}
                    className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 border ${isDark
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Instant Delivery Badge */}
          <div className="flex items-center justify-center gap-2 mt-6 mb-6">
            <div className={`border px-4 py-2 rounded-full text-sm font-medium flex items-center ${isDark
                ? 'bg-[#1A1A1A] border-[#AA424A] text-[#AA424A]'
                : 'bg-green-50 border-green-300 text-green-700'
              }`}>
              <FaCheck className="mr-2" />
              Instant Delivery Supported
            </div>
          </div>

          {/* Category Filter */}
          {availableCategories.length > 1 && (
            <div className="mb-6">
              <div className={`rounded-xl p-4 ${isDark
                  ? 'bg-gray-800/60 border border-gray-700/50'
                  : 'bg-white border border-gray-200 shadow-sm'
                }`}>
                <h3 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>Filter by Category</h3>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                        selectedCategory === category
                          ? isDark
                            ? 'bg-[#AA424A] text-white shadow-lg shadow-[#AA424A]/25'
                            : 'bg-[#AA424A] text-white shadow-lg shadow-[#AA424A]/25'
                          : isDark
                            ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border border-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </button>
                  ))}
                </div>
                {selectedCategory !== 'all' && (
                  <div className="mt-3 flex items-center text-sm">
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Showing {filteredDiamondPacks.length} pack{filteredDiamondPacks.length !== 1 ? 's' : ''} in "{selectedCategory}"
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dynamic Diamond Packs Grid */}
          {isLoadingPacks ? (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="animate-spin text-[#AA424A] text-2xl mr-3" />
              <span className={isDark ? 'text-white' : 'text-gray-900'}>Loading diamond packs...</span>
            </div>
          ) : error ? (
            <div className={`rounded-xl p-6 text-center ${isDark
                ? 'bg-red-900/20 border border-red-500/20'
                : 'bg-red-100 border border-red-300'
              }`}>
              <p className={`mb-4 ${isDark ? 'text-red-400' : 'text-red-700'}`}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredDiamondPacks.length === 0 ? (
            <div className={`rounded-xl p-6 text-center ${isDark
                ? 'bg-gray-800/50 border border-gray-600/20'
                : 'bg-gray-100 border border-gray-300'
              }`}>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {selectedCategory === 'all' 
                  ? 'No diamond packs available for this game.' 
                  : `No diamond packs found in "${selectedCategory}" category.`
                }
              </p>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isDark
                      ? 'bg-[#AA424A] text-white hover:bg-[#7D1724]'
                      : 'bg-[#AA424A] text-white hover:bg-[#7D1724]'
                  }`}
                >
                  Show All Categories
                </button>
              )}
            </div>
          ) : (
            <div 
              key={selectedCategory}
              className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 animate-fadeIn"
            >
              {filteredDiamondPacks.map((pack) => (
                <div
                  key={pack.id}
                  className={`rounded-xl overflow-hidden transition-all hover:scale-105 border-2 shadow-2xl  ${isDark
                      ? 'bg-[#1A1A1A] border-white/10 hover:border-[#AA424A]/50 hover:shadow-[#AA424A]/10'
                      : 'bg-gray-100 border-gray-200 hover:shadow-xl hover:border-emerald-300'
                    } ${selectedPack?.id === pack.id
                      ? 'border-[#AA424A] ring-2 ring-[#AA424A]/50'
                      : ''
                    }`}
                >
                  <div
                    className="p-4 flex items-center cursor-pointer"
                    onClick={() => handleProductSelect(pack)}
                  >
                    <div className={`w-20 h-20 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg overflow-hidden flex-shrink-0`}>
                      <Image
                        src={pack.logo || gameData?.image || gameImage}
                        alt={pack.description || `${pack.amount} Pack`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h2 className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                          {pack.description || `${pack.amount} Package`}
                        </h2>
                        {pack.category && (
                          <span className={`text-xs px-2 py-1 rounded-full font-medium flex justify-center text-center ${
                            isDark 
                              ? 'bg-[#AA424A]/20 text-[#AA424A] border border-[#AA424A]/30'
                              : 'bg-[#AA424A]/10 text-[#AA424A] border border-[#AA424A]/20'
                          }`}>
                            {pack.category}
                          </span>
                        )}
                      </div>
                      {pack.cashback > 0 && (
                        <p className="text-xs text-green-400">Guranteed Cashback</p>
                      )}
                    </div>
                  </div>

                  {/* Price Display */}
                  <div className="text-white text-xs font-bold px-5 py-2 text-center bg-[#AA424A]">
                    ₹{pack.amount}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Full Width Bottom Popup */}
      {showProductPopup && selectedProductForPopup && (
        <div className="fixed inset-0 z-[100] flex items-end">
          {/* Enhanced Backdrop */}
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-500 ease-out ${popupAnimating ? 'opacity-100' : 'opacity-0'
              }`}
            onClick={handleClosePopup}
          ></div>

          {/* Enhanced Popup Content */}
          <div className={`relative w-full rounded-t-3xl transform transition-all duration-500 ease-out border-t-2 border-[#AA424A] ${isDark ? 'bg-[#1A1A1A]' : 'bg-white'
            } ${popupAnimating
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-0'
            }`}>
            {/* Enhanced Handle Bar */}
            <div className="flex justify-center pt-4 pb-3">
              <div className="w-16 h-1.5 bg-gray-500 rounded-full shadow-lg"></div>
            </div>

            {/* Enhanced Product Info */}
            <div className="px-6 pb-6">
              <div className={`flex items-center mb-6 transition-all duration-500 delay-100 ${popupAnimating ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                }`}>
                <div className={`w-20 h-20 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl overflow-hidden flex-shrink-0 shadow-lg ring-2 ring-[#AA424A]/20`}>
                  <Image
                    src={selectedProductForPopup.logo || gameData?.image || gameImage}
                    alt={selectedProductForPopup.description || `${selectedProductForPopup.amount} Pack`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-5 flex-1">
                  <h3 className={`font-bold text-xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                    {selectedProductForPopup.description || `${selectedProductForPopup.amount} Package`}
                  </h3>
                  <p className="text-3xl font-bold text-[#AA424A] mb-1">₹{selectedProductForPopup.amount}</p>
                  {selectedProductForPopup.cashback > 0 && (
                    <p className="text-sm text-green-400 font-medium">Guranteed Cashback</p>
                  )}
                </div>
              </div>

              {/* Enhanced User Info Display */}
              {validationStatus === 'valid' && (
                <div className={`rounded-xl p-4 mb-6 transition-all duration-500 delay-200 ${isDark
                    ? 'bg-green-900/20 border border-green-500/20'
                    : 'bg-green-100 border border-green-300'
                  } ${popupAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}>
                  <div className="flex items-center text-green-400 text-sm font-medium">
                    <FaCheck className="mr-2 text-green-400" />
                    <span>Validated Account</span>
                  </div>
                  <div className={`text-xs mt-2 font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    {Object.entries(validationFields).map(([field, value], index) => {
                      const hasRegionList = gameData?.regionList && gameData.regionList.length > 0;
                      const fieldLabel = (() => {
                        switch (field) {
                          case 'playerId': return 'Player ID';
                          case 'server': return hasRegionList ? 'Region' : 'Server';
                          default: return field;
                        }
                      })();
                      return (
                        <span key={field}>
                          {fieldLabel}: {value}
                          {index < Object.entries(validationFields).length - 1 && ' | '}
                        </span>
                      );
                    })}
                    {username && <span> | Username: {username}</span>}
                  </div>
                </div>
              )}

              {/* Enhanced Payment Options */}
              <div className="space-y-4">
                {/* Buy with Coin */}
                <button
                  onClick={handleBuyWithCoin}
                  disabled={isProcessingOrder || validationStatus !== 'valid'}
                  className={`w-full py-5 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ease-out transform ${validationStatus === 'valid' && !isProcessingOrder
                      ? 'bg-gradient-to-r from-[#AA424A] to-[#7D1724] text-white hover:from-[#7D1724] hover:to-[#500A10] hover:scale-[1.02] hover:shadow-lg hover:shadow-[#AA424A]/25 active:scale-[0.98]'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    } ${popupAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} delay-300`}
                >
                  {isProcessingOrder ? (
                    <div className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-3 text-lg" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-3 text-xl"><FaCoins /></span>
                      <span>Buy with C Coin</span>
                    </div>
                  )}
                </button>

                {/* Buy with UPI */}
                <button
                  onClick={handleBuyWithUPI}
                  disabled={isProcessingOrder || validationStatus !== 'valid'}
                  className={`w-full py-5 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ease-out transform ${validationStatus === 'valid' && !isProcessingOrder
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    } ${popupAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} delay-400`}
                >
                  {isProcessingOrder ? (
                    <div className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-3 text-lg" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-3 text-xl"><FaCreditCard /></span>
                      <span>Buy with UPI</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Enhanced Validation Warning */}
              {validationStatus !== 'valid' && (
                <div className={`rounded-xl p-4 mb-6 transition-all duration-500 delay-200 ${isDark
                    ? 'bg-red-900/20 border border-red-500/20'
                    : 'bg-red-100 border border-red-300'
                  } ${popupAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}>
                  <div className={`flex items-center text-sm font-medium ${isDark ? 'text-red-400' : 'text-red-700'
                    }`}>
                    <span className="mr-2 text-lg">⚠️</span>
                    <span>Please validate your Character ID and Server ID first</span>
                  </div>
                </div>
              )}

              {/* Enhanced Close Button */}
              <button
                onClick={handleClosePopup}
                className={`w-full mb-24 mt-6 py-4 px-6 rounded-2xl font-medium transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98] ${isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } ${popupAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  } delay-500`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation History Popup - Auto-fill Prompt */}
      {showHistoryPopup && validationHistory.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-3xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'
            } shadow-2xl transform transition-all duration-300 scale-100`}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClipboardList className="text-3xl text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Use Previous Validation?
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                We found your last validation data. Would you like to use it?
              </p>
            </div>

            <div className={`mb-6 p-4 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
              <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Last Validation:
              </p>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {validationHistory[0].playerName && (
                  <p>Player Name: <span className="font-semibold text-blue-600 dark:text-blue-400">{validationHistory[0].playerName}</span></p>
                )}
                <p>Player ID: <span className="font-mono font-semibold">{validationHistory[0].playerId}</span></p>
                {validationHistory[0].server && (
                  <p>Server: <span className="font-mono font-semibold">{validationHistory[0].server}</span></p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleUseLastValidation}
                className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Yes, Use This
              </button>

              <button
                onClick={handleShowHistorySelector}
                className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 ${isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } transform hover:scale-[1.02] active:scale-[0.98]`}
              >
                Choose from History ({validationHistory.length})
              </button>

              <button
                onClick={() => setShowHistoryPopup(false)}
                className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 ${isDark
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  } transform hover:scale-[1.02] active:scale-[0.98]`}
              >
                No, Enter Manually
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation History Selector */}
      {showHistorySelector && validationHistory.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-3xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'
            } shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Select Validation History
              </h3>
              <button
                onClick={() => setShowHistorySelector(false)}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
              >
                <FaTimes className={isDark ? 'text-gray-400' : 'text-gray-600'} />
              </button>
            </div>

            <div className="space-y-3">
              {validationHistory.map((history, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectHistory(index)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${selectedHistoryIndex === index
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : isDark
                        ? 'bg-gray-700/50 hover:bg-gray-700 text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold mb-2">Validation #{index + 1}</p>
                      <div className={`text-sm space-y-1 ${selectedHistoryIndex === index ? 'text-blue-100' : isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        {history.playerName && (
                          <p>Player Name: <span className={`font-semibold ${selectedHistoryIndex === index ? 'text-blue-100' : 'text-blue-600 dark:text-blue-400'}`}>{history.playerName}</span></p>
                        )}
                        <p>Player ID: <span className="font-mono font-semibold">{history.playerId}</span></p>
                        {history.server && (
                          <p>Server: <span className="font-mono font-semibold">{history.server}</span></p>
                        )}
                        <p className="text-xs mt-2">
                          {new Date(history.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {selectedHistoryIndex === index && (
                      <FaCheckCircle className="text-xl ml-2 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowHistorySelector(false)}
              className={`w-full mt-4 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                } transform hover:scale-[1.02] active:scale-[0.98]`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}