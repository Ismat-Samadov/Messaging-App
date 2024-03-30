// frontend/messages/MessageList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MessageList = ({ senderId, recipientId }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/api/messages/${senderId}/${recipientId}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Failed to fetch messages', error);
            }
        };
        fetchMessages();
    }, [senderId, recipientId]);

    return (
        <ul>
            {messages.map((message) => (
                <li key={message._id}>{message.content}</li>
            ))}
        </ul>
    );
};

export default MessageList;
