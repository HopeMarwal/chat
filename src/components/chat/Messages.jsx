//context api
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
//react
import { useContext, useState, useEffect } from 'react'
//components
import Message from './Message'
//firebase
import { onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'

export default function Messages(props) {
  const [messages, setMessages] = useState([])
  const { data } = useContext(ChatContext)
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages)
    })

    return () => {
      unsub();
    }
  }, [data.chatId, currentUser])



  const handleDeleteMsg = async (msgId) => {
    const chatRef = doc(db, 'chats', data.chatId);

    let newMsgData = [...messages]

    newMsgData = messages.filter(msg => msg.id !== msgId)

    await updateDoc(chatRef, {
      messages: newMsgData
    });

    const lastMsgText = newMsgData[newMsgData.length - 1].text
    const lastMsgDate = newMsgData[newMsgData.length - 1].date

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + '.lastMessage']: {
        text: lastMsgText
      },
      [data.chatId + '.date']: lastMsgDate
    })

  }

  return (
    <div className={`${props.isLarge ? 'large' : ''} messages`}>
      {
        messages.map(msg => (<Message handleDeleMsg={handleDeleteMsg} message={msg} key={msg.id} />))
      }
    </div>
  )
}
