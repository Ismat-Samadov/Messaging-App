// frontend/profile/ProfileForm.js
import React, { useState } from 'react';
import axios from 'axios';

const ProfileForm = ({ userId }) => {
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/profile/${userId}`, { username, profilePicture });
            // Handle success or perform additional actions
        } catch (error) {
            console.error('Failed to update profile', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} />
            <button type="submit">Save</button>
        </form>
    );
};

export default ProfileForm;
