import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { HubConnectionBuilder } from "@microsoft/signalr";
import axios from "axios";
import "../styles/ChatRoom.css";

const ChatRoom = () => {
  const { roomId } = useParams();
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [roomName, setRoomName] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const latestMessageRef = useRef(null);
  const username = localStorage.getItem("username");
  const backendUrl = 'https://localhost:44346';

  const handleEditClick = (messageId, currentContent) => {
    setEditingMessageId(messageId);
    setEditedContent(currentContent);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${backendUrl}/api/Message/${editingMessageId}`, 
        { Content: editedContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setEditingMessageId(null);
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  const handleDelete = async (messageId) => {
    if (window.confirm("Delete this message permanently?")) {
      try {
        await axios.delete(`${backendUrl}/api/Message/${messageId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  useEffect(() => {
    if (connection) {
      connection.on("MessageEdited", (messageId, newContent) => {
        setMessages(prev => prev.map(msg => 
          msg.messageID === messageId ? {...msg, content: newContent} : msg
        ));
      });

      connection.on("MessageDeleted", (messageId) => {
        setMessages(prev => prev.filter(msg => msg.messageID !== messageId));
      });
    }
  }, [connection]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const messagesResponse = await axios.get(
          `${backendUrl}/api/Message/room/${roomId}`
        );
        setMessages(messagesResponse.data?.messages?.$values?.map(msg => ({
          messageID: msg.messageID,
          username: msg.username,
          content: msg.content,
          sentAt: msg.sentAt
        })) || []);

        const roomResponse = await axios.get(
          `${backendUrl}/api/ChatRoom/${roomId}`
        );
        setRoomName(roomResponse.data?.roomName || "Unknown Room");
      } catch (err) {
        console.error("Initial data fetch error:", err);
        setMessages([]);
        setRoomName("Unknown Room");
      }
    };

    fetchInitialData();
  }, [roomId]);

  // ... (keep the rest of the useEffect hooks and connection logic the same)

  return (
    <div className="chat-container">
      <div className="active-users-sidebar">
        {/* Active Users Sidebar remains same */}
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <h1>{roomName}</h1>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.messageID} 
                 className={`message ${msg.username === username ? "your-message" : "other-message"}`}>
              <div className="message-header">
                <span className="username">{msg.username}</span>
                <span className="message-time">
                  {new Date(msg.sentAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                {msg.username === username && !editingMessageId && (
                  <div className="message-actions">
                    <button 
                      onClick={() => handleEditClick(msg.messageID, msg.content)}
                      className="btn-edit"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(msg.messageID)}
                      className="btn-delete"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
              
              {editingMessageId === msg.messageID ? (
                <div className="edit-container">
                  <input
                    type="text"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    autoFocus
                  />
                  <button onClick={handleSaveEdit} className="btn-save">
                    Save
                  </button>
                  <button 
                    onClick={() => setEditingMessageId(null)} 
                    className="btn-cancel"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="message-content">{msg.content}</div>
              )}
            </div>
          ))}
          <div ref={latestMessageRef}></div>
        </div>

        {/* Chat input remains same */}
      </div>
    </div>
  );
};

export default ChatRoom;