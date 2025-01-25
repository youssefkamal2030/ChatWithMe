import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RoomList.css';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch all chat rooms from the backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('https://localhost:44346/api/ChatRoom');
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        const data = await response.json();
        console.log(data.$values)
        setRooms(data.$values);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomClick = (roomId) => {
    navigate(`/ChatRoom/${roomId}`);
  };

  if (loading) {
    return <div className="loading">Loading rooms...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  console.log(rooms)
  return (
    <div className="room-list-container">
      <h1>Available Chat Rooms</h1>
      <div className="room-list">
        {rooms.map((room) => (
          <div
            key={room.roomID}
            className="room-card"
            onClick={() => handleRoomClick(room.roomID)}
          >
            <h2>{room.roomName}</h2>
            <p>Created by: {room?.createdByUserName || 'Unknown'}</p>
            <p>Created at: {new Date(room.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;