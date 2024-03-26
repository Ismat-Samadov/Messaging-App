// Chat.js
import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const Chat = ({ user }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const socket = socketIOClient('http://localhost:3000');

    useEffect(() => {
        socket.on('receiveMessage', (message) => {
            setMessages([...messages, message]);
        });
        return () => socket.disconnect();
    }, [messages]);

    const sendMessage = () => {
        socket.emit('sendMessage', { sender: user.id, text: newMessage });
        setNewMessage('');
    };

    return (
        <div>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>{message.text}</div>
                ))}
            </div>
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
