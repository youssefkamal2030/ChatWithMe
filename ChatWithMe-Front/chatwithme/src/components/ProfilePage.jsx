import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { username: profileUsername } = useParams();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [bio, setBio] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const currentEmail = localStorage.getItem('email');
    const token = localStorage.getItem('token');
    const backendUrl = 'https://localhost:44346';

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(
                    `${backendUrl}/api/Users/${profileUsername}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                const profileData = {
                    ...response.data,
                    profilePicture: response.data.profilePicture 
                        ? `${backendUrl}${response.data.profilePicture}`
                        : '/default-avatar.png'
                };
                
                setProfile(profileData);
                setNewUsername(response.data.userName); // Initialize username
                setBio(response.data.bio || '');
            } catch (error) {
                if (error.response?.status === 401) navigate('/login');
                else setError('Failed to load profile');
            }
        };

        token ? fetchProfile() : navigate('/login');
    }, [profileUsername, token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!token) {
            navigate('/login');
            return;
        }
    
        const formData = new FormData();
        formData.append('UserName', newUsername); // Use the new username value
        if (bio !== profile?.bio) formData.append('Bio', bio);
        if (selectedFile) formData.append('ProfilePicture', selectedFile);
        
        try {
            const response = await axios.put(
                `${backendUrl}/api/Users/${profileUsername}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                }
            );
    
            const updatedProfile = {
                ...response.data,
                profilePicture: response.data.profilePicture 
                    ? `${backendUrl}${response.data.profilePicture}`
                    : '/default-avatar.png',
                createdAt: new Date(response.data.createdAt)
            };
    
            setProfile(updatedProfile);
            setEditing(false);
            setSelectedFile(null);

            // Redirect if username changed
            if (response.data.userName !== profileUsername) {
                navigate(`/profile/${response.data.userName}`);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    const errorData = error.response.data;
                    
                    if (errorData.errors) {
                        const errorMessages = Object.values(errorData.errors).flat();
                        setError(errorMessages.join(', '));
                    } 
                    else if (typeof errorData === 'string') {
                        setError(errorData);
                    }
                    else {
                        setError(errorData.title || 'Validation failed');
                    }
                    
                    document.querySelector('input[type="file"]').value = '';
                    setSelectedFile(null);
                }
                else if (error.response.status === 401) {
                    navigate('/login');
                }
            } else {
                setError('Network error - please try again');
            }
        }
    };

    if (!profile) return <div className="loading">Loading...</div>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img 
                    src={profile.profilePicture} 
                    alt="Profile" 
                    className="profile-picture"
                    onError={(e) => e.target.src = '/default-avatar.png'}
                />
                <h1>{profile.userName}</h1>
                {currentEmail === profile.email && (
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
                        <label>Username</label>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            required
                            minLength="3"
                            maxLength="20"
                        />
                    </div>

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