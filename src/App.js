import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Quote from './components/Quote';
import Image from './components/Image';
import Video from './components/Video';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
        <div className="overlay">
          <h1 className="title">Motivdle</h1>
          <p className="subtitle">Inspire. Empower. Achieve.</p>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/image" element={<Image />} />
          <Route path="/video" element={<Video />} />
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
