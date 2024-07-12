import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';


function App() {
  return (
    <Router>
      <div className="App">
        <div className="overlay">
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <div className="subscribe">
          <h2>Subscribe</h2>
          <p>Sign up to be the first to get updates.</p>
          <input type="email" placeholder="Email" />
          <button>SIGN UP</button>
        </div>
        <footer class="footer">
        <p>&copy; 2024 Motivdle. All rights reserved.</p>
    </footer>
      </div>
    </Router>
  );
}

export default App;
