import { useState } from 'react'
import { FcAddImage } from "react-icons/fc";
//firebase
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
//router
import { useNavigate, Link } from 'react-router-dom';
//loading bars
import LoadingBar from 'react-top-loading-bar';
import LoaderCss from '../components/loadingbars/LoadersCss';
//components
import Input from '../components/Input'

export default function Register() {
  //State variables
  const [loadProgress, setLoadProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [err, setErr] = useState(false)
  const [img, setImg] = useState(false)
  const [imgSrc, setImgSrc] = useState('')
  //User
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    file: null
  })
  //Validate errors
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [isFormValid, setIsFormValid] = useState(false)

  //Global variables
  const reader = new FileReader()
  const navigate = useNavigate()
  const photoDefault = 'https://firebasestorage.googleapis.com/v0/b/chat-firebase-415f5.appspot.com/o/profile.png?alt=media&token=352d7f52-5495-4b68-ab3e-e12a4d92450c'

  //Handle preview image 
  const handleChangeFile = (e) => {
    const file = e.target.files[0]
    setUser({ ...user, file: file })
    reader.readAsDataURL(file)

    reader.onloadend = () => {
      setImg(true)
      setImgSrc(reader.result)
    }
  }

  //Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true)
      //Create user
      const res = await createUserWithEmailAndPassword(auth, user.email, user.password);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${user.name + date}`);
      const uploadTask = uploadBytesResumable(storageRef, user.file);

      uploadTask.on('state_changed',
        //Handle progress process
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setLoadProgress(progress)
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log(error);
          setErr(true);
          setIsLoading(false)
        },
        () => {
          //Handle successful uploads
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            //Handle default image for user profile
            let urlImg;
            if (!user.file) {
              urlImg = photoDefault
            } else {
              urlImg = downloadURL
            }

            try {
              //Update profile
              await updateProfile(res.user, {
                displayName: user.name,
                photoURL: urlImg,
              });
              //Create user on firestore
              await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                displayName: user.name,
                email: user.email,
                photoURL: urlImg,
              });

              //Create empty user chats on firestore
              await setDoc(doc(db, "userChats", res.user.uid), {});
              navigate("/");

            } catch (err) {
              console.log(err);
              setErr(true);
              setIsLoading(false)

            }

          });
        }
      );

    } catch (err) {
      console.log(err)
      setErr(true);
    }
  };

  const handleChangeName = (e) => {
    const target = e.target.value
    setUser({ ...user, name: target })
    let isValid = true
    let err = ''

    if (!target.match(/^[a-zA-Z]+$/)) {
      isValid = false
      err = 'Only letters allowed'
    }
    setIsFormValid(isValid)
    setErrors({ ...errors, name: err })
  }

  const handleChangeEmail = (e) => {
    const target = e.target.value
    setUser({ ...user, email: target })
    let isValid = true
    let err = ''

    let lastAtPosition = target.lastIndexOf('@')
    let lastDotPosition = target.lastIndexOf('.')
    // !(valid exp)
    if (
      !(
        lastAtPosition < lastDotPosition &&
        lastAtPosition > 0 &&
        target.lastIndexOf('@@') === -1 &&
        lastDotPosition > 2 &&
        target.length - lastDotPosition > 2
      )
    ) {
      isValid = false
      err = 'Email is not valid'
    }

    setIsFormValid(isValid)
    setErrors({ ...errors, email: err })
  }

  const handleChangePassword = (e) => {
    const target = e.target.value
    setUser({ ...user, password: target })
    let isValid = true
    let err = ''

    const regPassword = new RegExp(/^(?=.*\d)(?=.*[A-Z])((?=.*[-+_!@#$%^&*.,?])|(?=.*_))^[^ ]+$/)
    if (!regPassword.test(target)) {
      isValid = false
      err = 'Your password should have at least 1 uppercase letter, 1 special symbol, 1 digit'
    } else if (target.length < 8) {
      isValid = false
      err = 'Your password shold have at least 8 characters'
    }

    setIsFormValid(isValid)
    setErrors({ ...errors, password: err })
  }

  return (
    <div className='form-container'>

      <LoadingBar
        color='#10a925'
        progress={loadProgress}
        onLoaderFinished={() => setLoadProgress(0)}
      />

      <div className='form-wrapper'>

        <span className='logo'>Chat</span>
        <span className='title'>Register</span>

        <form onSubmit={handleSubmit}>
          {/* Username input */}
          <Input
            type="text"
            placeholder="User name"
            value={user.name}
            onChange={handleChangeName}
            error={errors.name}
          />

          {/* Email input */}
          <Input
            type="email"
            placeholder="User email"
            value={user.email}
            onChange={handleChangeEmail}
            error={errors.email}
          />

          {/* Password input */}
          <Input
            type="password"
            placeholder="User password"
            onChange={handleChangePassword}
            error={errors.password}
          />

          {/* Image input */}
          <input
            style={{ display: 'none' }}
            type="file"
            id="file"
            onChange={handleChangeFile}
          />

          <label htmlFor="file">
            <FcAddImage />
            <span>Add an avatar</span>
          </label>

          {img && <img className='img_preview' src={imgSrc} alt="" />}

          <button
            className='btn'
            disabled={isFormValid ? false : true}
          >
            Sign up
          </button>

          {isLoading && <LoaderCss />}

          {err && <span className='err'>Oops... Something went wrong</span>}

        </form>

        <p>Do you have an account? <Link to="/login">Login</Link></p>

      </div>

    </div>
  )
}