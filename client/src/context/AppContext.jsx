import {createContext,useEffect,useState} from  'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

//using the create context make a AppContext variable
export const AppContext=createContext();

//we will create a contextProvider function
//here we will declare state var and fun 
const AppContextProvider=(props)=>{
const [user,setUser]=useState(null);
const[showLogin,setShowLogin]=useState(false); //false huaa to showlogin form disable hojaenga //for login.jsx
const [token,setToken]=useState(localStorage.getItem('token'))    
const [credit,setCredit]=useState(null)

    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const navigate=useNavigate();

    const generateImage = async (prompt) => {
    try {
        const { data } = await axios.post(
            backendUrl + '/api/image/generate-image',
            { prompt, userId: user?._id },
            { headers: { token } }
        );

        if (data.success) {
            // Update both user and credit state
            setUser(prev => ({ ...prev, creditBalance: data.creditBalance }));
            setCredit(data.creditBalance);

            return data.resultImage;
        } else {
            toast.error(data.message);
            // Update credit even if request failed
            setUser(prev => ({ ...prev, creditBalance: data.creditBalance }));
            setCredit(data.creditBalance);

            if (data.creditBalance === 0) {
                navigate('/buy');
            }
        }
    } catch (error) {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
        toast.error(error.message);
    }
};


    const loadCreditsData=async ()=>{
        try{
            const {data}=await axios.get(backendUrl +'/api/user/credits',{headers:{token}})  //call the credit api

            if(data.success){
                setCredit(data.credits)
                setUser(data.user)
            }

        }catch (error){
            console.log(error)
            toast.error(error.message)

        }
    }

    const logout= ()=>{
        localStorage.removeItem('token');
        setToken('')
        setUser(null)
    }
    
    useEffect( ()=>{
        if(token){
            loadCreditsData()  //if the token is true then it will call the loadCreditsData
        }

    },[token]) //we will use the useEffect so that whenenver the token will be change arrow function will be executed token dependency array ke jagha dala hai

    const value={
        user,setUser,showLogin,setShowLogin,backendUrl,token,setToken,credit,setCredit ,logout ,generateImage //then we can acess it in any component
    }


    return (
        <AppContext.Provider value={value}>
            {props.children}
             </AppContext.Provider>
    )

}
export default AppContextProvider

//from this context we can access the variable and function to any component
//in this file we declare our all context component matlab jo hame sare esmy used karna hai
