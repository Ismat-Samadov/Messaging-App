// frontend/App.js
import React, { useState } from 'react';
import LoginForm from './auth/LoginForm';
import MessageList from './messages/MessageList';
import ProfileForm from './profile/ProfileForm';

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [recipientId, setRecipientId] = useState(null);

    const handleLogin = () => {
        setLoggedIn(true);
        // Fetch user ID from server if needed
        setUserId(userId); // Set user ID from response
    };

    return (
        <div>
            {!loggedIn ? (
                <LoginForm onLogin={handleLogin} />
            ) : (
                <div>
                    <MessageList senderId={userId} recipientId={recipientId} />
                    <ProfileForm userId={userId} />
                </div>
            )}
        </div>
    );
};

export default App;
