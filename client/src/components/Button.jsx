import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 border border-transparent',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 active:bg-secondary-800 border border-transparent',
    outline: 'bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50',
    text: 'bg-transparent text-primary-600 hover:bg-primary-50 border-transparent',
  };
  
  const sizes = {
    sm: 'text-xs py-1 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-3 px-6',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyle}
        ${variants[variant]}
        ${sizes[size]}
        ${widthClass}
        ${disabledClass}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;