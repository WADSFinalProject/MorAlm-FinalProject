import '../App.css';
import MoralmLogo from '../assets/MoralmLogo.png';
import UserLogo from '../assets/UserLogo2.png';
import DropdownIcon from '../assets/dropdown.png';
import LogoutIcon from '../assets/logout.png';
import React, { useState, useRef, useEffect } from 'react';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function Header(){
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth)
          .then(() => {
            // Sign-out successful.
            console.log("User logged out successfully");
            // Clear session storage
            sessionStorage.clear();
            // Navigate to login page
            navigate('/login');
          })
          .catch((error) => {
            // An error happened.
            console.error("Error logging out: ", error);
          });
    };

    useEffect(() => {
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div className="Header">
            <nav className="top-nav">
                <div className="nav-left">
                    <img src={MoralmLogo} alt="Moralm Logo" className="logoimg" />
                </div>
                <div className="gradient-bar">
                    <div className="segment segment1"></div>
                    <div className="segment segment2"></div>
                    <div className="segment segment3"></div>
                    <div className="segment segment4"></div>
                </div>
                <div className="nav-right">
                    <img src={UserLogo} alt="User Avatar" className="useravatar" />
                    <img src={DropdownIcon} alt="Dropdown Icon" className="dropdownIcon" onClick={() => setIsDropdownOpen(!isDropdownOpen)} />
                    {isDropdownOpen && (
                        <div className="dropdown" ref={dropdownRef}>
                            <div className="dropdownItem">
                                Profile
                            </div>
                            <div className="separator"></div>
                            <div className="dropdownItem" style={{ color: 'red' }} onClick={handleLogout}>
                                Logout
                                <img src={LogoutIcon} alt="Logout Icon" className="dropdownItemIcon" />
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default Header;
