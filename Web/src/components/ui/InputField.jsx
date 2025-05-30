import React from 'react';

const InputField = ({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  className = '',
  required = false
}) => {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full h-10 px-4 py-2 text-base font-normal text-[#1e1e1e] bg-white border border-[#d9d9d9] rounded-lg ${className}`}
      />
    </div>
  );
};

export default InputField;