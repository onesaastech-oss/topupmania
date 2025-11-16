'use client';

import { useState, useEffect } from 'react';
import { FaTools, FaClock, FaSync, FaHome, FaEnvelope } from 'react-icons/fa';

export default function MaintenancePage({ message, onRetry, isLoading }) {
    const [isDark, setIsDark] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Check for dark mode preference
        const darkMode = localStorage.getItem('darkMode') === 'true';
        setIsDark(darkMode);

        // Update time every second
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${isDark
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900'
                : 'bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100'
            }`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'radial-gradient(circle at 25px 25px, #f97316 1px, transparent 0)',
                backgroundSize: '50px 50px',
            }}></div>

            <div className={`text-center max-w-2xl mx-auto p-8 rounded-3xl shadow-2xl backdrop-blur-sm ${isDark
                    ? 'bg-gray-800/90 border border-orange-800/30'
                    : 'bg-white/90 border border-orange-200/50'
                }`}>
                {/* Professional Icon */}
                <div className="relative mb-6">
                    <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${isDark ? 'bg-orange-900/30' : 'bg-orange-100'
                        }`}>
                        <FaTools className="w-12 h-12 text-orange-500" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-orange-500/10 animate-pulse"></div>
                </div>

                <h1 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                    Under Maintenance
                </h1>

                <p className={`text-base mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    {message || 'We are currently performing scheduled maintenance to improve your experience.'}
                </p>

                {/* Current Time Display */}
                <div className={`p-6 rounded-xl mb-8 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}>
                    <div className="flex items-center justify-center mb-4">
                        <FaClock className="text-orange-500 mr-3" />
                        <span className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                            Current Time
                        </span>
                    </div>
                    <div className={`text-2xl font-mono font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'
                        }`}>
                        {formatTime(currentTime)}
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        {formatDate(currentTime)}
                    </div>
                </div>

                {/* Status Information */}
                <div className={`p-6 rounded-xl mb-8 ${isDark ? 'bg-gray-700/30' : 'bg-orange-50'
                    }`}>
                    <h3 className={`text-base font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                        What's new that may be happening?
                    </h3>
                    <ul className={`text-left space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                        <li className="flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                            Security Updates
                        </li>
                        <li className="flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                            System Updates and Improvements
                        </li>

                        <li className="flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                            Database Optimizations
                        </li>
                        <li className="flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                            Performance improvements
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={onRetry}
                        disabled={isLoading}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl flex items-center justify-center transition-all duration-200 text-base font-semibold"
                    >
                        <FaSync className={`mr-3 ${isLoading ? 'animate-spin' : ''}`} />
                        {isLoading ? 'Checking Status...' : 'Check Again'}
                    </button>

                    <div className="flex space-x-4">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-all duration-200"
                        >
                            <FaHome className="mr-2" />
                            Home
                        </button>

                        <button
                            onClick={() => window.open('https://t.me/Topupmaniacs?text=Site%20under%20maintenance', '_blank')}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-all duration-200"
                        >
                            <FaEnvelope className="mr-2" />
                            Contact
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className={`mt-8 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        We apologize for any inconvenience. Thank you for your patience.
                    </p>
                    <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                        Estimated completion time will be updated as soon as possible.
                    </p>
                </div>
            </div>
        </div>
    );
}
