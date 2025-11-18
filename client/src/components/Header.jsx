import React ,{useContext} from 'react'
import {assets} from '../assets/assets'
import { motion } from "motion/react"
import {AppContext} from'../context/AppContext'
import{useNavigate} from 'react-router-dom'


const Header =() => {
   const{user,setShowLogin}=useContext(AppContext)
   const navigate=useNavigate()

   const onClickHandler=()=>{
    if(user){ //if the user is available then ham usko navigate karengy result page par uske liye hamne navigate used kiya
      navigate('/result')
    }
    else{
      setShowLogin(true)  //setshowlogin true hojaenga toh they will show the login page
    }

  }
  return (
    <motion.div className='flex flex-col justify-centre items-center text-centre my-20'
    initial={{opacity:0.2,y:100}} // define the starting state of the element before animation 
    transition={{duration:1}} //sets the animation timing it will take 1 sec
    whileInView={{opacity:1,y:0}} //defines the state of the element when it comes into viewport
    viewport={{once:true}}> 
    


         <motion.div className='text-stone-500 inline-flex text-center gap-2 bg-white px-6 py-1 rounded-full border border-neutral-500'
         initial={{opacity:0,y:-20}}  
         transition={{delay:0.2,duration:0.8}} 
         animate={{opacity:1,y:0}}
         //whileInView={{opacity:1,y:0}} 
         //viewport={{once:true}}
         >
            <p>Best text to image  generator</p>
            <img src={assets.star_icon} alt=""/>
         </motion.div>

         <motion.h1 className='text-4xl max-w-[300px] sm:text-7xl sm:max-w-[590px] mx-auto mt-10 text-center' >Turn text to 
          <br/> <span  className='text-blue-500 inline-flex items-center justify-center gap-2'
          initial={{opacity:0}}
          animate={{opacity:1}}
          transition={{delay:0.4,duration:2}}
          > image </span>  ,in seconds.</motion.h1>

          <motion.p className='text-center max-w-xl mx-auto mt-5'
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          transition={{delay:0.6,duration:0.8}}
          >Unleash your creativity with AI. Turn your imagination into visual art in seconds – just type,
             and watch the magic happen.</motion.p>
             
             <motion.button onClick={onClickHandler}
             className='sm:text-lg text-white bg-black w-auto mt-8 px-12 py-2.5 flex items-center gap-2 rounded-full'
             whileHover={{scale:1.05}}
             whileTap={{scale:0.95}}
             initial={{opacity:0}}
             animate={{opacity:1}}
             transition={{default:{duration:0.5},opacity:{delay:0.8,duration:1}}}
             > 
              Generate Images
              <img className='h-6' src={assets.star_group} alt=""></img>
             </motion.button>


      <motion.div 
       initial={{opacity:0}}
       animate={{opacity:1}}
       transition={{delay:1,duration:1}}

      className='flex flex-wrap justify-center mt-16 gap-3'  >
        {Array(6).fill('').map((item,index)=>(
          <motion.img 
          whileHover={{scale:1.05,duration:0.1}}
          className='rounded hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-10'
          src={index%2===0 ? assets.sample_img_2 :assets.sample_img_1} alt="" key={index} width={70}/>

        ))}
      </motion.div>

      <motion.p 
      initial={{opacity:0}}
      animate={{opacity:1}}
      transition={{delay:1.2 ,duration:0.8}}
      
      className='mt-2 text-neutral-600'> Generated images from imagify</motion.p>
    </motion.div> // esmy motion framer used karna hai isliye motion.div
  )
}


export default Header
