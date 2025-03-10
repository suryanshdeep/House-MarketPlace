import React from 'react'
import { useState } from 'react'
import {toast} from 'react-toastify'
import { Link,useNavigate } from 'react-router-dom'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import {getAuth,createUserWithEmailAndPassword,updateProfile}
from 'firebase/auth'
import {doc,setDoc,serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import OAuth from '../components/OAuth'
function SignUp() {
    const [showPassword,setShowPassword]=useState(false);
    const [formData,setformData]=useState({
      name:'',
      email:'',
      password:'' 
    })
    const {name,email,password}=formData;

    const navigate=useNavigate()

    const onChange=(e)=>{
        setformData((prevState)=>({
            ...prevState,
            [e.target.id]:e.target.value,
        }))
    }

    const onSubmit=async (e)=>{
        e.preventDefault()

        try{
            const auth=getAuth()
            //create the user with the given details in firebase authentication
            const userCredential=await createUserWithEmailAndPassword(auth,email,password)

            //getting the user created 
            const user=userCredential.user

            updateProfile(auth.currentUser,{
                displayName:name,
            })

             const formDataCopy={...formData}
             delete formDataCopy.password
             formDataCopy.timestamp=serverTimestamp()

             await setDoc(doc(db,'users',user.uid),formDataCopy)

            navigate('/')
        }
        catch(error){
            toast.error('Something went wrong with registration')
        }
    }

  return (
    <>
    <div className='pageContainer'>
        <header>
            <p className='pageHeader'>Welcome !</p>
        </header>

        <form onSubmit={onSubmit}>
            <input type="name" className="nameInput"
            placeholder='Name' id='name' value={name}
            onChange={onChange} />

            <input type="email" className="emailInput"
            placeholder='Email' id='email' value={email}
            onChange={onChange} />
            <div className="passInputDiv">
                <input type={showPassword?'text':'password'} 
                className="passwordInput"
                id='password'
                value={password}
                onChange={onChange}
                placeholder='Password'
                 />
                <img src={visibilityIcon} alt="show Password" className="showPassword"
                onClick={()=>setShowPassword((prevState)=>!prevState)} />
            </div>

            {/* <Link to='/forgot-password' className='forgotPasswordLink'>
                Forgot Password
            </Link> */}
            <div className="signUpBar">
                <p className="signUpText">
                    Sign Up
                </p>
                <button className="signUpButton">
                    <ArrowRightIcon fill="#ffffff" width='34px'
                    height='34px'/>
                </button>
            </div>
        </form>
        <OAuth/>
        <Link to='/sign-in' className='registerLink'>
            Sign In Instead
        </Link>
    </div>
    </>
  )
}

export default SignUp