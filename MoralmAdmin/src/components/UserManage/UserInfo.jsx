import { useState } from 'react';
import '../../Admin.css';
import userImage from '../../assets/UserLogo.png';
import LogoutIcon from '@mui/icons-material/Logout';
import DropdownArrow from '../../assets/dropdownarrow.png';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function UserInfo() {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
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

    return (
        <div className='userInfo'>
            <img src={DropdownArrow} alt="Dropdown button" className="pfp-text" onClick={toggleDropdown} />
            <div className='pfp-picture'>
                <img src={userImage} alt="Admin profile" className="pfp-admin" />
                {dropdownVisible && (
                    <div className='dropdown-menu'>
                        <ul>
                            <li>
                                <span className='dropdown-items-profile'>Profile</span>
                            </li>
                            <li>
                                <span className='dropdown-items-logout' onClick={handleLogout}>
                                    Logout <LogoutIcon sx={{ marginLeft: '0.7em' }} />
                                </span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserInfo;
