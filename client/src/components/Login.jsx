//useContext is a react hook that allows a component to access shared data
import React,{useState,useEffect,useContext} from 'react'
import {assets} from '../assets/assets'
import { AppContext } from '../context/AppContext'
import {motion} from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify'


const login = () => {
 
  const [state,setState]=useState('Login')  //initially it will be in login step
  const {setShowLogin ,backendUrl,setToken ,setUser}=useContext(AppContext)

  const [name,setName]=useState('')  //now we to link this state variable to input fields
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')

  const onSubmitHandler=async (e) =>{
    e.preventDefault();

    try{

      if(state==='Login'){
          const {data} = await axios.post(backendUrl + '/api/user/login',{email ,password}) //concatenate the backend url +api/user/login   //we are making api call to login

          if(data.success){  //id data.success=true 
              setToken(data.token)
              setUser(data.user)
              localStorage.setItem('token',data.token)   //saving the token in localstorage 
              setShowLogin(false)
          }else{
            toast.error(data.message)   //err will be display in toast notification
          }
      }else{
         const {data} =await axios.post(backendUrl +'/api/user/register',{name,email ,password}) //api call to register
         if(data.success){  //id data.success=true 
              setToken(data.token)
              setUser(data.user)
              localStorage.setItem('token',data.token)   //saving the token in localstorage 
              setShowLogin(false) //it will hide the registration page 
         
          }else{
            toast.error(data.message)
          }
        }

    }catch (error){
      toast.error(error.message)

    }
  }
  

  useEffect(()=>{
    document.body.style.overflow='hidden'; //this avoid scrolling when the component is present //whenver we write anything in the input field data will be stored in this state var 
    return()=>{
      document.body.style.overflow='unset';
    }
  },[])



  return (
    <div className='fixed  top-0 left-0  right-0 bottom-0 z-10 backdrop-blur-sm 
    bg-black/30 flex justify-center items-center'>

        <motion.form  onSubmit={onSubmitHandler}
        initial={{opacity:0.2,y:50}}
        transition={{duration:0.3}}
        whileInView={{opacity:1,y:0}}
        viewport={{once:true}}

        
        className='relative bg-white p-10 rounded-xl text-slate-500'>
            <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
            <p className='text-sm'> Welcome back! Please sign in to continue</p>

           {state !=='Login' && <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                <img src={assets.user_icon} alt=""/>
                <input onChange={e => setName(e.target.value)} value={name} type="text" className='outline-none text-sm' placeholder="Full Name"  required></input>
            </div> }

             <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src={assets.email_icon} alt=""/>
                <input onChange={e => setEmail(e.target.value)} value={email} type="email" className='outline-none text-sm' placeholder="Email id"  required></input>
            </div>

             <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                <img src={assets.lock_icon} alt=""/>
                <input onChange={e => setPassword(e.target.value)} value={password} type="password" className='outline-none text-sm' placeholder="Password"  required></input>
            </div>

            <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot Password</p>
            <button className="bg-blue-600 w-full text-white py-2 rounded-full " >{state==='Login' ? 'Login' :'Create Account'}</button>

           {state==='Login' ?  <p className='mt-5 text-center'> Don't have an account?
             <span className='text-blue-600 cursor-pointer ' onClick={()=>setState('Sign Up')}> Sign up </span></p>

             :
             <p className='mt-5 text-center'> Don't have an account?
             <span className='text-blue-600 cursor-pointer'onClick={()=>setState('Login')}> Login </span></p>
            }

             <img onClick={()=>setShowLogin(false)}src={assets.cross_icon} alt="" className='absolute top-5 right-5 cursor-pointer'></img>
        </motion.form>
      
    </div>
  )
}

export default login;
