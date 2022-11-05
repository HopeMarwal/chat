import Messages from './chat/Messages'
import Input from './chat/Input'
import { ChatContext } from '../context/ChatContext'
import { useContext, useState } from 'react'
import { MdMoreHoriz, MdOutlineVideocam } from "react-icons/md";

export default function Chat() {
  const { data } = useContext(ChatContext)
  const [isLarge, setIsLarge] = useState(false)

  const handleHeightChange = (option) => {
    if (option === 'add') {
      setIsLarge(true)
    } else {
      setIsLarge(false)
    }

  }

  return (
    <div className='chat'>

      <div className="chat_info">
        <span>{data.user?.displayName}</span>
        <div className="chat_icon">
          <MdOutlineVideocam />
          <MdMoreHoriz />
        </div>
      </div>

      <Messages isLarge={isLarge} />
      <Input isLarge={isLarge} setIsLarge={handleHeightChange} />
    </div>
  )
}
