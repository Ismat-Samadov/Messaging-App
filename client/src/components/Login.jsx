import { Link } from 'react-router-dom';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

function Login() {
  const notifySuccess = () => toast.success('Logged in successfully!');
  const notifyError = () => toast.error('Something went wrong. Please try again');
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://chatsphere-zqoh.onrender.com/login", credentials);
      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/message');
      notifySuccess();
    } catch (error) {
      console.error('Login error:', error);
      notifyError();
    }
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
                <h1>Welcome back to the ChatSphere </h1>
                <p>- a real-time web application that enables users to engage in instant messaging with each other. Whether it is one-on-one chats or group discussions, it is a platform where you can connect, share ideas, and stay connected with friends, family, or colleagues.</p>
                <form className="flex-column" onSubmit={handleSubmit} method='post'>
                    <h1>Log into your account</h1>
                    <fieldset className="flex-column inputs">
                        <input className="signup-input" placeholder="Username" minLength="3" type="text" name="username" value={credentials.username} onChange={handleChange} required></input>
                        <input className="signup-input" placeholder="Password" type="password" minLength="3" name="password" value={credentials.password} onChange={handleChange} required></input>
                    </fieldset>
                    <button className="signup-btn" type="submit">Log in</button>
                    <Toaster />
                </form>
            </main>
            </div>
        </div>
    )
}

export default Login