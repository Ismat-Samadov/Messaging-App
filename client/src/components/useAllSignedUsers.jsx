/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCurrentUser from './useCurrentUser.jsx';
import axios from 'axios';

const useAllSignedUsers = () => {
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState([]);
    const currentUser = useCurrentUser();

    useEffect(() => {
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
              params: {
                loggedInUserId: currentUser.id,
              },
            });
            setAllUsers(response.data);
          } catch (error) {
            console.log('Error fetching all users', error);
          }
        };
        fetchAllUsers();
      }, []);
    return allUsers;
};

export default useAllSignedUsers;