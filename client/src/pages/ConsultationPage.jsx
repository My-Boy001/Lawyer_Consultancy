import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, Video, ExternalLink, Search, Filter, CheckSquare, MoreHorizontal, AlertCircle, ArrowUpDown, Users } from 'lucide-react';
import Card, { CardBody, CardHeader, CardFooter } from '../components/Card';
import Button from '../components/Button';

const ConsultationPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = "https://law-consultancy-3.onrender.com"
  // Fetch consultations from the backend
  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      // Use the proper endpoint path as defined in your router
      const response = await axios.get(`${apiUrl}/meetInfo`, {
        withCredentials: true, // Important to send cookies for authentication
      });
      
      // Map backend meeting data to frontend consultation format
      const formatted = response.data.map(meeting => {
        // Get client info from the otherAttendee property
        const clientInfo = meeting.otherAttendee || { name: "Unknown", email: "" };
        
        // Map the backend status to frontend status
        let status = "upcoming";
        if (meeting.status === "completed") status = "completed";
        if (meeting.status === "cancelled") status = "cancelled";
        
        return {
          id: meeting.id,
          clientName: clientInfo.name,
          clientEmail: clientInfo.email,
          date: new Date(meeting.startTime).toISOString().split('T')[0],
          time: new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          endTime: new Date(meeting.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: status,
          meetLink: meeting.meetLink,
          details: meeting.title || "",
          description: meeting.description || "",
          createdAt: meeting.createdAt
        };
      });
      
      setConsultations(formatted);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch consultations:", err);
      setError("Failed to load your consultations. Please try again later.");
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  // Filter and sort consultations
  const filteredConsultations = consultations
    .filter(consultation => {
      // Filter by tab
      if (activeTab !== 'all' && consultation.status !== activeTab) return false;
      
      // Filter by search query
      if (searchQuery && !consultation.clientName.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !consultation.details.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      // Filter by status
      if (statusFilter !== 'all' && consultation.status !== statusFilter) return false;
      
      return true;
    })
    .sort((a, b) => {
      // Combine date and time for sorting
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  // Status badge renderer
  const renderStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Upcoming' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
    };
    
    const config = statusConfig[status];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-blue-800 py-20 px-4">
        <div className="container mx-auto text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Lawyer Portal</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Manage your upcoming consultations and access client information.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardBody className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-800 mr-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Upcoming Consultations</p>
                  <p className="text-2xl font-bold">
                    {consultations.filter(c => c.status === 'upcoming').length}
                  </p>
                </div>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-800 mr-4">
                  <CheckSquare className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold">
                    {consultations.filter(c => c.status === 'completed').length}
                  </p>
                </div>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 text-amber-800 mr-4">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Next Consultation</p>
                  <p className="text-lg font-bold">
                    {(() => {
                      const upcoming = consultations
                        .filter(c => c.status === 'upcoming')
                        .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
                      
                      if (upcoming.length > 0) {
                        return `${formatDate(upcoming[0].date)} at ${formatTime(upcoming[0].time)}`;
                      }
                      return 'No upcoming consultations';
                    })()}
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
          
          {/* Main Card with Tabs */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-xl font-bold">Consultations</h2>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'all' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('all')}
                  >
                    All
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'upcoming' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('upcoming')}
                  >
                    Upcoming
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'completed' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('completed')}
                  >
                    Completed
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'cancelled' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('cancelled')}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
            </CardHeader>
            
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                {/* Search */}
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Search by client name or details..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Filter Dropdown */}
                <div className="relative inline-block">
                  <div className="flex items-center">
                    <label className="mr-2 text-sm text-gray-600">Status:</label>
                    <select
                      className="border border-gray-300 rounded-md py-2 pl-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                {/* Sort Button */}
                <button
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  <ArrowUpDown className="h-5 w-5 mr-1 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                  </span>
                </button>
              </div>
            </div>
            
            <CardBody>
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center h-16 w-16 bg-gray-100 rounded-full mb-4">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Loading consultations...</h3>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center h-16 w-16 bg-red-100 rounded-full mb-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading consultations</h3>
                  <p className="text-gray-500">{error}</p>
                  <button 
                    onClick={fetchConsultations}
                    className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredConsultations.length > 0 ? (
                <div className="space-y-6">
                  {filteredConsultations.map((consultation) => (
                    <Card key={consultation.id} className="shadow-sm">
                      <CardBody>
                        <div className="flex flex-col md:flex-row">
                          {/* Left column - Date, Time, Status */}
                          <div className="md:w-1/4 mb-4 md:mb-0">
                            <div className="flex items-start mb-3">
                              <Calendar className="h-5 w-5 text-blue-800 mr-2 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-medium">{formatDate(consultation.date)}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start mb-3">
                              <Clock className="h-5 w-5 text-blue-800 mr-2 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-gray-500">Time</p>
                                <p className="font-medium">{formatTime(consultation.time)} - {formatTime(consultation.endTime)}</p>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Status</p>
                              {renderStatusBadge(consultation.status)}
                            </div>
                          </div>
                          
                          {/* Middle column - Client Info */}
                          <div className="md:w-2/4 md:px-4 mb-4 md:mb-0">
                            <div className="flex items-start mb-3">
                              <User className="h-5 w-5 text-blue-800 mr-2 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-gray-500">Client</p>
                                <p className="font-medium">{consultation.clientName}</p>
                                <p className="text-sm text-gray-600">{consultation.clientEmail}</p>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Subject</p>
                              <p className="font-medium">{consultation.details}</p>
                              {consultation.description && (
                                <p className="text-sm text-gray-600 mt-1">{consultation.description}</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Right column - Actions */}
                          <div className="md:w-1/4 md:pl-4">
                            {consultation.status === 'upcoming' && consultation.meetLink && (
                              <a 
                                href={consultation.meetLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="mb-3 flex items-center justify-center w-full px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors"
                              >
                                <Video className="h-5 w-5 mr-2" />
                                Join Meeting
                              </a>
                            )}
                            
                            <div className="space-y-2">
                              <button className="flex items-center w-full px-4 py-2 text-left border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                                <span>Add Notes</span>
                              </button>
                              
                              {consultation.status === 'upcoming' && (
                                <button 
                                  className="flex items-center w-full px-4 py-2 text-left border border-red-200 text-red-700 rounded-md hover:bg-red-50 transition-colors"
                                  onClick={() => {
                                    // Add cancel functionality here
                                    if (window.confirm("Are you sure you want to cancel this meeting?")) {
                                      // Implement cancel API call
                                      console.log("Cancelling meeting:", consultation.id);
                                    }
                                  }}
                                >
                                  <span>Cancel Meeting</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {consultation.notes && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-1">Notes</p>
                            <p className="text-sm text-gray-600">{consultation.notes}</p>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center h-16 w-16 bg-gray-100 rounded-full mb-4">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'Try adjusting your filters or search query' 
                      : 'You have no consultations scheduled at this time'}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </section>
      
      {/* Quick Actions Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardBody className="text-center p-6">
                <div className="bg-blue-100 text-blue-800 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Manage Calendar</h3>
                <p className="text-gray-600 mb-4">
                  View and update your availability for client consultations.
                </p>
                <Button variant="outline" fullWidth>
                  Open Calendar
                </Button>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody className="text-center p-6">
                <div className="bg-blue-100 text-blue-800 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Client Database</h3>
                <p className="text-gray-600 mb-4">
                  Access your complete client database and history.
                </p>
                <Button variant="outline" fullWidth>
                  View Clients
                </Button>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody className="text-center p-6">
                <div className="bg-blue-100 text-blue-800 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Support</h3>
                <p className="text-gray-600 mb-4">
                  Need help with the platform? Contact our support team.
                </p>
                <Button variant="outline" fullWidth>
                  Get Help
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConsultationPage;