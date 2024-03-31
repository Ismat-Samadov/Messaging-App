/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import useCurrentUser from './useCurrentUser.jsx';
import useAllSignedUsers from './useAllSignedUsers.jsx'
import logoutUser from './logoutUser';
import EmojiPicker from 'emoji-picker-react';
import icon from '../assets/icons/user.png';

function NewConversation() {
    const navigate = useNavigate();
    const currentUser = useCurrentUser();
    const allUsers = useAllSignedUsers();
    const [conversation, setConversation] = useState([]);
    const [inputValue, setInputValue] = useState(""); 
    const conversationId = useParams().id;
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleEmojiSelect = (emojiObject) => {
        setInputValue(prevValue => prevValue + emojiObject.emoji);
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    // Display name of a message receiver on top of the page
    const user = allUsers.find(user => user._id === conversationId);

// Function to handle message submission
const handleSubmitMessage = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
        const tokenWithoutBearer = token.replace('Bearer ', '');
        const response = await axios.post(`https://messaging-app-i1kr.onrender.com/message/users/${conversationId}`, { text: inputValue }, {
            headers: {
                Authorization: `Bearer ${tokenWithoutBearer}`
            }
        });
        const { message } = response.data;
        setConversation(prevConversation => {
            const filteredConversations = prevConversation.filter(conv => {
                const includesCurrentUser = conv.participants.some(participant =>
                    participant._id === currentUser.id
                );
                const includesOtherUser = conv.participants.some(participant =>
                    participant._id === conversationId
                );
                return includesCurrentUser && includesOtherUser;
            });
        
            if (filteredConversations.length > 0) {
                return prevConversation.map(conv => {
                    if (filteredConversations.some(filteredConv => filteredConv._id === conv._id)) {
                        return {
                            ...conv,
                            messages: [...conv.messages, message]
                        };
                    }
                    return conv;
                });
            } else {
                return [
                    ...prevConversation,
                    {
                        _id: conversationId,
                        participants: [currentUser.id, conversationId],
                        messages: [message]
                    }
                ];
            }
        });
        setInputValue("");
        console.log("Message created:", message);
        fetchConversations();
    } catch (error) {
        console.error("Error sending message:", error);
    }
};

 // Fetch comversation between users
 const fetchConversations = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
        const tokenWithoutBearer = token.replace('Bearer ', '');
        const response = await axios.get(`https://messaging-app-i1kr.onrender.com/message/users/${conversationId}`, {
            headers: {
                Authorization: `Bearer ${tokenWithoutBearer}`
            },
        });
        setConversation(response.data);
    } catch (error) {
        console.error('Error fetching conversations:', error);
    }
};

useEffect(() => {
    fetchConversations();
}, [navigate]);

    const handleLogout = (e) => {
       e.preventDefault();
       logoutUser(navigate);
    };
        
    return (
        <div className="auth-container auth-container-extra">
            <div className="users-list">
                <div className="groupchat-btns-container flex-row">
                    <Link to="/message/users"><button className="groupchat-btn">Go back</button></Link>
                </div>
            </div>
            <div className="message-section flex-column">
                <div>
                    <div className="flex-row username-header">
                        <div className="flex-row user-img-name">
                            <img className="user-icon" src={icon} alt="User Icon" />
                            <div className="flex-column">
                                {user ? (
                                    <>
                                        <h4>{user.username}</h4>
                                        <h4>Offline</h4>
                                    </>
                                    ) : (
                                        <h4>User not found</h4>
                                )}    
                            </div>
                        </div>
                        <button onClick={handleLogout} type="submit" className="login-btn">Log out</button>
                    </div>
                    {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiSelect} />}
                    <div className="flex-column messages-container">
                    {conversation.map((conv, index) => (
                        <div key={index} className="flex-column messages-container">
                            {conv.messages.map((message, msgIndex) => (
                                <div key={msgIndex} className={`flex-column message-window ${message.sender === currentUser.id ? 'sent-by-me' : 'sent-by-other'}`}>
                                    <p className="p-message">{message.text}</p>
                                    <p className="p-sent-by">{message.time}</p>
                                    {message.image && <img className="message-image" src={message.image} alt="Sent Image" />}
                                    <p>{message.image}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                    </div>
                    </div>
                    <form className="send-message-form" onSubmit={handleSubmitMessage}>
                        <div className="flex-row input-btn-form-container">
                            <input 
                                type="text" 
                                placeholder="Type your message here..." 
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                            />
                            <button type="button" onClick={toggleEmojiPicker}>😊</button>
                            <button type="submit">Send</button>
                        </div>
                    </form>
                </div>
            </div>
    )
}

export default NewConversation;