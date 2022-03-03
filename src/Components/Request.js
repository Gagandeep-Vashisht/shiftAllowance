import { useNavigate } from "react-router-dom";
import classes from "./Login.module.css"
const Request=()=>{
    const navigate=useNavigate();
   
   
    return (
        <>
        <div className={classes.popup}>
    <h3>Request Sent</h3>
    <p>
      Your Request has been sent. Please wait till it is accepted.
    </p>

<button 
className="btn btn-info"
onClick={()=>{
  navigate("/");
}}>
  OK
  </button>

  </div></>
    );
}
export default Request;