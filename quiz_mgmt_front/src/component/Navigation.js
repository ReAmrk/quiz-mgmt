import React, { useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export function Navigation() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Use localStorage.getItem directly in the condition
    setIsAuth(localStorage.getItem('access_token') !== null);
  }, []);

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">JWT Authentication</Navbar.Brand>
        <Nav className="me-auto">
          {/* Use conditional rendering for Home link */}
          {isAuth && <Nav.Link href="/">Home</Nav.Link>}
        </Nav>
        <Nav>
          {/* Use conditional rendering for Logout/Login links */}
          {isAuth ? (
            <Nav.Link href="/logout">Logout</Nav.Link>
          ) : (
            <Nav.Link href="/login">Login</Nav.Link>
          )}
        </Nav>
      </Navbar>
    </div>
  );
}
