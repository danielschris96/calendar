import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Keo-1.png'; // replace this with the path to your logo

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
        <header className="header">
            <div className="logo-container">
                <img src={logo} alt="Logo" />
            </div>

            <div className="group-name">
                <button onClick={toggleGroupDropdown}>{currentGroupName}</button>
                {isGroupDropdownOpen && (
                    <ul className="group-dropdown">
                        {userGroups.map((group, index) => (
                            <li key={index}>
                                <Link to={`/group/${group._id}`}>{group.name}</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <nav className="nav-menu">
                <button className="hamburger-menu" onClick={toggleHamburger}>
                    <div></div>
                    <div></div>
                    <div></div>
                </button>
                {isHamburgerOpen && (
                    <ul>
                        <li>
                            <Link to="/personal-info">Personal Info</Link>
                        </li>
                        <li>
                            <Link to="/create-join-group">Create/Join Group</Link>
                        </li>
                        <li>
                            <Link to="/logout">Logout</Link>
                        </li>
                    </ul>
                )}
            </nav>
        </header>
    );
};

export default Header;