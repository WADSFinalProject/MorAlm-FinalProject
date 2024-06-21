import { useLocation, NavLink } from 'react-router-dom';
import MoralmWhiteLogo from '../assets/moralm-logo-white.png';
import { useEffect, useState } from 'react';

const SideBar = () => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  return (
    <div className="sidebar">
      <img src={MoralmWhiteLogo} className='moralm-logo-admin' alt="Moralm Logo"></img>
      <ul>
        <li className={`user-management ${activePath === '/user-management' ? 'active' : ''}`}>
          <NavLink to="/admin/user-management">User &nbsp; &nbsp; Management</NavLink>
        </li>
        <li className={`centra-management ${activePath === '/centra-management' ? 'active' : ''}`}>
          <NavLink to="/admin/centra-management">Centra Management</NavLink>
        </li>
        <li className={`storage-management ${activePath === '/storage-management' ? 'active' : ''}`}>
          <NavLink to="/admin/storage-management">Storage Management</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;

