import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DailyVerse from './components/DailyVerse';
import Admin from './components/Admin';
import SubmitVerse from './components/SubmitVerse';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<DailyVerse />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/submit" element={<SubmitVerse />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
