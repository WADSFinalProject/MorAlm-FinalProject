import '../../Admin.css'
import UserInfo from './UserInfo';
import SideBar from '../SideBar';
import TopDiv from './TopDiv';

function CentralManagement() {
  return (
    <div className='App'>
      <SideBar />
      <UserInfo />
      <TopDiv />
    </div>
  );
}

export default CentralManagement;
