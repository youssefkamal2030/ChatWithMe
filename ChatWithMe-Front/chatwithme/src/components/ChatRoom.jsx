import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
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
  const latestMessageRef = useRef(null);
  const username = localStorage.getItem("username");

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch messages
        const messagesResponse = await axios.get(
          `https://localhost:44346/api/Message/room/${roomId}`
        );
        setMessages(messagesResponse.data?.messages?.$values || []);

        // Fetch room details
        const roomResponse = await axios.get(
          `https://localhost:44346/api/ChatRoom/${roomId}`
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

  // SignalR connection management
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:44346/chatHub")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  // Handle SignalR events
  useEffect(() => {
    if (connection && roomName && username) {
      connection.start()
        .then(() => {
          console.log("Connected to SignalR Hub");
          connection.invoke("JoinRoom", roomName, username);

          // Message handlers
          connection.on("ReceiveMessage", (user, content, sentAt) => {
            setMessages(prev => [...prev, { 
              username: user, 
              content, 
              sentAt 
            }]);
          });

          connection.on("Notify", (message) => {
            setMessages(prev => [...prev, {
              username: "System",
              content: message,
              sentAt: new Date().toISOString()
            }]);
          });

          connection.on("ActiveUsers", (users) => {
            setActiveUsers(users);
          });

          // Cleanup
          return () => {
            connection.off("ReceiveMessage");
            connection.off("Notify");
            connection.off("ActiveUsers");
            connection.invoke("LeaveRoom", roomName, username);
          };
        })
        .catch(err => console.error("Connection error:", err));
    }
  }, [connection, roomName, username]);

  // Auto-scroll to bottom
  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      await connection.invoke("SendMessage", roomName, username, message);
      setMessage("");
    } catch (err) {
      console.error("Message send error:", err);
      alert("Failed to send message");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>{roomName}</h1>
        <div className="active-users">
          <h3>Active Users ({activeUsers.length})</h3>
          <ul>
            {activeUsers.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} 
               className={`message ${msg.username === username ? "your-message" : "other-message"}`}>
            <div className="message-header">
              <span className="username">{msg.username}</span>
              <span className="message-time">
                {new Date(msg.sentAt).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        <div ref={latestMessageRef}></div>
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;