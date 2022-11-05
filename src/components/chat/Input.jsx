//Icons
import { MdAttachFile } from 'react-icons/md';
import { IoMdSend, IoMdImage } from 'react-icons/io'
//React Hooks
import { useContext, useState } from 'react';
//Api context hooks
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
//uuid
import { v4 as uuid } from 'uuid';
//firebase
import { updateDoc, doc, arrayUnion, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
//progress bar
import LoadingBar from 'react-top-loading-bar';

export default function Input(props) {
  //State value
  const [text, setText] = useState("")
  const [image, setImage] = useState(null)
  const [isImg, setIsImg] = useState(false)
  const [imgSrcPreview, setImgSrcPreview] = useState('')
  const [loadProgress, setLoadProgress] = useState(0)

  //Context api user & msg
  const { currentUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext)

  const reader = new FileReader()

  const handleSend = async (e) => {
    if (!text && !image) { return }

    try {
      if (image) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, image)
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setLoadProgress(progress)
            console.log(`img ${progress} upload`)
          },
          (error) => {
            //TODO:Handle Error
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              try {
                await updateDoc(doc(db, "chats", data.chatId), {
                  messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                    img: downloadURL,
                  }),
                });
              } catch (e) {
                console.log(e)
              }

            });
          }
        );
      } else {
        try {
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now()
            })
          })
        } catch (e) {
          console.log(e)
        }
      }

      try {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [data.chatId + '.lastMessage']: {
            text
          },
          [data.chatId + '.date']: serverTimestamp()
        })

        await updateDoc(doc(db, "userChats", data.user.uid), {
          [data.chatId + '.lastMessage']: {
            text
          },
          [data.chatId + '.date']: serverTimestamp()
        })
        setIsImg(false)
        setImgSrcPreview('')
        setText('')
        setImage(null)
        props.setIsLarge('send')
      } catch (e) {
        console.log(e)
      }
    } catch (e) {
      console.log(e)
    }
  }
  // const handleSend = async (e) => {
  //   if (!text && !image) { return }

  //   if (image) {
  //     const storageRef = ref(storage, uuid());
  //     const uploadTask = uploadBytesResumable(storageRef, image)
  //     uploadTask.on(
  //       (error) => {
  //         //TODO:Handle Error
  //       },
  //       async () => {
  //         await getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
  //           await updateDoc(doc(db, "chats", data.chatId), {
  //             messages: arrayUnion({
  //               id: uuid(),
  //               text,
  //               senderId: currentUser.uid,
  //               date: Timestamp.now(),
  //               img: downloadURL,
  //             }),
  //           });
  //         });
  //       }
  //     );
  //   } else {
  //     await updateDoc(doc(db, "chats", data.chatId), {
  //       messages: arrayUnion({
  //         id: uuid(),
  //         text,
  //         senderId: currentUser.uid,
  //         date: Timestamp.now()
  //       })
  //     })
  //   }

  //   await updateDoc(doc(db, "userChats", currentUser.uid), {
  //     [data.chatId + '.lastMessage']: {
  //       text
  //     },
  //     [data.chatId + '.date']: serverTimestamp()
  //   })

  //   await updateDoc(doc(db, "userChats", data.user.uid), {
  //     [data.chatId + '.lastMessage']: {
  //       text
  //     },
  //     [data.chatId + '.date']: serverTimestamp()
  //   })
  //   setIsImg(false)
  //   setImgSrcPreview('')
  //   setText('')
  //   setImage(null)
  //   props.setIsLarge('send')

  // }

  const handleChangeText = (e) => {
    setText(e.target.value)
  }
  //Handle preview image 
  const handleChangeImg = (e) => {
    const file = e.target.files[0]
    setImage(file)
    reader.readAsDataURL(file)

    reader.onloadend = () => {
      setIsImg(true)
      setImgSrcPreview(reader.result)
      props.setIsLarge('add')
    }
  }
  //Handle delete preview image 
  const handleDeletePreviewImg = () => {
    setImage(null)
    setIsImg(false)
    setImgSrcPreview('')
    props.setIsLarge('delete')
  }

  return (
    <div className={`${props.isLarge ? 'large' : ''} msg-input`} >
      <LoadingBar
        color='#10a925'
        progress={loadProgress}
        onLoaderFinished={() => setLoadProgress(0)}
      />

      {isImg && <div className='img_preview-wrap'>

        <div className='img_preview-container'>
          <div onClick={handleDeletePreviewImg}>x</div>
          <img className='img_preview' src={imgSrcPreview} alt="" />
        </div>

      </div>}

      <input
        type="text"
        placeholder="Type message"
        onChange={handleChangeText}
        value={text}
      />

      <div className="send">
        <MdAttachFile />

        <input
          type="file"
          id="file"
          style={{ display: 'none' }}
          onChange={handleChangeImg}
        />

        <label htmlFor="file">
          <IoMdImage />
        </label>

        <IoMdSend onClick={handleSend} />
      </div>


    </div>
  )
}
