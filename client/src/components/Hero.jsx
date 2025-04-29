import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Hero = ({
  title,
  subtitle,
  imageSrc,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
}) => {
  return (
    <div className="relative h-[600px] overflow-hidden bg-gray-900">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${imageSrc})`,
          filter: 'brightness(0.4)'
        }}
      ></div>
      
      {/* Content */}
      <div className="relative h-full container mx-auto px-4 md:px-6 flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {primaryButtonText && primaryButtonLink && (
              <Link to={primaryButtonLink}>
                <Button variant="primary" size="lg">
                  {primaryButtonText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
            
            {secondaryButtonText && secondaryButtonLink && (
              <Link to={secondaryButtonLink}>
                <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                  {secondaryButtonText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;