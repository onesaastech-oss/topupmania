"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import { sendOtp, verifyOtp, completeRegistration } from '@/lib/api/auth';
import { validatePhone, validateOtp, validateEmail, validateName, validatePassword, sanitizePhone } from '@/lib/utils/auth';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [step, setStep] = useState('mobile'); // 'mobile', 'otp', or 'register'
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);
  const [registrationData, setRegistrationData] = useState({ name: '', email: '', password: '' });
  const [pendingPhone, setPendingPhone] = useState('');

  const otpRefs = useRef([]);
  const router = useRouter();
  const { login } = useAuth();
  const [redirectUrl, setRedirectUrl] = useState('/');

  // Determine redirect URL from query string on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      if (redirect) setRedirectUrl(redirect);
    }
  }, []);

  // Timer effect for OTP resend
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Auto-submit when all OTP fields are filled
  useEffect(() => {
    if (otp.every(digit => digit !== '') && step === 'otp') {
      handleOtpSubmit();
    }
  }, [otp, step]);

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate phone number
    const phoneValidation = validatePhone(mobileNumber);
    if (!phoneValidation.isValid) {
      setError(phoneValidation.error);
      return;
    }

    setIsLoading(true);

    try {
      const result = await sendOtp(mobileNumber);

      if (result.success) {
        setStep('otp');
        setTimer(60); // 60 seconds timer
      } else {
        setError(result.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setError('');
    setIsLoading(true);

    const otpValue = otp.join('');

    // Validate OTP
    const otpValidation = validateOtp(otpValue);
    if (!otpValidation.isValid) {
      setError(otpValidation.error);
      setIsLoading(false);
      return;
    }

    try {
      const result = await verifyOtp(mobileNumber, otpValue);

      if (result.success) {
        if (result.requiresRegistration) {
          // User needs to complete registration
          setPendingPhone(result.phone || mobileNumber);
          setStep('register');
          // You can show the message from the API if needed
          if (result.message) {
            console.log('Registration required:', result.message);
          }
        } else if (result.isNewUser) {
          // Legacy support: User needs to complete registration
          setPendingPhone(mobileNumber);
          setStep('register');
        } else {
          // User already exists, login successful
          await login(result.data.user, result.data.token);
          router.push(redirectUrl);
        }
      } else {
        setError(result.error || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    const nameValidation = validateName(registrationData.name);
    if (!nameValidation.isValid) {
      setError(nameValidation.error);
      return;
    }

    const emailValidation = validateEmail(registrationData.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error);
      return;
    }

    const passwordValidation = validatePassword(registrationData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error);
      return;
    }

    setIsLoading(true);

    try {
      const result = await completeRegistration({
        ...registrationData,
        phone: pendingPhone || mobileNumber,
      });

      if (result.success) {
        await login(result.data.user, result.data.token);
        router.push(redirectUrl);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setIsLoading(true);

    try {
      const result = await sendOtp(mobileNumber);

      if (result.success) {
        setTimer(60);
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
      } else {
        setError(result.error || 'Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMobile = () => {
    setStep('mobile');
    setOtp(['', '', '', '', '', '']);
    setError('');
    setTimer(0);
  };

  const handleGoBack = () => {
    if (step === 'otp') {
      handleEditMobile();
    } else if (step === 'register') {
      setStep('otp');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen mt-16 text-gray-900 overflow-x-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 bg-emerald-400/20 rounded-full mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 -ml-48 -mb-48 bg-teal-400/20 rounded-full mix-blend-multiply"></div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(rgba(170, 66, 74, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(170, 66, 74, 0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 70%)',
          }}
        ></div>
      </div>

      <div className="relative z-10 flex justify-center py-6 px-2 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          {/* <button
            onClick={handleGoBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {step === 'mobile' ? 'Back to Home' : 'Back'}
          </button> */}

          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {step === 'mobile' && 'Welcome Back'}
            {step === 'otp' && 'Verify Your Number'}
            {step === 'register' && 'Complete Registration'}
          </h2>

          <p className="text-gray-600 text-sm">
            {step === 'mobile' && 'Enter your mobile number to continue'}
            {step === 'otp' && `We sent a code to +91 ${mobileNumber}`}
            {step === 'register' && 'Please provide your details to complete registration'}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-2xl rounded-2xl p-4">
          {/* Mobile Number Step */}
          {step === 'mobile' && (
            <form className="space-y-6" onSubmit={handleMobileSubmit}>
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                    +91
                  </span>
                  <input
                    id="mobile"
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(sanitizePhone(e.target.value))}
                    onKeyDown={(e) => e.key === 'Enter' && handleMobileSubmit(e)}
                    placeholder="Enter 10-digit number"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 bg-red-50 p-3 rounded-lg border border-red-200 text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || mobileNumber.length < 10}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <div className="space-y-6">
              {/* Mobile Number Display */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 text-sm">+91</span>
                  <span className="text-gray-900 font-medium">{mobileNumber}</span>
                </div>
                <button
                  onClick={handleEditMobile}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                >
                  Edit
                </button>
              </div>

              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Enter 6-digit verification code
                </label>
                <div className="flex justify-between gap-1 sm:gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => otpRefs.current[index] = el}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="flex-1 min-w-0 h-12 text-center text-lg font-semibold bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      maxLength={1}
                    />
                  ))}
                </div>

              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Resend OTP */}
              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-gray-500 text-sm">
                    Resend code in {timer} seconds
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Resending...' : 'Resend OTP'}
                  </button>
                )}
              </div>

              {/* Loading indicator when verifying OTP */}
              {isLoading && otp.every(digit => digit !== '') && (
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 text-emerald-600">
                    <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Verifying code...</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Registration Step */}
          {step === 'register' && (
            <div className="space-y-6">
              {/* Success message for OTP verification */}
              <div className="flex items-center space-x-2 text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Phone number verified successfully! Please complete your registration.</span>
              </div>

              <form className="space-y-6" onSubmit={handleRegistrationSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={registrationData.name}
                    onChange={e => setRegistrationData({ ...registrationData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={registrationData.email}
                    onChange={e => setRegistrationData({ ...registrationData, email: e.target.value })}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={registrationData.password}
                    onChange={e => setRegistrationData({ ...registrationData, password: e.target.value })}
                    placeholder="Enter your password (min 6 characters)"
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            By continuing, you agree to our{' '}
            <a href="/termsandcondition" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/Privacypolicy" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
} 
