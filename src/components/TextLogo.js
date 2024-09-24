import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TextLogo.css';

function TextLogo() {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/home'); // Make sure this matches your routing path
    };

    return (
        <div className="text-logo" onClick={handleLogoClick}>
            MOTIVDLE
        </div>
    );
}

export default TextLogo;
