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
        <div>
            <h2>Create a New Room</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Room Name:</label>
                    <input
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Room</button>
            </form>
        </div>
    );
};

export default CreateRoom;