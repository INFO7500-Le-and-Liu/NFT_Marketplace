// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './page/Home';
// import Buy from './page/Buy';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/token/:tokenId" element={<Buy />} /> */}
      </Routes>
    </Router>
  );
};

export default App;