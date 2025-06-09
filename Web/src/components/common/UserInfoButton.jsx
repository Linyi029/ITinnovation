// src/components/UserInfoBadge.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectWallet } from '../../lib/provider';
import { useGlobalState, truncate, setGlobalState } from '../../lib/store';

const UserInfoButton = () => {
  const [connectedAccount] = useGlobalState('connectedAccount');
  const navigate = useNavigate();

  return (
    <div className="absolute top-8 right-10 flex flex-col items-end">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-stone-500 rounded-full"></div>
        {connectedAccount ? (
          <button
            onClick={() => navigate('/User')}
            className="text-stone-600 text-2xl font-semibold ml-2"
          >
            {truncate(connectedAccount, 4, 4, 11)}
          </button>
        ) : (
          <button
            className="text-stone-600 text-2xl font-semibold ml-2"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default UserInfoButton;
