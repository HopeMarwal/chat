import React, { useState } from 'react'
//import components
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat'
import Profile from '../components/Profile';

export default function Home() {
  const [profileACtive, setProfileActive] = useState(false)
  return (
    <div className='home'>
      <div className='container'>
        <Sidebar onClick={() => setProfileActive(!profileACtive)} />
        {
          profileACtive
            ? <Profile />
            : <Chat />
        }
      </div>
    </div>
  )
}
