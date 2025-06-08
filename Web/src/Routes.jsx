import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import PuzzleCreationPlatform from './pages';
import Login from './pages';
import PuzzleOptions from './pages/PuzzleOptions';
import SolvePuzzleMain from './pages/SolvePuzzleMain';
import CreatePuzzleSubmit from './pages/idx-createPZ';
import Register from './pages/register';
import User from './pages/User';
import SolvedPuzzle from './pages/VerifiedPuzzle';
import UnsolvedPuzzle from './pages/UnverifiedPuzzle';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<PuzzleCreationPlatform />} /> */}
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/" element={<PuzzleOptions />} />
        {/* <Route path="/Main" element={<PuzzleOptions />} /> */}
        <Route path="/SolvePuzzle" element={<SolvePuzzleMain />} />
        <Route path="/CreatePuzzle/Submit" element={<CreatePuzzleSubmit />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/User" element={<User />} />
        <Route path="/VerifiedPuzzle" element={<SolvedPuzzle />} />
        <Route path="/UnverifiedPuzzle" element={<UnsolvedPuzzle />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;