//react
import { useState, useContext, useEffect, useRef } from 'react';
//api context
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
//icon
import { MdDelete } from "react-icons/md";
//component
import Modal from './Modal'

export default function Message({ message, handleDeleMsg }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  //context api 
  const { currentUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext)

  const ref = useRef()

  const handleDelete = () => {
    setIsModalOpen(true)
  }

  const handleClick = (e) => {

    const target = e.target.value
    if (target === 'Yes') {
      handleDeleMsg(message.id)
    }
    setIsModalOpen(false)
  }

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }, [message])

  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && 'owner'} `}>

      {isModalOpen && <Modal onClick={handleClick} />}

      <div className="message-info">
        <img src={
          message.senderId === currentUser.uid
            ? currentUser.photoURL
            : data.user.photoURL
        }
          alt="logo" />
        <span>Just now</span>
      </div>

      <div className="message-content">

        <div className='message-content_text'>
          <span
            className='icon'
            onClick={handleDelete}
          >
            <MdDelete />
          </span>
          {message.text && <p>{message.text}</p>}
        </div>

        {message.img && <img src={message.img} alt="logo" />}
      </div>

    </div>
  )
}
