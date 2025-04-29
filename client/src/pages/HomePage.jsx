
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Users, BookOpen, Calendar, ArrowRight, Shield, Scale, Gavel } from 'lucide-react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Card, { CardBody } from '../components/Card';
import Button from '../components/Button';

const HomePage = () => {
  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5 }
  };

  const services = [
    {
      icon: <Users className="h-10 w-10 text-primary-600" />,
      title: "Expert Legal Consultation",
      description: "Connect with qualified attorneys specializing in various practice areas for personalized legal advice."
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary-600" />,
      title: "Virtual Appointments",
      description: "Schedule and attend virtual consultations from the comfort of your home or office via Google Meet."
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary-600" />,
      title: "Legal Resources",
      description: "Access our comprehensive library of legal information, articles, and FAQs on common legal issues."
    }
  ];

  const testimonials = [
    {
      text: "LawConnect made it incredibly easy to get the legal advice I needed. The consultation was professional and helpful.",
      author: "Sarah Johnson",
      role: "Family Law Client",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300"
    },
    {
      text: "As an attorney, the platform has helped me connect with clients efficiently. The scheduling system is seamless.",
      author: "Michael Patel",
      role: "Business Attorney",
      image: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=300"
    },
    {
      text: "I was able to get crucial legal information quickly. The resources section answered many of my questions before my consultation.",
      author: "David Rodriguez",
      role: "Real Estate Client",
      image: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=300"
    }
  ];

  const stats = [
    { number: "1000+", label: "Consultations", icon: <Users className="h-6 w-6" /> },
    { number: "50+", label: "Expert Attorneys", icon: <Gavel className="h-6 w-6" /> },
    { number: "95%", label: "Client Satisfaction", icon: <Shield className="h-6 w-6" /> },
    { number: "24/7", label: "Support Available", icon: <Scale className="h-6 w-6" /> }
  ];

  return (
    <div style={{marginTop:'70px'}}>
      {/* Hero Section */}
      <Hero 
        title="Expert Legal Advice at Your Fingertips"
        subtitle="Connect with qualified attorneys for virtual consultations and get the legal support you need, when you need it."
        imageSrc="https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg"
        primaryButtonText="Schedule Consultation"
        primaryButtonLink="/schedule-meet"
        secondaryButtonText="Explore Resources"
        secondaryButtonLink="/legal-book"
      />

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connecting clients with experienced legal professionals for personalized consultations and expert legal advice.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="h-full transition-transform duration-300 hover:-translate-y-2">
                  <CardBody className="text-center p-8">
                    <div className="bg-primary-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900">{service.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{service.description}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get the legal help you need in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-primary-200 -translate-y-1/2" />
            
            {[
              {
                step: 1,
                title: "Schedule",
                description: "Book a consultation with a lawyer specializing in your legal matter."
              },
              {
                step: 2,
                title: "Connect",
                description: "Meet with your lawyer via Google Meet at your scheduled time."
              },
              {
                step: 3,
                title: "Get Advice",
                description: "Receive expert legal advice tailored to your specific situation."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold relative z-10">
                  {step.step}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="text-center mt-16"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/schedule-meet">
              <Button variant="primary" size="lg">
                Schedule Your Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Client Testimonials</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our clients have to say about our services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="h-full">
                  <CardBody className="p-8">
                    <div className="flex items-center mb-6">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.author}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{testimonial.author}</h4>
                        <p className="text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic leading-relaxed mb-4">"{testimonial.text}"</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Get Legal Advice?</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Schedule a consultation with one of our experienced attorneys today and get the legal support you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/schedule-meet">
                <Button variant="secondary" size="lg">
                  Schedule Consultation
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};


export default HomePage;