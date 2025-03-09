import React from 'react'
import { useState } from 'react'
import {toast} from 'react-toastify'
import { Link,useNavigate } from 'react-router-dom'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import { getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import OAuth from '../components/OAuth'
function SignIn() {
    const [showPassword,setShowPassword]=useState(false);
    const [formData,setformData]=useState({
      email:'',
      password:''  
    })
    const {email, password}=formData;

    const navigate=useNavigate()

    const onChange=(e)=>{
        setformData((prevState)=>({
            ...prevState,
            [e.target.id]:e.target.value,

        }))
    }

    const onSubmit=async(e)=>{
        e.preventDefault()

        try{
        const auth =getAuth();
        const userCredential=await signInWithEmailAndPassword(auth,email,password)
       
        if(userCredential.user){
            navigate('/')
        }
          }
          catch(error){
            toast.error('bad user credentials');
          }

    }

  return (
    <>
    <div className='pageContainer'>
        <header>
            <p className='pageHeader'>Welcome Back!</p>
        </header>

        <form onSubmit={onSubmit}> 
            <input type="email" className="emailInput"
            placeholder='Email' id='email' value={email}
            onChange={onChange} />
            <div className="passInputDiv">
                <input type={showPassword ?'text':'password'} 
                className="passwordInput"
                id='password'
                value={password}
                onChange={onChange}
                placeholder='Password'
                 />
                <img src={visibilityIcon} alt="show Password" className="showPassword"
                onClick={()=>setShowPassword((prevState)=> !prevState)} />
            </div>

            <Link to='/forgot-password' className='forgotPasswordLink'>
                Forgot Password
            </Link>
            <div className="signInBar">
                <p className="signInText">
                    Sign In
                </p>
                <button className="signInButton">
                    <ArrowRightIcon fill="#ffffff" width='34px'
                    height='34px'/>
                </button>
            </div>
        </form>
        <OAuth/> 
        <Link to='/sign-up' className='registerLink'>
            Sign Up Instead
        </Link>
    </div>
    </>
  )
}

export default SignIn
