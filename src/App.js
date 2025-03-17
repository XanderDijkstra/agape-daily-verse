import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DailyVerse from './components/DailyVerse';
import SubmitVerse from './components/SubmitVerse';
import Admin from './components/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DailyVerse />} />
          <Route path="/submit" element={<SubmitVerse />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
