"use client";

import Footer from "@/components/Footer";
import { FaCamera } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile, uploadProfileImage } from "@/lib/api";

// Simulate fetching phone number from login/session
const getLoggedInPhoneNumber = () => {
  // Replace this with your actual session/user context logic
  return "+91 9707514942";
};

export default function MyAccountPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");;
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const phoneNumber = getLoggedInPhoneNumber();

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching user profile...');
        const userData = await getUserProfile();
        
        console.log('Raw API Response:', userData);
        console.log('Response success:', userData?.success);
        console.log('Response data:', userData?.data);
        console.log('Response user:', userData?.user);
        
        // Extract user data from API response
        let user = null;
        if (userData?.success && userData?.data) {
          user = userData.data;
        } else if (userData && !userData.success) {
          // Direct user object
          user = userData;
        }
        
        console.log('Extracted user object:', user);
        
        if (user) {
          console.log('Setting form values:', {
            name: user.name || "",
            email: user.email || "",
            mobile: user.phone || "",
            profilePicture: user.profilePicture || ""
          });
          
          setName(user.name || "");
          setEmail(user.email || "");
          setMobile(user.phone || "");
          
          // Set profile image if available
          if (user.profilePicture) {
            setPreviewImage(user.profilePicture);
          }
        } else {
          console.log('No user data found in response');
          setError('Failed to load user profile data.');
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        console.log('API call failed, using fallback test data...');
        
        // Fallback test data when API fails
        setName("John Doe");
        setEmail("john.doe@example.com");
        setMobile("9707514942");
        
        setError('API call failed - using test data. Please check console for details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
      
      try {
        // Upload image to server
        const response = await uploadProfileImage(file);
        if (response.success) {
          console.log('Profile image uploaded successfully');
        }
      } catch (error) {
        console.error('Failed to upload profile image:', error);
        // Still show preview but log the error
      }
    }
  };

  const handleCameraClick = () => {
    // Trigger the hidden file input
    document.getElementById('profile-image-upload').click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsUpdating(true);
      setError(null);
      
      const updateData = {
        name,
      };
      
      const response = await updateUserProfile(updateData);
      
      if (response.success) {
        setSuccessMessage(response.data?.message || 'Profile updated successfully!');
        setShowSuccess(true);
        // Hide the success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          setSuccessMessage("");
        }, 3000);
      } else {
        throw new Error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white text-slate-800 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100 flex flex-col relative overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-gray-300">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white text-slate-800 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100 flex flex-col relative overflow-hidden">
      
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-500/20 dark:border-red-500/50 dark:text-red-200 px-4 py-3 mx-4 mt-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {/* Header Section */}
      <div className="relative w-full rounded-3xl pt-16 pb-8 md:pt-24 md:pb-16 lg:pt-32 lg:pb-20 bg-gradient-to-r from-emerald-100 via-green-50 to-teal-100 dark:from-emerald-900 dark:via-green-800 dark:to-teal-900">
          {/* Dynamic Grid Pattern */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'linear-gradient(rgba(170, 66, 74, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(170, 66, 74, 0.2) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 70%)',
          }}></div>
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(170, 66, 74, 0.35) 0%, transparent 30%),
              radial-gradient(circle at 80% 70%, rgba(100, 13, 20, 0.4) 0%, transparent 30%),
              linear-gradient(135deg, rgba(170, 66, 74, 0.2) 0%, transparent 50%)
            `,
            animation: 'pulse 12s ease-in-out infinite alternate',
          }}></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 bg-emerald-400/10 rounded-full mix-blend-overlay"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 -ml-48 -mb-48 bg-teal-400/10 rounded-full mix-blend-overlay"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
            <div className="flex flex-col items-center">
              {/* Profile Image */}
              <div className="relative group mb-4 md:mb-6">
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl bg-emerald-500/90 flex items-center justify-center text-4xl md:text-5xl font-bold text-white shadow-2xl border-4 border-white/90 overflow-hidden group-hover:scale-105 transition-all duration-500">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl md:text-5xl">
                      {name ? name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  )}
                </div>
                <input 
                  type="file" 
                  id="profile-image-upload"
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <div 
                  onClick={handleCameraClick}
                  className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-emerald-100 transition-all duration-300 border-2 border-emerald-500"
                  title="Change profile picture"
                >
                  <FaCamera className="text-emerald-700 text-lg" />
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="text-center">
                <div className="inline-block px-4 py-1.5 mb-3 text-xs font-medium tracking-wide text-emerald-800 bg-emerald-100 rounded-full backdrop-blur-sm border border-emerald-200 uppercase dark:text-emerald-100 dark:bg-emerald-800/60 dark:border-emerald-700/50">
                  Profile Settings
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  {name || 'Welcome Back'}
                </h1>
                <p className="text-emerald-700 text-sm md:text-base mb-4 px-4 dark:text-emerald-100/90">
                  {email || 'Update your profile information and manage your account settings'}
                </p>
                <div className="flex items-center justify-center text-xs md:text-sm text-emerald-700/80 dark:text-emerald-100/80">
                  <span className="flex items-center">
                    <svg className="w-3 h-3 md:w-4 md:h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span suppressHydrationWarning>
                      Last updated: {typeof window !== 'undefined' ? new Date().toLocaleDateString() : ''}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 -mt-16 md:-mt-24 mb-8 md:mb-16">
        {/* Main Form Card */}
        <form onSubmit={handleSubmit} className="w-full bg-white/90 dark:bg-gradient-to-br dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm border border-slate-200 dark:border-emerald-500/20 shadow-xl rounded-2xl px-6 sm:px-8 md:px-12 py-6 sm:py-8 md:py-10 flex flex-col gap-4 sm:gap-5 md:gap-6 hover:shadow-emerald-900/20 hover:border-slate-300 dark:hover:border-emerald-500/30 transition-all duration-300">
          <div>
            <label className="block text-slate-700 dark:text-gray-300 font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400/50 transition-all duration-200 dark:bg-gray-700/30 dark:border-gray-600/50 dark:text-white dark:placeholder-gray-400"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-gray-300 font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-lg px-4 py-3 cursor-not-allowed"
              placeholder="Email address"
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-gray-300 font-medium mb-1">Mobile Number</label>
            <input
              type="text"
              value={mobile}
              readOnly
              className="w-full bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-lg px-4 py-3 cursor-not-allowed"
              placeholder="Mobile number"
            />
          </div>
          <button 
            type="submit" 
            disabled={isUpdating}
            className="mt-6 w-full py-4 rounded-xl text-white font-semibold text-lg shadow-md transition-all duration-300 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-0.5 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isUpdating ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Updating...</span>
              </div>
            ) : (
              'Update Profile'
            )}
          </button>
          
          {showSuccess && (
            <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in border border-emerald-400/30 backdrop-blur-sm dark:bg-gradient-to-r dark:from-emerald-500 dark:to-teal-500">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}
          
          <style jsx global>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes pulse {
              0% { 
                opacity: 0.2;
                transform: scale(1);
              }
              50% { 
                opacity: 0.4;
                transform: scale(1.02);
              }
              100% { 
                opacity: 0.2;
                transform: scale(1);
              }
            }
            .animate-fade-in {
              animation: fadeIn 0.3s ease-out forwards;
            }
          `}</style>
        </form>
      </main>
      <Footer />
    </div>
  );
}
