import React from 'react';
import { useGlobalState, truncate} from '../lib/store'


const Header = ({ username, points }) => {
  const [connectedAccount] = useGlobalState('connectedAccount');

  return (
    <div className="w-full flex justify-between items-center p-4">
      <h1 className="text-5xl font-bold text-[#e5e3e3]">Create Puzzle</h1>
      
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <img 
            src="/images/img_pilecoinlineiconvector46097345removebgpreview_1.png" 
            alt="Coin icon" 
            className="w-[57px] h-[61px]" 
          />
          <span className="text-2xl font-semibold text-[#181717] ml-2">{points} PUZ</span>
        </div>
        
        <div className="flex items-center">
          {/* <span className="text-2xl font-semibold text-[#ecebeb] mr-4">{username}</span> */}
          <span className="text-2xl font-semibold text-[#ecebeb] mr-4">
            {/* 使用者資訊固定在右上角 */}
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
          </span>
          <div className="w-10 h-10 bg-[#d9d9d9] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Header;