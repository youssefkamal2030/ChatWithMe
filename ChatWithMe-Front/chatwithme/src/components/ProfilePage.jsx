import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [bio, setBio] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const currentUser = localStorage.getItem('username');
    const username = currentUser
    const token = localStorage.getItem('token');
    const backendUrl = 'https://localhost:44346';
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(
                    `${backendUrl}/api/Users/${currentUser}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                    const profileData = {
                    ...response.data,
                    profilePicture: response.data.profilePicture 
                        ? `${backendUrl}${response.data.profilePicture}`
                        : '/default-avatar.png'
                };
                
                setProfile(profileData);
                setBio(response.data.bio || '');
            } catch (error) {
                if (error.response?.status === 401) {
                    navigate('/login');
                } else {
                    setError('Failed to load profile');
                }
            }
        };

        if (token) {
            fetchProfile();
        } else {
            navigate('/login');
        }
    }, [username, token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!token) {
            navigate('/login');
            return;
        }
    
        const formData = new FormData();
        
        // Match backend DTO property names (case-sensitive)
        if (bio !== profile?.bio) formData.append('Bio', bio); // Uppercase 'Bio'
        if (selectedFile) formData.append('ProfilePicture', selectedFile); // Uppercase 'ProfilePicture'
    
        try {
            // Include username in endpoint URL
            const response = await axios.put(
                `${backendUrl}/api/Users/${currentUser}`, // Updated endpoint format
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                }
            );
    
            // Construct full image URL from backend response
            const updatedProfile = {
                ...response.data,
                profilePicture: response.data.profilePicture 
                    ? `${backendUrl}${response.data.profilePicture}`
                    : '/default-avatar.png',
                createdAt: new Date(response.data.createdAt) // Ensure Date object
            };
    
            setProfile(updatedProfile);
            setEditing(false);
            setSelectedFile(null);
        } catch (error) {
            // Handle backend validation errors
            if (error.response?.status === 400) {
                setError(error.response.data);
            } else if (error.response?.status === 401) {
                navigate('/login');
            } else if (error.response?.data) {
                setError(error.response.data.title || error.response.data);
            } else {
                setError('Failed to update profile');
            }
            
            // Clear file input on error
            if (error.response?.status === 400) {
                document.querySelector('input[type="file"]').value = '';
                setSelectedFile(null);
            }
        }
    };
    if (!profile) return <div className="loading">Loading...</div>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img 
                    src={profile.profilePicture || '/default-avatar.png'} 
                    alt="Profile" 
                    className="profile-picture"
                    onError={(e) => {
                        e.target.src = '/default-avatar.png';
                    }}
                />
                <h1>{profile.userName}</h1>
                {currentUser === username && (
                    <button 
                        onClick={() => {
                            setEditing(!editing);
                            setError('');
                        }}
                        className="edit-button"
                    >
                        {editing ? 'Cancel' : 'Edit Profile'}
                    </button>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            {editing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label>Bio (max 200 characters)</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            maxLength={200}
                        />
                        <div className="character-count">{200 - bio.length}</div>
                    </div>
                    
                    <div className="form-group">
                        <label>Profile Picture (max 2MB)</label>
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/gif"
                            onChange={(e) => {
                                if (e.target.files[0]?.size > 2 * 1024 * 1024) {
                                    setError('File size must be less than 2MB');
                                    return;
                                }
                                setSelectedFile(e.target.files[0]);
                            }}
                        />
                    </div>

                    <button type="submit" className="save-button">
                        Save Changes
                    </button>
                </form>
            ) : (
                <div className="profile-info">
                    <p className="bio">{profile.bio || 'No bio yet...'}</p>
                    <div className="stats">
                        <div className="stat-item">
                            <h3>Member Since</h3>
                            <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="stat-item">
                            <h3>Rooms Created</h3>
                            <p>{profile.roomsCreated}</p>
                        </div>
                        <div className="stat-item">
                            <h3>Messages Sent</h3>
                            <p>{profile.messagesSent}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;