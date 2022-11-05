//Firebase
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { AuthContext } from '../../context/AuthContext';
//React 
import { useContext } from 'react';
//Icons
import { MdLogout, MdSettings } from 'react-icons/md';

export default function Navbar({ onClick }) {
  const { currentUser } = useContext(AuthContext)

  return (
    <div className='navbar'>
      <div className='user'>
        <img src={currentUser.photoURL} alt="logo" />
        <span>{currentUser.displayName}</span>

      </div>
      <div className='buttons'>
        <button
          className='icon'
          onClick={onClick}
        >
          <MdSettings />
        </button>
        <button
          className='icon'
          onClick={() => signOut(auth)}
        >
          <MdLogout />
        </button>
      </div>
    </div>
  )
}
