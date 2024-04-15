import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [csrfToken, setCsrfToken] = useState('');

  const fetchCsrfToken = useCallback(async () =>
    {
     try {
       const response = await axios.get('http://localhost:8001/csrf-token', { withCredentials: true });
       console.log(response);
       setCsrfToken(response.data.csrfToken);
     } catch (error) {
       console.error('Error fetching CSRF token:', error);
     }
    }, []);

  const checkLoginStatus = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8001/check-login', {
        headers: {
          'x-csrf-token': csrfToken,
        },
        withCredentials: true,
      });
      const resLoggedIn = response.data.loggedIn;
      setLoggedIn(resLoggedIn);
      if(resLoggedIn)
        setUser(response.data.user.username);
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  }, [csrfToken]);

  useEffect(() => {
    const fetchCsrfAndCheckLoginStatus = async () => {
      await fetchCsrfToken();
      await checkLoginStatus();
    };

    // Call the function only when the component mounts
    if (!csrfToken) {
      fetchCsrfAndCheckLoginStatus();
    }
  }, [csrfToken, fetchCsrfToken, checkLoginStatus]);


  const handleLogin = async () => {
    // Make sure to include the CSRF token in the headers
    try {
      const response = await axios.post('http://localhost:8001/login', { username, password }, {
        headers: {
          'x-csrf-token': csrfToken,
        },
        withCredentials: true,
      });
      console.log(response);
      setLoggedIn(response.data.success);
      setUser(response.data.user.username);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8001/logout', null, {
        headers: {
          'x-csrf-token': csrfToken,
        },
        withCredentials: true,
      });
      setLoggedIn(false);
      setUser("");
      setCsrfToken("");
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div>
      {loggedIn ? (
        <div>
          <p>Welcome, {user}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <label>Username: </label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          <br />
          <label>Password: </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <br />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
}

export default Login;
