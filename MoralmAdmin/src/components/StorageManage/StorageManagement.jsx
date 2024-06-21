import '../../Admin.css'
import UserInfo from './UserInfo';
import SideBar from '../SideBar';
import Tables from './Tables';

function StorageManagement() {
  return (
    <div className='App'>
      <SideBar />
      <UserInfo />
      <Tables />
    </div>
  );
}

export default StorageManagement;
