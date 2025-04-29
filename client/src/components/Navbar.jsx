import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Scale, Menu, X, ChevronRight, User, Bell, ChevronDown, LogOut, Settings, MessageSquare } from 'lucide-react';
import Button from './Button';
import axios from 'axios';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:3000/find-user', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        setUser(response.data);
        // Mock notifications data - in production, fetch this from your API
        if (response.data) {
          setNotifications([
            { id: 1, message: "New consultation request", time: "10 min ago", read: false },
            { id: 2, message: "Document ready for review", time: "1 hour ago", read: false },
            { id: 3, message: "Meeting scheduled for tomorrow", time: "2 hours ago", read: true }
          ]);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
    setNotificationOpen(false);
  }, [location]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.profile-dropdown')) {
        setDropdownOpen(false);
      }
      if (notificationOpen && !event.target.closest('.notification-dropdown')) {
        setNotificationOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen, notificationOpen]);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/legal-book', label: 'Legal Resources' },
    { path: '/schedule-meet', label: 'Schedule Consultation' },
    { path: '/chat', label: 'Messages' },
    { path: '/contact', label: 'Contact' },
  ];

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/logout', {}, {
        withCredentials: true
      });
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const renderUserMenuItems = () => (
    <>
      <div onClick={() => navigate('/profile')} 
           className="flex items-center px-4 py-3 hover:bg-blue-800 text-white rounded-lg cursor-pointer transition-colors">
        <User className="h-4 w-4 mr-2 text-blue-300" />
        <span>Profile</span>
      </div>
      
      <div onClick={() => navigate('/chat')} 
           className="flex items-center px-4 py-3 hover:bg-blue-800 text-white rounded-lg cursor-pointer transition-colors">
        <MessageSquare className="h-4 w-4 mr-2 text-blue-300" />
        <span>Messages</span>
      </div>
      
      {user?.role === 'lawyer' && (
        <div onClick={() => navigate('/consultation')} 
             className="flex items-center px-4 py-3 hover:bg-blue-800 text-white rounded-lg cursor-pointer transition-colors">
          <Scale className="h-4 w-4 mr-2 text-blue-300" />
          <span>Consultations</span>
        </div>
      )}
      
      <div className="border-t border-blue-700 my-2"></div>
      
      <div onClick={handleLogout} 
           className="flex items-center px-4 py-3 hover:bg-red-800 text-red-300 hover:text-white rounded-lg cursor-pointer transition-colors">
        <LogOut className="h-4 w-4 mr-2" />
        <span>Logout</span>
      </div>
    </>
  );

  // Define the same background for navbar and dropdowns
  const navBgColor = "bg-blue-900";
  const navBgGradient = "bg-gradient-to-r from-navy-950 via-blue-900 to-navy-950";

  return (
    <nav 
      className={`fixed w-full z-40 transition-all duration-300 ${
        isScrolled 
          ? `py-2 ${navBgColor} shadow-xl backdrop-blur-md bg-opacity-95 border-b border-blue-800` 
          : `py-4 ${navBgGradient}`
      }`}
    >
      {/* Add colored background strip for better text visibility */}
      <div className="absolute inset-0 bg-blue-900 opacity-80"></div>
      
      {/* Add subtle top border accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-lg shadow-md group-hover:shadow-blue-500/30 transition-all duration-300">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors drop-shadow-md">
                LawConnect
              </span>
              {user && (
                <span className="text-xs text-blue-300 -mt-1 font-medium drop-shadow-md">
                  {user.role === 'lawyer' ? 'Attorney Portal' : 'Client Portal'}
                </span>
              )}
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-md shadow-blue-500/20'
                      : 'text-blue-50 hover:bg-blue-800/80 hover:text-white drop-shadow-md'
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="pl-6 flex items-center space-x-3">
              {!isLoading && (user ? (
                <div className="flex items-center space-x-4">                  
                  {/* Profile Section */}
                  <div className="relative profile-dropdown">
                    <div 
                      className="flex items-center space-x-2 cursor-pointer group py-1 px-2 rounded-lg hover:bg-blue-800/80 transition-colors"
                      onClick={handleProfileClick}
                    >
                      {/* Profile Picture */}
                      {user.picture ? (
                        <img 
                          src={user.picture} 
                          alt={user.name} 
                          className="w-8 h-8 rounded-full object-cover border-2 border-blue-500 group-hover:border-blue-400 transition-all duration-300 shadow-md"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      {/* User Name */}
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-white max-w-24 truncate drop-shadow-md">
                          {user.name || "User"}
                        </span>
                        <ChevronDown className={`h-4 w-4 ml-1 text-blue-300 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    
                    {/* User Menu Dropdown - Using the same background as navbar */}
                    {dropdownOpen && (
                      <div className={`absolute right-0 mt-2 w-48 ${navBgColor} border border-blue-700 rounded-lg shadow-lg shadow-blue-900/40 py-2 z-50`}>
                        {renderUserMenuItems()}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-blue-500 text-white hover:bg-blue-700 hover:border-blue-600 transition-all"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              ))}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg transition-colors text-white hover:bg-blue-800/80"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
        
        {/* Mobile Navigation - Using the same background as navbar */}
        {isOpen && (
          <div
            className={`md:hidden overflow-hidden rounded-xl mt-4 shadow-lg shadow-blue-900/30 ${navBgColor} border border-blue-700 transition-all`}
          >
            {user && (
              <div className="px-4 py-3 border-b border-blue-700 flex items-center space-x-3">
                {user.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 shadow-md"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    {user.name || "User"}
                  </span>
                  <span className="text-xs text-blue-300">
                    {user.email || ""}
                  </span>
                </div>
              </div>
            )}
            
            <div className="py-2 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-5 py-3 text-sm font-medium transition-colors rounded-lg mx-2 
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                        : 'text-blue-50 hover:bg-blue-800 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      {item.label}
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </div>
                  </Link>
                );
              })}
              
              {user && (
                <>
                  <Link
                    to={'/profile'}
                    className="block px-5 py-3 text-sm font-medium transition-colors rounded-lg mx-2 text-blue-50 hover:bg-blue-800 hover:text-white"
                  >
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </div>
                  </Link>
                  
                  
                  {user?.role === 'lawyer' && (
                    <Link
                      to="/consultation"
                      className="block px-5 py-3 text-sm font-medium transition-colors rounded-lg mx-2 text-blue-50 hover:bg-blue-800 hover:text-white"
                    >
                      <div className="flex items-center">
                        <Scale className="h-4 w-4 mr-2" />
                        Consultations
                      </div>
                    </Link>
                  )}
                </>
              )}
              
              <div className="px-5 py-3 space-y-3">
                {!isLoading && (user ? (
                  <Button 
                    variant="outline" 
                    fullWidth
                    onClick={handleLogout}
                    className="border-red-500 text-red-300 hover:bg-red-800 hover:text-white transition-all flex items-center justify-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <>
                    <Link to="/login">
                      <Button 
                        variant="outline" 
                        fullWidth
                        className="border-blue-500 text-blue-50 hover:bg-blue-700 hover:text-white transition-all"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button 
                        variant="primary" 
                        fullWidth
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-md transition-all"
                      >
                        <span className="flex items-center justify-center">
                          Get Started
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </span>
                      </Button>
                    </Link>
                  </>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};


export default Navbar;