import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ title, price, description, imageSrc, onClick }) => {
  return (
    <div 
      className="bg-white border border-[#d9d9d9] rounded-lg shadow-sm cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="w-full h-[247px] bg-white flex items-center justify-center mb-6">
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-full h-full object-contain"
          />
        </div>
        <h3 className="text-base font-normal text-[#1e1e1e] mb-2 font-inter">{title}</h3>
        <p className="text-base font-semibold text-[#1e1e1e] mb-3 font-inter">{price}</p>
        <p className="text-sm text-[#757575] font-inter">{description}</p>
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageSrc: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

export default Card;