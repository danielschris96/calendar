import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Keo-1.png'; // replace this with the path to your logo
import { Navbar, Nav, Dropdown, Button } from 'react-bootstrap';

const Header = ({ currentGroupName, userGroups }) => {
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);

    const toggleHamburger = () => {
        setIsHamburgerOpen(!isHamburgerOpen);
    };

    const toggleGroupDropdown = () => {
        setIsGroupDropdownOpen(!isGroupDropdownOpen);
    };

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#">
                <img src={logo} alt="Logo" width="30" height="30" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleHamburger} />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {currentGroupName}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {(userGroups || []).map((group, index) => (
                      <Dropdown.Item as={Link} to={`/group/${group._id}`} key={index}>
                        {group.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                </Nav>
                {isHamburgerOpen && (
                    <Nav>
                        <Nav.Link href="/personal-info">Personal Info</Nav.Link>
                        <Nav.Link href="/create-join-group">Create/Join Group</Nav.Link>
                        <Nav.Link href="/login">Logout</Nav.Link>
                    </Nav>
                )}
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;