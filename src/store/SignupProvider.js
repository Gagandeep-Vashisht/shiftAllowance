import SignupContext from "./SignupContext";
import { useNavigate } from "react-router-dom";
export default function SignupProvider(props) {
  const navigate = useNavigate();
  const signupMethod = async (data) => {
    
    console.log(data.email, data.pass, data.role,data.name);
    const user={
      username:data.email,
      name:data.name,
      password:data.pass,
      role:data.role,
      status:"Requested",
      activeFrom:formatDate(new Date())
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
  };
    const res=await fetch(`${process.env.REACT_APP_ENDPOINT}/userapi/user`,requestOptions);
    // const jsonData=await res.json();
    console.log("user request sent",res.message);
    
    
    // props.setMessage(jsonData);
    // props.setShowMessage(true);
  };
  
  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  // const onsRequest(){
  //   navigate("/");

  // }
  return (
    <SignupContext.Provider value={signupMethod}>
      {props.children}
    </SignupContext.Provider>
  );
}
