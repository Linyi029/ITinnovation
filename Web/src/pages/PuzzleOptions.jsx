import React, { useEffect } from 'react';
import Card_orig from '../components/common/card-orig.jsx';
import {useNavigate } from 'react-router-dom';
import {connectWallet} from '../lib/provider';
import { useGlobalState, truncate} from '../lib/store';
import UserInfoButton from '../components/common/UserInfoButton';

const PuzzleOptions = () => {
  const [connectedAccount] = useGlobalState('connectedAccount');

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "MAIN | PUZZLE";
  }, []);
  const handleCreatePuzzleClick = () => {
    console.log('Navigate to create puzzle page');
    // In a real application, you would use navigation here
    navigate('/CreatePuzzle/Submit');
  };

  const handleSolvePuzzleClick = () => {
    console.log('Navigate to solve puzzles page');
    // In a real application, you would use navigation here
    navigate('/SolvePuzzle');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[url('/images/lgin_bg2.jpg')]">

      {/* 使用者資訊固定在右上角 */}
      <UserInfoButton />

      {/* 卡片區域置中 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-4">
        <div className="w-full max-w-[532px]">
          <Card_orig
            title="Create a puzzle!"
            // description="Body text."
            imageSrc="/images/create.webp"
            onClick={handleCreatePuzzleClick}
          />
        </div>
        <div className="w-full max-w-[532px]">
          <Card_orig
            title="Solving puzzles!"
            // description="Body text."
            imageSrc="/images/solver.jpeg"
            onClick={handleSolvePuzzleClick}
          />
        </div>
      </div>
    </div>

  );
};

export default PuzzleOptions;