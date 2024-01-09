import axios from "axios";
import { useState } from "react";

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e) => {
    e.preventDefault();

    try {
      const user = {
        username: username,
        password: password,
      };

      const response = await axios.post(
        'http://localhost:8000/token/',
        user,
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );

      // Destructure the data object
      const { access, refresh } = response.data;

      localStorage.clear();
      // Use localStorage.setItem for each token
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Set Authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      // Handle error, you might want to show a user-friendly error message
      console.error("Login failed", error);
    }
  };

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={submit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              className="form-control mt-1"
              placeholder="Enter Username"
              name="username"
              type="text"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
