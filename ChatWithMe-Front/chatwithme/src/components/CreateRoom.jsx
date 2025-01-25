import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateRoom = () => {
    const [roomName, setRoomName] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const createdByID = localStorage.getItem("userID");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const roomData = {
            RoomName: roomName,
            CreatedByID: createdByID,
            CreatedAt: new Date().toISOString(),
        };

        try {
            const response = await axios.post("https://localhost:44346/api/ChatRoom", roomData);
            console.log("Room created:", response.data);

            // Set success message
            setSuccess("Room created successfully!");
            setError(""); // Clear any previous errors

            // Store room data in localStorage
            localStorage.setItem("RoomName", response.data.roomname);
            localStorage.setItem("RoomID", response.data.roomId);

            // Navigate to the Rooms page after a short delay
            setTimeout(() => {
                navigate('/Rooms');
            }, 1000); // 1-second delay to show the success message
        } catch (err) {
            console.error("Error creating room:", err.response?.data || err.message);
            setError(err.response?.data || "An error occurred while creating the room.");
            setSuccess(""); // Clear any previous success messages
        }
    };

    return (
        <div className="create-room-container">
        <h2>Create a New Room</h2>
        {error && (
          <div className="alert error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}
        {success && (
          <div className="alert success">
            <span className="alert-icon">✅</span>
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Room Name</label>
            <input
              className="form-input"
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            Create Room
          </button>
        </form>
      </div>
    );
};

export default CreateRoom;