import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/RoomList.css';

const History = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('email');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          `https://localhost:44346/api/Users/rooms?email=${userEmail}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        // Handle the API response structure
        const roomsData = response.data?.$values || response.data || [];
        setRooms(Array.isArray(roomsData) ? roomsData : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [userEmail, token]);

  const handleRoomClick = (roomId) => {
    navigate(`/ChatRoom/${roomId}`);
  };

  if (loading) return <div className="loading">Loading history...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="room-list-container">
      <h1>Your Chat History</h1>
      <div className="room-list">
        {rooms.length === 0 ? (
          <div className="empty-state">No chat history found</div>
        ) : (
          rooms.map((room) => (
            <div
              key={room.roomID}
              className="room-card"
              onClick={() => handleRoomClick(room.roomID)}
            >
              <h2>{room.roomName}</h2>
              <p>Created by: {room.createdByUserName}</p>
              <p>Created at: {new Date(room.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;