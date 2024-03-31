/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import logoutUser from './logoutUser';
import useCurrentUser from './useCurrentUser.jsx';
import icon from '../assets/icons/user.png';

function Message() {
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState([]);
    const currentUser = useCurrentUser();

    const handleLogout = (e) => {
        e.preventDefault();
        logoutUser(navigate);
    };

        const fetchAllUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }
                const tokenWithoutBearer = token.replace('Bearer ', '');
                const response = await axios.get('https://chatsphere-zqoh.onrender.com', {
                    headers: {
                        Authorization: `Bearer ${tokenWithoutBearer}`,
                    },
                });
                const allUsers = response.data.map(user => user.username);
                
                // Filter out the currentUser from allUsers
                const filteredUsers = allUsers.filter(username => username !== currentUser);
                setAllUsers(filteredUsers);
            } catch (error) {
                console.log('Error fetching all users', error);
            }
        };
    
    return (
        <div className="auth-container auth-container-extra">
            <div className="users-list">
                <div className="groupchat-btns-container flex-row">
                    <Link to="/message/users"><button className="groupchat-btn" onClick={fetchAllUsers}>Show all users</button></Link>
                </div>
            </div>
            <div className="message-section flex-column">
                <div className="flex-row username-header">
                    <div className="flex-row user-img-name">
                        <img className="user-icon" src={icon} alt="User Icon" />
                        <div className="flex-column">
                            <h4>{currentUser.username}</h4>
                            <h4>Online</h4>
                        </div>
                    </div>
                    <button onClick={handleLogout} type="submit" className="login-btn">Log out</button>
                </div>
                <div className="flex-column messages-container">
                </div>
            </div>
        </div>
    )
}

export default Message;
