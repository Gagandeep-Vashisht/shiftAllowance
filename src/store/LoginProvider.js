import LoginContext from "./LoginContext";
import { useNavigate } from "react-router-dom";
import { saveToken, saveUser } from "../util/storage";

export default function LoginProvider(props)  {
  const navigate = useNavigate();
  const loginMethod = async (data) => {
    console.log(data.email, data.pass);

    const body={
      "username":data.email,
      "password":data.pass
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
  };
  const res= await fetch(`${process.env.REACT_APP_ENDPOINT}/authenticate`, requestOptions)
    const jsonData=await res.json();
    console.log("Inside login provider ");
    if(jsonData.message==='INVALID_CREDENTIALS'){
      data.setMessage("Invalid Email or Password.");
      data.setShowMessage(true);
      return;
    }
    
    console.log(jsonData);
    
    saveToken(jsonData.token);
    const userData=await userDetails(jsonData.token);
    console.log(userData);
    if(userData.status==="Requested"){
      data.setMessage("Your status is Requested,Please wait for the Admin to Accept your request.");
      data.setShowMessage(true);
      return;
    }
    navigate("/home");
    
  };
  return (
    <LoginContext.Provider value={loginMethod}>
      {props.children}
    </LoginContext.Provider>
  );
}

const userDetails=async (token)  =>{
  const requestOptions = {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      // "Acess-Control-Allow-Origin":"*",
      "Authorization": `Bearer ${token}`
    },
};

const res= await fetch(`${process.env.REACT_APP_ENDPOINT}/user`, requestOptions);
const jsondata=await res.json();

console.log(jsondata);
saveUser(jsondata);
console.log("after json data");
  return jsondata;
}

