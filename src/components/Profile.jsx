//react hook
import { useContext, useState } from "react"
//context hook
import { AuthContext } from '../context/AuthContext'
//react icons
import { IoMdImage } from 'react-icons/io'
//firebase
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth, storage } from '../firebase';
import {
  updateProfile,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword
} from 'firebase/auth'
import { getDownloadURL, uploadBytesResumable, ref } from "firebase/storage";
//components
import ButtonSave from "./profile/ButtonSave";
import ButtonEdit from "./profile/ButtonEdit";
import InputProfile from "./profile/InputProfile";



export default function Profile() {
  const { currentUser } = useContext(AuthContext)
  //state value
  const [userName, setUserName] = useState(currentUser.displayName)
  const [isChangeUserName, setIsChangeUserName] = useState(false)
  const [email, setEmail] = useState(currentUser.email)
  const [isChangeEmail, setIsChangeEmail] = useState(false)
  const [img, setImg] = useState(currentUser.photoURL)
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [errorPassword, setErrorPassword] = useState('')

  const [imgSrcPreview, setImgSrcPreview] = useState(currentUser.photoURL)
  //upload status value
  const [uploadNameStatus, setUploadNameStatus] = useState('none')
  const [uploadImgStatus, setUploadImgStatus] = useState('none')
  const [uploadEmailStatus, setUploadEmailStatus] = useState('none')
  const [uploadPasswordStatus, setUploadPasswordlStatus] = useState('none')



  const reader = new FileReader()

  //update profile info in firebase functions
  const handleEditName = async () => {
    setIsChangeUserName(!isChangeUserName)
    setUploadNameStatus('loading')

    //Update user in userChats
    //1. Get data from db about all chats
    const userChatsSnap = await getDoc(doc(db, "userChats", currentUser.uid))

    if (userChatsSnap.exists()) {
      const userChatsId = userChatsSnap.data()
      const userChatsArray = Object.entries(userChatsId)

      //2. Loop over all chats 
      for (const userChats of userChatsArray) {
        const usId = userChats[1].userInfo.uid
        //3. Get data from db about user chats
        const userChatsChangeNameRef = doc(db, "userChats", usId)
        const userChatsChangeNameSnap = await getDoc(userChatsChangeNameRef)
        const userChatsChangeNameId = userChatsChangeNameSnap.data()
        const userChatsChangeNameArray = Object.entries(userChatsChangeNameId)

        //4.Loop over users chats to find currentUser id
        for (const el of userChatsChangeNameArray) {
          el[1].userInfo.uid === currentUser.uid &&
            //5. Update displayName in users chats
            await updateDoc(userChatsChangeNameRef, {
              [el[0] + ".userInfo.displayName"]: userName
            })
        }
      }
    }
    //Update user profile
    await updateProfile(auth.currentUser, {
      displayName: userName,
    })
    //Update user in firestore db
    await updateDoc(doc(db, "users", currentUser.uid), {
      "displayName": userName,
    })
    setUploadNameStatus('complete')
    setTimeout(() => {
      setUploadNameStatus('none')
    }, 1500)

  }

  const handleEditPicture = async () => {
    const date = new Date().getTime();
    //img ref
    const storageImgRef = ref(storage, `${userName + date}`);
    const uploadTask = uploadBytesResumable(storageImgRef, img)
    //userchats
    const userChatsSnap = await getDoc(doc(db, "userChats", currentUser.uid))

    //upload new img
    uploadTask.on('state_changed',
      //handle progress
      (snapshot) => {
        setUploadImgStatus('loading')
      },
      //handle errors
      (err) => {
        console.log(err)
      },
      //handle success
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {
            //update img in profile
            await updateProfile(auth.currentUser, {
              photoURL: downloadURL
            })
            //update img in usersfirebase db
            await updateDoc(doc(db, "users", currentUser.uid), {
              "photoURL": downloadURL
            })

            //update img in firebase userChats
            if (userChatsSnap.exists()) {
              const userChatsId = userChatsSnap.data()
              const userChatsArray = Object.entries(userChatsId)

              //1. Loop over all chats 
              for (const userChats of userChatsArray) {
                const usId = userChats[1].userInfo.uid
                //2. Get data from db about user chats
                const userChatsChangeNameRef = doc(db, "userChats", usId)
                const userChatsChangeNameSnap = await getDoc(userChatsChangeNameRef)
                const userChatsChangeNameId = userChatsChangeNameSnap.data()
                const userChatsChangeNameArray = Object.entries(userChatsChangeNameId)

                //3.Loop over users chats to find currentUser id
                for (const el of userChatsChangeNameArray) {
                  el[1].userInfo.uid === currentUser.uid &&
                    //4. Update displayName in users chats
                    await updateDoc(userChatsChangeNameRef, {
                      [el[0] + ".userInfo.photoURL"]: downloadURL
                    })
                }
              }
            }
            setImg(downloadURL)
            setUploadImgStatus('complete')
            setTimeout(() => {
              setUploadImgStatus('none')
            }, 1500)

          } catch (e) {
            console.log(e)
          }
        })
      }
    )
    setUploadImgStatus('none')
  }

  const handleEditEmail = async () => {
    setIsChangeEmail(false)
    setUploadEmailStatus('loading')

    const userProvidedPassword = prompt("Please enter your password")

    const credential = EmailAuthProvider.credential(
      currentUser.email,
      userProvidedPassword
    )

    await reauthenticateWithCredential(currentUser, credential).then(async () => {
      // User re-authenticated.
      //Update e-mail
      await updateEmail(auth.currentUser, email).then(() => {
        // Email updated!
        setUploadEmailStatus('complete')
        setTimeout(() => {
          setUploadEmailStatus('none')
        }, 1500)
        console.log(currentUser.email)
      }).catch((error) => {
        // An error occurred
        console.log(error)
      });
    }).catch((error) => {
      // An error ocurred
      console.log(error)
    });


  }

  const handleEditPassword = async () => {

    if (password) {
      setUploadPasswordlStatus('loading')
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      )

      await reauthenticateWithCredential(currentUser, credential).then(async () => {
        // User re-authenticated.
        //Update password
        await updatePassword(currentUser, newPassword).then(() => {
          // Update successful.
          setUploadPasswordlStatus('complete')
          setTimeout(() => {
            setUploadPasswordlStatus('none')
          }, 1500)
        }).catch((error) => {
          // An error ocurred
          console.log(error)
        });
      }).catch((error) => {
        // An error ocurred
        console.log(error)
        setErrorPassword('Oops... wrong password!')
      });
    } else {
      setErrorPassword('Empty password')
    }




  }

  //state change functions
  const handleChangeUserName = (e) => {
    setUserName(e.target.value)
  }

  const handleChangeImg = (e) => {
    const file = e.target.files[0]
    setImg(file)
    reader.readAsDataURL(file)

    reader.onloadend = () => {
      setImgSrcPreview(reader.result)
    }
  }

  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  const handleChangePassword = (e) => {
    setErrorPassword('')
    setPassword(e.target.value)
  }

  const handleChangeNewPassword = (e) => {
    setNewPassword(e.target.value)
  }

  return (
    <div className='profile'>
      <div className='profile_header'>
        <p>{currentUser.displayName}</p>
      </div>
      <div className="profile_body">

        <div className="profile_info">

          <div className="profile_name">
            <span>Name:</span>
            <InputProfile
              isChange={isChangeUserName}
              value={userName}
              onChange={handleChangeUserName}
              onClick={() => setIsChangeUserName(true)}
            />

            <ButtonEdit
              onClick={() => setIsChangeUserName(!isChangeUserName)}
              disabled={userName === currentUser.displayName}
            />

            <ButtonSave
              handleEdit={handleEditName}
              disabled={userName !== currentUser.displayName}
              uploadStatus={uploadNameStatus}
            />

          </div>

          <div className="profile_picture">
            <span>Logo:</span>
            <img src={imgSrcPreview} alt='' />

            <input
              type="file"
              id="file"
              style={{ display: 'none' }}
              onChange={handleChangeImg}
            />

            <label htmlFor="file">
              <IoMdImage />
            </label>

            <ButtonSave
              handleEdit={handleEditPicture}
              disabled={img !== currentUser.photoURL}
              uploadStatus={uploadImgStatus}
            />

          </div>

          <div className="profile_email">
            <span>Email:</span>
            <InputProfile
              isChange={isChangeEmail}
              value={email}
              onChange={handleChangeEmail}
              onClick={() => setIsChangeEmail(true)}
            />

            <ButtonEdit
              onClick={() => setIsChangeEmail(!isChangeEmail)}
              disabled={email === currentUser.email}
            />

            <ButtonSave
              handleEdit={handleEditEmail}
              disabled={email !== currentUser.email}
              uploadStatus={uploadEmailStatus}
            />

          </div>

          <div className="profile_password">
            <div className="profile_password-container">
              <span>Password:</span>
              <input
                type="password"
                value={password}
                onChange={handleChangePassword}
              />
              {
                errorPassword && <span className="error">{errorPassword}</span>
              }
            </div>
            <div className="profile_password-container">
              <span>New password:</span>
              <input
                type="password"
                value={newPassword}
                onChange={handleChangeNewPassword}
              />

              <ButtonSave
                handleEdit={handleEditPassword}
                disabled={newPassword}
                uploadStatus={uploadPasswordStatus}
              />

            </div>


          </div>
        </div>

      </div>


    </div>
  )
}
