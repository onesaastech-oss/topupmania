"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaBolt, FaFileContract, FaLink, FaComment, FaExclamationTriangle, FaHeadset } from 'react-icons/fa';
import { BsFileEarmarkText } from 'react-icons/bs';
import Footer from "@/components/Footer";
import { getTheme, setTheme, subscribeToThemeChanges } from '@/lib/utils/theme';

export default function TermsAndConditions() {
  const router = useRouter();
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTheme(getTheme());
    
    const unsubscribe = subscribeToThemeChanges((theme) => {
      setCurrentTheme(theme);
    });

    return unsubscribe;
  }, []);

  const handleBack = () => {
    router.back();
  };

  // Theme-based classes
  const isDark = currentTheme === 'dark';
  
  const themeClasses = {
    background: isDark 
      ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
      : 'bg-gradient-to-br from-gray-50 to-white',
    text: isDark ? 'text-gray-100' : 'text-gray-900',
    bannerBg: isDark 
      ? 'bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900' 
      : 'bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600',
    cardBg: isDark 
      ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
      : 'bg-gradient-to-br from-white to-gray-50',
    cardBorder: isDark ? 'border-gray-700' : 'border-gray-200',
    sectionBg: isDark 
      ? 'bg-gray-900/80 backdrop-blur-sm' 
      : 'bg-gray-50/80 backdrop-blur-sm',
    sectionBorder: isDark ? 'border-gray-700/50' : 'border-gray-200/50',
    iconColor: isDark ? 'text-green-400' : 'text-green-600',
    linkColor: isDark ? 'text-green-400' : 'text-green-600',
    borderColor: isDark ? 'border-gray-700' : 'border-gray-200',
    buttonBg: isDark 
      ? 'bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900 hover:from-purple-600 hover:to-blue-600' 
      : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-500'
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text} flex flex-col relative overflow-hidden transition-colors duration-300`}>
      {/* Glow Effect */}
      <div className="absolute -right-1/4 -top-1/4 w-full h-full bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full filter blur-3xl opacity-70 -z-10"></div>
      
      
      {/* Header Section */}
      <div className={`relative w-full rounded-3xl pt-40 pb-20 ${themeClasses.bannerBg}`}>
        {/* Dynamic Grid Pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'linear-gradient(rgba(170, 66, 74, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(170, 66, 74, 0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 70%)',
        }}></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <BsFileEarmarkText className="text-2xl text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Terms & Conditions</h1>
        </div>
      </div>
      
      <main className="relative z-10 -mt-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 flex-1">
        {/* Main Content */}
        <div className={`${themeClasses.cardBg} backdrop-blur-sm border ${themeClasses.cardBorder} shadow-2xl rounded-2xl p-8 md:p-10 transition-colors duration-300`}>

          <div className="prose prose-invert max-w-none">
            <section className={`mb-10 ${themeClasses.sectionBg} rounded-xl p-6 border ${themeClasses.sectionBorder} transition-colors duration-300`}>
              <h2 className={`text-xl font-bold ${themeClasses.text} mb-4 flex items-center`}>
                <FaBolt className={`mr-3 ${themeClasses.iconColor}`} />
                Welcome to Credimi!
              </h2>
                  <div className={`space-y-3 ${themeClasses.textSecondary}`}>
                    <p>
                      These terms and conditions outline the rules and regulations for the use of Credimi's Website, located at{' '}
                      <a href="https://credimi.in/" className={`${themeClasses.linkColor} hover:underline font-medium`}>https://credimi.in/</a>.
                    </p>
                    <p className={`${themeClasses.textMuted} italic`}>
                      By accessing this website we assume you accept these terms and conditions. Do not continue to use Credimi if you do not agree to take all of the terms and conditions stated on this page.
                    </p>
                  </div>
            </section>    
              
            

            <section className="mb-10">
              <h2 className={`text-2xl font-bold ${themeClasses.text} mb-4 flex items-center`}>
                <FaFileContract className={`mr-2 ${themeClasses.iconColor}`} />
                License & Intellectual Property
              </h2>
              <p className={`mb-4 ${themeClasses.textSecondary}`}>
                Unless otherwise stated, Credimi and/or its licensors own the intellectual property rights for all material on Credimi. All intellectual property rights are reserved. You may access this from Credimi for your own personal use subjected to restrictions set in these terms and conditions.
              </p>
              
              <h3 className={`text-xl font-bold ${themeClasses.text} mt-6 mb-3 flex items-center`}>
                <FaExclamationTriangle className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                You must not:
              </h3>
              <ul className={`list-disc pl-6 space-y-2 mb-4 ${themeClasses.textSecondary}`}>
                <li>Republish material from Credimi</li>
                <li>Sell, rent or sub-license material from Credimi</li>
                <li>Reproduce, duplicate or copy material from Credimi</li>
                <li>Redistribute content from Credimi</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className={`text-2xl font-bold ${themeClasses.text} mb-4 flex items-center`}>
                <FaComment className={`mr-2 ${themeClasses.iconColor}`} />
                User Comments
              </h2>
              <p className={`mb-4 ${themeClasses.textSecondary}`}>
                Parts of this website may offer users an opportunity to post and exchange opinions and information. Credimi does not filter, edit, publish or review comments prior to their presence on the website.
              </p>
              <p className={`mb-4 ${themeClasses.textSecondary}`}>
                Comments do not reflect the views and opinions of Credimi, its agents, and/or affiliates. Comments reflect the views and opinions of the person who posts them.
              </p>
            </section>

            <section className="mb-10">
              <h2 className={`text-2xl font-bold ${themeClasses.text} mb-4 flex items-center`}>
                <FaLink className={`mr-2 ${themeClasses.iconColor}`} />
                Hyperlinking to our Content
              </h2>
              <p className={`mb-4 ${themeClasses.textSecondary}`}>
                The following organizations may link to our Website without prior written approval:
              </p>
              <ul className={`list-disc pl-6 space-y-2 mb-4 ${themeClasses.textSecondary}`}>
                <li>Government agencies</li>
                <li>Search engines</li>
                <li>News organizations</li>
                <li>Online directory distributors</li>
              </ul>
              <p className={themeClasses.textSecondary}>
                These organizations may link to our home page so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval; and (c) fits within the context of the linking party's site.
              </p>
            </section>

            <section className="mb-10">
              <h2 className={`text-2xl font-bold ${themeClasses.text} mb-4 flex items-center`}>
                <FaExclamationTriangle className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                Content Liability & Disclaimer
              </h2>
              <p className={`mb-4 ${themeClasses.textSecondary}`}>
                We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims that arise on your Website.
              </p>
              <p className={themeClasses.textSecondary}>
                To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website.
              </p>
            </section>

            <div className={`mt-12 pt-8 border-t ${themeClasses.borderColor} transition-colors duration-300`}>
              <h2 className={`text-2xl font-bold ${themeClasses.text} mb-6`}>Need Help?</h2>
              <p className={`mb-6 ${themeClasses.textSecondary}`}>
                If you have any questions about these Terms and Conditions, please contact us.
              </p>
              <button
                onClick={() => router.push('/support')}
                className={`inline-flex items-center px-6 py-3 ${themeClasses.buttonBg} text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/30 cursor-pointer`}
              >
                <FaHeadset className="mr-2" />
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}