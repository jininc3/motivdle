import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';  // Assuming Home is still your main component
import Testing from './components/testing';  // Import the Testing page component

function App() {
  return (
    <Router>
      <div className="App">
        <div className="overlay">
        </div>
        <Routes>
          <Route path="/" element={<Home />} />  {/* Existing Home route */}
          <Route path="/testing" element={<Testing />} />  {/* New route for Testing page */}
        </Routes>
        <div className="subscribe">
          <h2>Subscribe</h2>
          <p>Sign up to be the first to get updates.</p>
          <input type="email" placeholder="Email" />
          <button>SIGN UP</button>
        </div>
        <footer className="footer">
          <p>&copy; 2024 Motivdle. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;