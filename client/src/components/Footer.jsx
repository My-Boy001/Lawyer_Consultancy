import React from 'react';
import { NavLink } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About LawConnect</h3>
            <p className="text-gray-400 mb-4">
              Connecting clients with experienced legal professionals for personalized consultations and expert legal advice.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/" className="text-gray-400 hover:text-white transition duration-300">Home</NavLink>
              </li>
              <li>
                <NavLink to="/legal-book" className="text-gray-400 hover:text-white transition duration-300">Legal Resources</NavLink>
              </li>
              <li>
                <NavLink to="/schedule-meet" className="text-gray-400 hover:text-white transition duration-300">Schedule Consultation</NavLink>
              </li>
              <li>
                <NavLink to="/chat" className="text-gray-400 hover:text-white transition duration-300">Messages</NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="text-gray-400 hover:text-white transition duration-300">Contact Us</NavLink>
              </li>
            </ul>
          </div>

          {/* Practice Areas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Practice Areas</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 hover:text-white transition duration-300">Family Law</li>
              <li className="text-gray-400 hover:text-white transition duration-300">Criminal Defense</li>
              <li className="text-gray-400 hover:text-white transition duration-300">Business Law</li>
              <li className="text-gray-400 hover:text-white transition duration-300">Estate Planning</li>
              <li className="text-gray-400 hover:text-white transition duration-300">Immigration</li>
              <li className="text-gray-400 hover:text-white transition duration-300">Personal Injury</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0 text-primary-400" />
                <span className="text-gray-400">123 Legal Avenue, Suite 789, New York, NY 10001</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0 text-primary-400" />
                <span className="text-gray-400">(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0 text-primary-400" />
                <span className="text-gray-400">info@lawconnect.com</span>
              </li>
              <li className="flex items-center">
                <Clock size={18} className="mr-2 flex-shrink-0 text-primary-400" />
                <span className="text-gray-400">Mon-Fri: 9:00 AM - 5:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6">
          <p className="text-gray-500 text-center text-sm">
            &copy; {new Date().getFullYear()} LawConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;