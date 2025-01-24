import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') ?? 'Stranger';
  const isLoggedIn = localStorage.getItem('token');
  const handleCreateRoom = () => {
    if(isLoggedIn)
    {
      navigate('./CreatRoom');
    }
  else {
    navigate('/Login');
  }
  
  };
  const handlejoinRoom = ()=>
  {
    if(isLoggedIn)
    {
      navigate("/Rooms")
    }
    else
    {
      navigate("/Login")
    }
  }
  return (
    <div className="landing-page">
      <h1>Welcome {username}</h1>
      <p>Would you like to ChatWithMe?</p>
        <button className="create-room-button" onClick={handleCreateRoom}>
          Create Room
        </button>
        or 
        <button className="create-room-button" onClick={handlejoinRoom}>
          Join Room
        </button>
    </div>
  );
};

export default LandingPage;