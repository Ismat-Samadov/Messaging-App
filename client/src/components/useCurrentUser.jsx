import { useEffect, useState } from 'react';
import axios from 'axios';

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }
        const tokenWithoutBearer = token.replace('Bearer ', '');
        const response = await axios.get('https://chatsphere-zqoh.onrender.com/login', {
          headers: {
            Authorization: `Bearer ${tokenWithoutBearer}`,
          },
        });
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error('Error fetching current user', error);
      }
    };

    fetchCurrentUser();
  }, []);

  return currentUser;
};

export default useCurrentUser;

