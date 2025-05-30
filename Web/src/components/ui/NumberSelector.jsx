import React, { useState } from 'react';

const NumberSelector = ({
  value,
  onChange,
  placeholder = '',
  min = 5,
  max = 30,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (num) => {
    onChange(num);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div 
        className={`w-full h-10 px-4 py-2 text-base font-normal text-[#1e1e1e] bg-white border border-[#d9d9d9] rounded-lg cursor-pointer flex items-center ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || placeholder}
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#d9d9d9] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((num) => (
            <div
              key={num}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(num)}
            >
              {num}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NumberSelector;