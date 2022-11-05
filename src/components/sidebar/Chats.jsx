import { onSnapshot, doc } from 'firebase/firestore'
import React, { useState, useEffect, useContext } from 'react'
import { db } from '../../firebase';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

export default function Chats() {
  //state
  const [chats, setChats] = useState([])

  //context api
  const { currentUser } = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext)

  //use effect hook
  useEffect(() => {

    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data())
      })
      return () => {
        unsub()
      }
    }

    currentUser.uid && getChats()
  }, [currentUser.uid])

  //event handler
  const handleSelect = (user) => {
    dispatch({
      type: "CHANGE_USER",
      payload: user
    })
  }
  return (

    <div className='chats'>
      {
        Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => {
          return (
            <div
              className="user-chat"
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo)}
            >

              <img
                src={chat[1].userInfo.photoURL}
                alt={chat[1].userInfo.displayName}
              />
              <div className="user-chat_info">
                <span>{chat[1].userInfo.displayName}</span>
                <p>{chat[1].lastMessage?.text}</p>
              </div>
            </div>
          )

        })
      }



    </div>
  )
}
