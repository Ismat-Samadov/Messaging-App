import axios from "axios";
import { useContext } from "react";
import { createContext, useEffect, useState, useMemo } from "react";
import { API_DOMAIN } from "../utils/API_DOMAIN";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState();
  const [userError, setUserError] = useState();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem("token", token);
      // get the user information
      const getUser = async () => {
        try {
          const response = await axios.get(`${API_DOMAIN}/users/self`);
          setUser(response.data.user);
          return;
        } catch (err) {
          setUser("Could not fetch user");
          return;
        }
      };
      // call the async function
      getUser();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      setUser();
    }
  }, [token]);

  const contextValue = useMemo(() => {
    return {
      token,
      setToken,
      user,
    };
  }, [token, user]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
