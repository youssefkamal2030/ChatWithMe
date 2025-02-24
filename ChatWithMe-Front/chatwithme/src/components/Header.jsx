import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const username = localStorage.getItem('username');
  const isLoggedIn = localStorage.getItem('token');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userID');
    window.location.reload();
  };

  return (
    <header className="header">
      <Link to="/" className="logo-link text-decoration-none text-white">
        <div className="logo">ChatWithMe</div>
      </Link>
      <nav className="nav">
      
        {isLoggedIn ? (
          <>
            <Link 
              to={`/profile/${username}`} 
              className="profile-link d-flex align-items-center me-2"
            >
              <span className="text-white">Hi {username}</span>
              <span className="emoji ms-1">👋</span>
            </Link>
            <button onClick={handleLogout} className="btn btn-outline-light logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-light me-2">
              Login
            </Link>
            <Link to="/register" className="btn btn-outline-light">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;