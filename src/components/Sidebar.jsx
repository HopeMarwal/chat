import React from 'react'
//import components
import Navbar from './sidebar/Navbar';
import Search from './sidebar/Search';
import Chats from './sidebar/Chats';

export default function Sidebar({ onClick }) {
  return (
    <div className='sidebar'>
      <Navbar onClick={onClick} />
      <Search />
      <Chats />
    </div>
  )
}
