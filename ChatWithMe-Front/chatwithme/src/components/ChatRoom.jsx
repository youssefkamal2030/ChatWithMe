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

  // Retrieve username and userID from localStorage
  const username = localStorage.getItem("username");

  // Fetch messages from the backend
  useEffect(() => {
    const fetchRoomMessages = async () => {
      try {
        const response = await axios.get(`https://localhost:44346/api/Message/room/${roomId}`);
        console.log(response.data);
        setMessages(response.data.$values); // Set messages from the response
      } catch (err) {
        console.error("Error fetching messages:", err.response?.data || err.message);
      }
    };

    fetchRoomMessages();
  }, [roomId]); // Fetch messages when roomId changes

  // Fetch room details when roomId changes
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:44346/api/ChatRoom/${roomId}`);
        setRoomName(response.data.roomName); // Set the room name
      } catch (err) {
        console.error("Error fetching room details: ", err.response?.data || err.message);
      }
    };

    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  // Establish SignalR connection
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:44346/chatHub")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  // Start SignalR connection and join the room
  useEffect(() => {
    if (connection && roomName && username) {
      connection
        .start()
        .then(() => {
          console.log("Connected to SignalR Hub");

          // Join the room group using roomId and username
          connection
            .invoke("JoinRoom", roomName, username)
            .catch((err) => console.error("Error joining room: ", err));

          // Listen for incoming messages
          connection.on("ReceiveMessage", (user, message) => {
            console.log("Received message:", user, message);
            setMessages((prevMessages) => [
              ...prevMessages,
              { sender: { userName: user }, content: message, sentAt: new Date().toISOString() },
            ]);
          });

          // Listen for system notifications
          connection.on("Notify", (message) => {
            setMessages((prevMessages) => [
              ...prevMessages,
              { sender: { userName: "System" }, content: message, sentAt: new Date().toISOString() },
            ]);
          });
        })
        .catch((err) => {
          console.error("Connection failed: ", err);
        });
    }
  }, [connection, roomName, username]);

  // Scroll to the latest message
  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a message
  const sendMessage = async () => {
    if (connection && username && message && roomName) {
      try {
        // Send the message via SignalR
        await connection.invoke("SendMessage", roomName, username, message);

        // Clear the message input
        setMessage("");
      } catch (err) {
        console.error("Error sending message: ", err.response?.data || err.message);
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
          <div key={index} className="message">
            <strong>{msg.sender.userName}: </strong>
            <span>{msg.content}</span>
            <span className="message-time">
              {new Date(msg.sentAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={latestMessageRef}></div> {/* Scroll to this element */}
      </div>
      <div className="chat-inputs">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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