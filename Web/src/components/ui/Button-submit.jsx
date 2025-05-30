import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  onClick, 
  className = '',
  disabled = false
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-base font-normal ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;