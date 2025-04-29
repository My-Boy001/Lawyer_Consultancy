import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import Button from '../components/Button';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for error in URL
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error === 'login_failed') {
      // Handle login error (show error message to user)
      console.error('Login failed');
    }

    // Check if we have a token in cookies
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/check', {
          withCredentials: true
        });
        if (response.data.authenticated) {
          // Redirect to the page they were trying to access or home
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, [navigate, location]);

  const handleGoogleAuth = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to LawConnect</h1>
            <p className="text-gray-600">Sign in to continue</p>
          </div>

          <div className="space-y-6">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={handleGoogleAuth}
              className="flex items-center justify-center space-x-2"
            >
              <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
                className="w-5 h-5"
              />
              <span>Continue with Google</span>
            </Button>
          </div>
        </div>

        <p className="text-center mt-6 text-gray-600 text-sm">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;