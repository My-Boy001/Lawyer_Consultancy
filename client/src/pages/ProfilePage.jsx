import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import axios from 'axios';
import Card from '../components/Card';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/find-user', {
          withCredentials: true
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8">
            <div className="p-8">
              <div className="flex items-center space-x-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="h-12 w-12 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600 text-lg">{user?.email}</p>
                  <p className="text-primary-600 font-medium mt-1">
                    {user?.role === 'lawyer' ? 'Legal Professional' : 'Client'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <Mail className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="text-gray-900 mt-1">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <Phone className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                      <p className="text-gray-900 mt-1">{user?.phone || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <MapPin className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Address</h3>
                      <p className="text-gray-900 mt-1">{user?.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {user?.role === 'lawyer' && (
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <Briefcase className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Specialization</h3>
                        <p className="text-gray-900 mt-1">{user?.specialization || 'Not specified'}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <User className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                      <p className="text-gray-900 mt-1 whitespace-pre-line">{user?.bio || 'No bio provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage; 