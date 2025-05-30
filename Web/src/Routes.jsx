import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import PuzzleCreationPlatform from './pages';
import PuzzleOptions from './pages/PuzzleOptions';
import SolvePuzzleMain from './pages/SolvePuzzleMain';
import CreatePuzzleSubmit from './pages/idx-createPZ';
import Register from './pages/register';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PuzzleCreationPlatform />} />
        <Route path="/Main" element={<PuzzleOptions />} />
        <Route path="/SolvePuzzle" element={<SolvePuzzleMain />} />
        <Route path="/CreatePuzzle/Submit" element={<CreatePuzzleSubmit />} />
        <Route path="/Register" element={<Register />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;