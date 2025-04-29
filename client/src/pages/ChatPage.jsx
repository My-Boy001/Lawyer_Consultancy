import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Fetch current logged-in user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:3000/find-user", {
          withCredentials: true,
        });
        setCurrentUser(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch current user", error);
        setIsLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/users", {
          withCredentials: true,
        });
        
        if (currentUser) {
          // Filter users based on roles and remove current user
          const filteredUsers = res.data.filter(user => {
            // Don't include the current user
            if (user._id === currentUser._id) return false;
            
            // If current user is a client, only show lawyers
            if (currentUser.role === "client") {
              return user.role === "lawyer";
            }
            
            // If current user is a lawyer, only show clients
            if (currentUser.role === "lawyer") {
              return user.role === "client";
            }
            
            return true; // For other roles or if no role is specified
          });
          
          setUsers(filteredUsers);
        } else {
          setUsers(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]); // Re-fetch when currentUser changes

  // Fetch messages when a user is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser && currentUser) {
        try {
          setIsLoading(true);
          const res = await axios.get(
            `http://localhost:3000/chat/${selectedUser._id}?senderId=${currentUser._id}`
          );
          setMessages(res.data);
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to fetch messages", error);
          setIsLoading(false);
        }
      }
    };
    fetchMessages();
  }, [selectedUser, currentUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    // scrollToBottom();
  }, [messages]);




  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      await axios.post(`http://localhost:3000/chat/send/${selectedUser._id}`, {
        message: newMessage,
        senderId: currentUser._id,
      });
      
      // Optimistically update UI
      setMessages([
        ...messages,
        { senderId: currentUser._id, message: newMessage, timestamp: new Date() }
      ]);
      setNewMessage("");
      
      // Reload messages after sending
      const res = await axios.get(
        `http://localhost:3000/chat/${selectedUser._id}?senderId=${currentUser._id}`
      );
      setMessages(res.data);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const messageDate = new Date(date);
    
    if (now.toDateString() === messageDate.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return messageDate.toLocaleDateString();
  };

  // Get role text for display
  const getRoleText = (role) => {
    if (role === "lawyer") return "Lawyer";
    if (role === "client") return "Client";
    return role || "";
  };

  // Get role color for badges
  const getRoleColor = (role) => {
    if (role === "lawyer") return "bg-indigo-100 text-indigo-800";
    if (role === "client") return "bg-emerald-100 text-emerald-800";
    return "bg-gray-100 text-gray-800";
  };

  // Get avatar color for user
  const getAvatarColor = (userId) => {
    const colors = [
      "bg-violet-500", "bg-pink-500", "bg-blue-500", 
      "bg-emerald-500", "bg-amber-500", "bg-rose-500",
      "bg-indigo-500", "bg-teal-500", "bg-orange-500"
    ];
    
    // Simple hash function to get a consistent color for each user
    const hash = userId?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return colors[hash % colors.length] || "bg-gray-500";
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Loading screen
  if (isLoading && !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans mt-20" style={{marginTop: '80px'}}> 
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button 
          onClick={toggleSidebar}
          className="p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {sidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-full lg:w-80 2xl:w-96 bg-white border-r border-gray-200 flex flex-col z-40 lg:z-auto fixed lg:static inset-y-0 left-0`}>
        <div className="p-4 border-b border-gray-200 bg-indigo-50">
          <h2 className="text-xl font-bold text-indigo-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            Messages
          </h2>
          <div className="mt-3 relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
            <svg
              className="w-5 h-5 absolute right-3 top-2.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
        
        {/* User list */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <p className="font-medium">No users found</p>
              <p className="text-sm mt-1">Try another search term</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => {
                  setSelectedUser(user);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`p-4 flex items-center cursor-pointer hover:bg-gray-50 transition border-l-4 ${
                  selectedUser?._id === user._id ? "border-indigo-500 bg-indigo-50" : "border-transparent"
                }`}
              >
                <div className={`w-12 h-12 rounded-full ${getAvatarColor(user._id)} flex items-center justify-center text-lg font-semibold text-white shadow-sm`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-gray-900 truncate">{user.name}</p>
                    <span className="text-xs text-gray-500">12:45 PM</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs px-2 py-0.5 ${getRoleColor(user.role)} rounded-full mr-2`}>
                      {getRoleText(user.role)}
                    </span>
                    <p className="text-sm text-gray-500 truncate">
                      {user.status || "Click to start chatting"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Current user profile */}
        {currentUser && (
          <div className="p-4 border-t border-gray-200 bg-white shadow-inner mt-" style={{marginTop: '50vh'}}> 
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full ${getAvatarColor(currentUser._id)} flex items-center justify-center text-white font-semibold shadow-sm`}>
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{currentUser.name}</p>
                <div className="flex items-center mt-1">
                  <span className={`text-xs px-2 py-0.5 ${getRoleColor(currentUser.role)} rounded-full mr-2`}>
                    {getRoleText(currentUser.role)}
                  </span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col" style={{height: '90vh'}}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full ${getAvatarColor(selectedUser._id)} flex items-center justify-center text-white font-semibold shadow-sm`}>
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{selectedUser.name}</p>
                  <div className="flex items-center">
                    <span className={`text-xs px-2 py-0.5 ${getRoleColor(selectedUser.role)} rounded-full mr-2`}>
                      {getRoleText(selectedUser.role)}
                    </span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      <p className="text-xs text-gray-500">Active now</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" title="Voice call">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" title="Video call">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" title="More options">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 p-6 overflow-y-auto bg-slate-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmOGZhZmMiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBmaWxsPSIjZjFmNWY5IiBkPSJNMzAgMzBoMzB2MzBIMzB6Ii8+PHBhdGggZmlsbD0iI2YxZjVmOSIgZD0iTTAgMzBoMzB2MzBIMHoiLz48L2c+PC9zdmc+')] bg-center"
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <div className="bg-white rounded-full p-4 shadow-lg mb-4">
                    <svg
                      className="w-16 h-16 text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-gray-700">No messages yet</h3>
                  <p className="text-center max-w-md px-4 text-gray-500">
                    Start a conversation with {selectedUser.name} by sending a message below.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Date separator */}
                  <div className="flex justify-center mb-6">
                    <div className="px-4 py-1 bg-white rounded-full text-xs text-gray-500 shadow-sm">
                      Today
                    </div>
                  </div>
                  
                  {messages.map((msg, idx) => {
                    const isSender = msg.senderId === currentUser._id;
                    // Group consecutive messages
                    const prevMsg = idx > 0 ? messages[idx - 1] : null;
                    const nextMsg = idx < messages.length - 1 ? messages[idx + 1] : null;
                    const isGroupStart = !prevMsg || prevMsg.senderId !== msg.senderId;
                    const isGroupEnd = !nextMsg || nextMsg.senderId !== msg.senderId;
                    
                    return (
                      <div
                        key={idx}
                        className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                      >
                        {/* Avatar for receiver messages */}
                        {!isSender && isGroupStart && (
                          <div className={`w-8 h-8 rounded-full ${getAvatarColor(msg.senderId)} flex-shrink-0 flex items-center justify-center text-white text-sm mr-2`}>
                            {selectedUser.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {!isSender && !isGroupStart && <div className="w-8 mr-2"></div>}
                        
                        <div
                          className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 ${
                            isGroupStart ? 'mt-2' : 'mt-1'
                          } ${
                            isSender
                              ? `bg-indigo-600 text-white ${isGroupStart ? 'rounded-t-lg' : ''} ${isGroupEnd ? 'rounded-b-lg' : ''} rounded-l-lg`
                              : `bg-white text-gray-800 ${isGroupStart ? 'rounded-t-lg' : ''} ${isGroupEnd ? 'rounded-b-lg' : ''} rounded-r-lg shadow-sm`
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                          {isGroupEnd && (
                            <p
                              className={`text-xs mt-1 ${
                                isSender ? "text-indigo-200" : "text-gray-500"
                              }`}
                            >
                              {formatTime(msg.timestamp)}
                              {isSender && (
                                <span className="ml-1">
                                  ✓
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white border-t border-gray-200 flex items-center"
            >
              <button
                type="button"
                className="p-2 rounded-full text-gray-500 hover:text-indigo-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                title="Attach file"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <div className="relative flex-1 mx-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white border border-gray-200 transition-all"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 p-1 rounded-full text-gray-500 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  title="Emoji"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              <button
                type="submit"
                className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h14M12 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-indigo-900">Welcome to Chat</h3>
                <p className="text-gray-600 mb-6">
                  {currentUser?.role === "client" 
                    ? "Select a lawyer from the sidebar to start getting legal advice." 
                    : currentUser?.role === "lawyer"
                    ? "Select a client from the sidebar to provide legal assistance."
                    : "Select a user from the sidebar to start a conversation."}
                </p>
                <div className="flex justify-center">
                  <button 
                    onClick={() => setSidebarOpen(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    Browse Conversations
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default ChatPage;