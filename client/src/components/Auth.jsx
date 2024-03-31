/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

function Auth() {
    const notifySuccess = () => toast.success('Registered successfully!');
    const notifyError = () => toast.error('Something went wrong. Please try again');
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
      password: "",
      email: "",
      username: "",
    });
    const { username, email, password } = inputValue;
    const handleOnChange = (e) => {
      const { name, value } = e.target;
      setInputValue({
        ...inputValue,
        [name]: value,
      });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const { data } = await axios.post(
            "https://chatsphere-zqoh.onrender.com",
            {
              ...inputValue,
            },
            { withCredentials: true }
          );
          const { success, message, token } = data;
          console.log("Token received:", token);
          if (success) {
            localStorage.setItem('token', token);
            notifySuccess();
            setTimeout(() => {
              navigate("/message");
            }, 1000);
          } else {
            notifyError(); 
          }
        } catch (error) {
          console.log(error);
        }
    
        setInputValue({
          ...inputValue,
          password: "",
          email: "",
          username: "",
        });
      };

    return (
        <div>
            <div className="auth-container">
                <nav className="flex-row">
                    <div className="flex-row icon-name-container">
                        <img src='../chat.png' className="chat-icon"></img>
                        <a href="/">
                            <h1 className="chat-name">ChatSphere</h1>
                        </a>
                    </div>
                    <Link to="/login"><button className="login-btn">Log into your account</button></Link>
                </nav>
            <main>
                <h1>Welcome to the ChatSphere </h1>
                <p>- a real-time web application that enables users to engage in instant messaging with each other. Whether it is one-on-one chats or group discussions, it is a platform where you can connect, share ideas, and stay connected with friends, family, or colleagues.</p>
                <form className="flex-column" onSubmit={handleSubmit} method="post">
                    <h1>Get onboard</h1>
                    <fieldset className="flex-column inputs">
                        <input className="signup-input" placeholder="Username" minLength="3" type="text" name='username' value={username} onChange={handleOnChange}></input>
                        <input className="signup-input" placeholder="Email" type="email" name='email' value={email} onChange={handleOnChange}></input>
                        <input className="signup-input" placeholder="Password" type="password" minLength="3" name='password' value={password} onChange={handleOnChange}></input>
                    </fieldset>
                    <button className="signup-btn" type="submit">Sign up</button>
                    <Toaster />
                </form>
            </main>
            </div>
            <footer className="flex-row">Designed and developed by <a href="https://victoriakapelush.com" target="_blank">Victoria Kapelush</a></footer>
        </div>
    )
}

export default Auth