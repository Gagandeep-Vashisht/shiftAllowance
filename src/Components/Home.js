import Login from "./Login";
import {useEffect,useState} from 'react';
import {fetchToken} from '../util/storage';
import HomeScreen from "./HomeScreen";
import  { Navigate } from 'react-router-dom'
function Home() {
const [token,setToken]=useState(""); 
const [user,setUser]=useState("");
  useEffect(()=>{
    // const getToken= fetchToken();
    // setToken(getToken);
    console.log("inside use effect",token)
  },[]);
  if(token!==''){
    const getUser=userDetails(token);

  }  
  return token==="" ? <Login />:<Navigate to="/home"/>;
  // return <Login/>
}

const userDetails=async (token)  =>{
  const requestOptions = {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      "Acess-Control-Allow-Origin":"*",
      "Authorization": `Bearer ${token}`
    },
};
const res= await fetch(`${process.env.REACT_APP_ENDPOINT}/user`, requestOptions);
const jsondata=await res.json();
console.log(jsondata);
console.log("after json data");

}


export default Home;
