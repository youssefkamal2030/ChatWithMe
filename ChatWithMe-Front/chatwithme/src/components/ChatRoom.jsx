import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { HubConnectionBuilder } from "@microsoft/signalr";
import axios from "axios";
import "../styles/ChatRoom.css";

const ChatRoom = () => {
  const { roomId } = useParams();
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [roomName, setRoomName] = useState("");
  const latestMessageRef = useRef(null);

  const username = localStorage.getItem("username");

  // Fetch messages from the backend
  useEffect(() => {
    const fetchRoomMessages = async () => {
      try {
        const response = await axios.get(
          `https://localhost:44346/api/Message/room/${roomId}`
        );
        // Use optional chaining and default to empty array
        setMessages(response.data?.messages?.$values || []); 
      } catch (err) {
        console.error("Error fetching messages:", err);
        setMessages([]); // Ensure messages is always an array
      }
    };

    fetchRoomMessages();
  }, [roomId]);

  // Fetch room details separately
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(
          `https://localhost:44346/api/ChatRoom/${roomId}`
        );
        setRoomName(response.data?.roomName || "Unknown Room");
      } catch (err) {
        console.error("Error fetching room details:", err);
        setRoomName("Unknown Room");
      }
    };

    if (roomId) fetchRoomDetails();
  }, [roomId]);

  // SignalR connection setup
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:44346/chatHub")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  // Handle SignalR connection and messages
  useEffect(() => {
    if (connection && roomName && username) {
      connection
        .start()
        .then(() => {
          console.log("Connected to SignalR Hub");

          connection.invoke("JoinRoom", roomName, username)
            .catch(err => console.error("Error joining room:", err));

          connection.on("ReceiveMessage", (user, message) => {
            setMessages(prev => [...prev, {
              username: user,
              content: message,
              sentAt: new Date().toISOString()
            }]);
          });

          connection.on("Notify", (message) => {
            setMessages(prev => [...prev, {
              username: "System",
              content: message,
              sentAt: new Date().toISOString()
            }]);
          });
        })
        .catch(err => console.error("Connection failed:", err));
    }
  }, [connection, roomName, username]);

  // Auto-scroll to latest message
  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (connection && username && message && roomName) {
      try {
        await connection.invoke("SendMessage", roomName, username, message);
        setMessage("");
      } catch (err) {
        console.error("Error sending message:", err);
        alert("Failed to send message");
      }
    } else {
      alert("Please enter a message.");
    }
  };

  return (
    <div className="chat-container">
      <h1 className="chat-header">{roomName}</h1>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} 
               className={`message ${msg.username === username ? "your-message" : "other-message"}`}>
            <div className="message-header">
              <span className="username">{msg.username}</span>
              <span className="message-time">
                {new Date(msg.sentAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        <div ref={latestMessageRef}></div>
      </div>
      <div className="chat-inputs">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          className="form-control"
        />
        <button onClick={sendMessage} className="btn btn-primary">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;