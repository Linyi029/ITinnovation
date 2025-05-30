import React from 'react';

const Textarea = ({
  value,
  onChange,
  placeholder = '',
  className = '',
  required = false,
  rows = 4
}) => {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`w-full px-4 py-3 text-base font-normal text-[#1e1e1e] bg-white border border-[#d9d9d9] rounded-lg resize-none ${className}`}
      />
      <div className="absolute bottom-2 right-2">
        <img src="/images/img_drag.svg" alt="Resize" className="w-1.5 h-1.5" />
      </div>
    </div>
  );
};

export default Textarea;