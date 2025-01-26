import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/RecentChats.css';

const RecentChats = () => {
  const [recentRooms, setRecentRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('email');

  useEffect(() => {
    const fetchRecentRooms = async () => {
      if (!token) return;
      
      try {
        const response = await axios.get(
          `https://localhost:44346/api/Users/rooms?email=${userEmail}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const rooms = response.data?.$values || response.data || [];
        const sortedRooms = Array.isArray(rooms) 
          ? rooms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4)
          : [];
        
        setRecentRooms(sortedRooms);
      } catch (error) {
        console.error('Error fetching recent rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentRooms();
  }, [token, userEmail]);

  if (!token) return null;

  return (
    <section className="recent-chats-section">
      <h2>Recent Chats</h2>
      {loading ? (
        <div className="loading">Loading recent chats...</div>
      ) : recentRooms.length > 0 ? (
        <div className="recent-chats-grid">
          {recentRooms.map((room) => (
            <div 
              key={room.roomID}
              className="recent-chat-card"
              onClick={() => navigate(`/ChatRoom/${room.roomID}`)}
            >
              <h3>{room.roomName}</h3>
              <div className="room-meta">
                <span>Created by: {room.createdByUserName}</span>
                <span>Last active: {new Date(room.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-recent-chats">No recent chat activity</div>
      )}
    </section>
  );
};

export default RecentChats;