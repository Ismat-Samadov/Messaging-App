function logoutUser(navigate) {
    try {
        localStorage.removeItem('token');
        navigate('/');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

export default logoutUser;
