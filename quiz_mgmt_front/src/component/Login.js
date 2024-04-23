import axios from "axios";
import { useState } from "react";

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      const user = {
        username: username,
        password: password,
      };

      const response = await axios.post(
        'http://localhost:8000/api/token/pair',
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
        if (error.response && error.response.status === 400) {
          // Unauthorized - Incorrect username or password
          console.error("Login failed: Incorrect username or password");
          setErrorMsg("Incorrect username or password");
        } else {
          console.error("Login failed", error);
        }
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form className="mt-5" onSubmit={submit}>
            <h3 className="mb-4 text-center">Sign In</h3>

            {errorMsg && (
              <div className="alert alert-danger" role="alert">
                {errorMsg}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                id="username"
                className="form-control"
                placeholder="Enter Username"
                name="username"
                type="text"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
