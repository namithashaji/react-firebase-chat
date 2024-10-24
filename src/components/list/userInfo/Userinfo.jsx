import "./userInfo.css"
import { useUserStore } from "../../../lib/userStore";
import Edit from "../../../assets/edit.png"
import More from "../../../assets/more.png"
import Video from "../../../assets/video.png"
import Avatar from "../../../assets/avatar.png"
import { signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase";

const Userinfo = () => {
  const { currentUser } = useUserStore();

  return (
    <div className='userInfo'>
      <div className="user">
        <img src={currentUser.avatar || Avatar} alt="Avatar" />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <button onClick={() => signOut(auth)} className="logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" x2="9" y1="12" y2="12"/>
          </svg> 
        </button>
      </div>
    </div>
  )
}

export default Userinfo