/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from 'react-router-dom';
import useCurrentUser from './useCurrentUser.jsx';
import useAllSignedUsers from './useAllSignedUsers.jsx';
import logoutUser from './logoutUser';
import icon from '../assets/icons/user.png';

function ShowUsers() {
    const navigate = useNavigate();
    const currentUser = useCurrentUser();
    const allUsers = useAllSignedUsers();

    const handleLogout = (e) => {
        e.preventDefault();
        logoutUser(navigate);
    };
    
    return (
        <div className="auth-container auth-container-extra">
            <div className="users-list">
                <div className="groupchat-btns-container flex-row">
                    <Link to="/message/users"><button className="groupchat-btn">Users</button></Link>
                </div>
                {allUsers.filter(user => user._id !== currentUser.id).map((user, index) => (
                    <Link key={index} to={`/message/users/${user._id}`}>
                        <div className="flex-column user-brief-left">
                            <h4>{user.username}</h4>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="message-section flex-column">
                <div className="flex-row username-header">
                    <div className="flex-row user-img-name">
                        <img className="user-icon" src={icon} alt="User Icon" />
                        <div className="flex-column">
                            <h4>{currentUser && currentUser.username}</h4>
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

export default ShowUsers;