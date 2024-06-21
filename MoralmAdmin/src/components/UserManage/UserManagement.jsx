import '../../Admin.css'
import UserInfo from './UserInfo';
import SideBar from '../SideBar';
import TopDiv from './TopDiv';

function UserManagement() {
  return (
    <div className='App'>
      <SideBar />
      <UserInfo />
      <TopDiv />
    </div>
  );
}

export default UserManagement;
