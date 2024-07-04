import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Quote from './components/Quote';
import Image from './components/Image';
import Video from './components/Video';
import Test from './components/Test';

function App() {
  return (
    <Router>
      <div className="App">
            
              
            
            
          
        
        <div className="overlay">
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/image" element={<Image />} />
          <Route path="/video" element={<Video />} />
          <Route path="/test" element={<Test />} />
        </Routes>
        <div className="subscribe">
          <h2>Subscribe</h2>
          <p>Sign up to be the first to get updates.</p>
          <input type="email" placeholder="Email" />
          <button>SIGN UP</button>
        </div>
      </div>
    </Router>
  );
}

export default App;
