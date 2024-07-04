import React from 'react';
import './Home.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


function Home() {
    const navigate = useNavigate();

  const handleQuoteClick = () => {
    navigate('/quote');
  };



  return (
    <div className="home">
      <div className="background-home"></div>
      <div className="overlay1">
        <Link to="/"><h1 className="title-home">Motivdle</h1></Link>
        <Link to="/"><p className="subtitle-home">Inspire. Empower. Achieve.</p></Link>   
          <button className="quote-button" onClick={handleQuoteClick}>Motivational quote</button>
      
          </div>
          <Link to="/test">hi</Link>
    </div>
    
    
  );
}

export default Home;


