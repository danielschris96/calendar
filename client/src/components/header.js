import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Keo-1.png'; // replace this with the path to your logo
import { Navbar, Nav, Dropdown, Button } from 'react-bootstrap';
import AuthService from '../utils/auth'; // Update this path to your actual AuthService file

const Header = ({ currentGroupName, userGroups }) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);

  const toggleHamburger = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
  };

  const toggleGroupDropdown = () => {
    setIsGroupDropdownOpen(!isGroupDropdownOpen);
  };

  const handleLogout = () => {
    AuthService.logout();
    window.location.replace('/login'); // Redirect to the login page after logout
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">
        <img src={logo} alt="Logo" width="30" height="30" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleHamburger} />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Dropdown onSelect={() => setIsHamburgerOpen(!isHamburgerOpen)}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Dropdown Button
            </Dropdown.Toggle>

            <Dropdown.Menu show={isHamburgerOpen}>
              <Dropdown.Item href="/info">Personal Info</Dropdown.Item>
              <Dropdown.Item href="/groups">Create/Join Group</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
        {isHamburgerOpen && (
          <Nav>
            <Nav.Link href="/info">Personal Info</Nav.Link>
            <Nav.Link href="/groups">Create/Join Group</Nav.Link>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;