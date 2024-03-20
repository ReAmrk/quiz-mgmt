import React, { useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export function Navigation() {
  const [isAuth, setIsAuth] = useState(false);

   useEffect(() => {
     if (localStorage.getItem('access_token') !== null) {
        setIsAuth(true);
      }
    }, [isAuth]);

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">TrivOrg</Navbar.Brand>
        <Nav className="me-auto">
          {/* Use conditional rendering for Home link */}
          {isAuth && <Nav.Link href="/">Home</Nav.Link>}
            <Nav.Link href="/register">Register</Nav.Link>
            <Nav.Link href="/addquestion">Questions</Nav.Link>
            <Nav.Link href="/quizadmin">Quiz</Nav.Link>
            <Nav.Link href="/pointsadmin">Points</Nav.Link>
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
