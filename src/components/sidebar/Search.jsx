import React, { useContext, useState } from 'react';
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from '../../firebase';
import { AuthContext } from '../../context/AuthContext';

export default function Search() {
  //state 
  const [userName, setUserName] = useState('')
  const [user, setUser] = useState(null)
  const [err, setErr] = useState(false)

  const { currentUser } = useContext(AuthContext)

  //functions 
  const handleSearch = async () => {
    const q = query(
      collection(db, 'users'),
      where('displayName', '==', userName)
    )

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data())
      });
    } catch (err) {
      console.log(err)
      setErr(true)
    }

  }
  //event handlers
  const handleSearchInput = (e) => {
    setUserName(e.target.value)
  }

  const handleKey = (e) => {
    e.code === 'Enter' && handleSearch()
  }

  const handleClickSelect = async () => {
    //check whether the group (chat in firestore) exists, if not create
    const combinedID =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid
    try {
      const res = await getDoc(doc(db, 'chats', combinedID))

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedID), { messages: [] })

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedID + '.userInfo']: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedID + '.date']: serverTimestamp()
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedID + '.userInfo']: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [combinedID + '.date']: serverTimestamp()
        })
      }
    } catch (err) {
      setErr(true)
      console.log(err)
    }

    setUser(null)
    setUserName('')
  }

  return (
    <div className='search-bar'>
      <div className="search-form">
        <input
          onChange={handleSearchInput}
          onKeyDown={handleKey}
          type="text"
          placeholder='Search...'
          value={userName}
        />
      </div>
      {err && <span>User not found</span>}
      {
        user &&
        <div
          className="user-chat"
          onClick={handleClickSelect}
        >
          <img src={user.photoURL} alt={user.displayName} />

          <div className="user-chat_info">
            <span>{user.displayName}</span>
          </div>

        </div>
      }
    </div>
  )
}
