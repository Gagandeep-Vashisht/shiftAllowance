import { useContext, useRef, useState } from "react";
import Card from "../UI/Card.js";
import classes from "./Login.module.css";
import Request from "./Request.js";
import { Link , useNavigate} from "react-router-dom";
import SignupContext from "../store/SignupContext";
import Modal from "../UI/Modal.js";
const isEmpty = (value) => value.trim() === "";
const isSixChars = (value) => value.trim().length >= 6;
function isValidEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}
const Signup = (props) => {
  const navigate=useNavigate();
  const [showModal, setModal]=useState(false);
  const context = useContext(SignupContext);
  const [formInputsValidity, setFormInputsValidity] = useState({
    email: true,
    pass: true,
    role: true,
    name:true,
  });
  const checkIncedo = (email) => {
    // hfasd@incedoinc.com
    const list = email.split("@");
    if (list[1] === "incedoinc.com") return true;
    return false;
  };
  const emailInputRef = useRef();
  const passInputRef = useRef();
  const nameInputRef=useRef();
  const roleInputRef = useRef();
  const confirmHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPass = passInputRef.current.value;
    const enteredName=nameInputRef.current.value;
    const enteredRole = roleInputRef.current.value;
    const enteredEmailIsValid =
      !isEmpty(enteredEmail) &&
      isValidEmail(enteredEmail) &&
      checkIncedo(enteredEmail);
    const enteredPassIsValid = !isEmpty(enteredPass) && isSixChars(enteredPass);
    const enteredRoleIsValid = enteredRole !== "none";
    const enteredNameIsValid=enteredName!=='';
    setFormInputsValidity({
      email: enteredEmailIsValid,
      pass: enteredPassIsValid,
      role: enteredRoleIsValid,
      name:enteredNameIsValid,
    });

    const formIsValid =
      enteredEmailIsValid && enteredPassIsValid && enteredRoleIsValid && enteredNameIsValid;
    console.log(formIsValid);
    if (!formIsValid) {
      return;
    }
    
    context({
      email: enteredEmail,
      pass: enteredPass,
      role: enteredRole,
      name:enteredName,
    });
    setModal(true);

    emailInputRef.current.value = "";
    passInputRef.current.value = "";
    nameInputRef.current.value="";
    roleInputRef.current.value = "none";
  };

  const emailControlClasses = `${classes.control} ${
    formInputsValidity.email ? "" : classes.invalid
  }`;
  const passControlClasses = `${classes.control} ${
    formInputsValidity.pass ? "" : classes.invalid
  }`;
  const nameControlClasses = `${classes.control} ${
    formInputsValidity.name ? "" : classes.invalid
  }`;

  return (
   
<>
<form className={classes.form} onSubmit={confirmHandler}>
<section className="vh-100 gradient-custom" style={{backgroundColor: "#564787"}}>
  <div className="container py-7 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
  <div>
  <h2 className="mb-1" style={{color:"white",fontSize:40}}> SHIFT ALLOWANCE</h2>
     
  </div >
      <div className="col-12 col-md-8 col-lg-6 col-xl-5" >
        <div className="card shadow-2-strong" style={{borderRadius: "1rem", backgroundColor: "#bec5ad"}}>
          <div className="card-body p-4 text-center">

            <h3 className="mb-4">REQUEST</h3>

            <div className="form-outline mb-9">
              
            <div className={emailControlClasses}>
      <label className="form-label" htmlFor="email">Your Email</label>
      <input type="text" id="email" className=" form-control-lg" ref={emailInputRef} />
      {!formInputsValidity.email && <p>Please enter a valid company emailId!</p>}

    </div>
            </div>
<div className="form-outline mb-2">
         
         <div className={nameControlClasses}>
 <label htmlFor="name" className="form-label">Name</label>
 <input className=" form-control-lg" type="text" id="name" ref={nameInputRef} />
 {!formInputsValidity.name && <p>Please enter your name!</p>}


</div>
</div>
            <div className="form-outline mb-4">
         
              <div className={passControlClasses}>
      <label htmlFor="pass" className="form-label">Password</label>
      <input className=" form-control-lg" style={{fontSize:10,fontFamily:'bold'}} type="password" id="pass" ref={passInputRef} />
      {!formInputsValidity.pass && <p>Please enter a valid pass!</p>}


    </div>
    </div>
    

            <label className="form-label" for="roles"><b>Choose a role: </b></label>
  <div>
    <select name="roles" id="roles" className="form-select-lg" style={{borderStyle: "solid"}} aria-label="Default select example" ref={roleInputRef} key={new Date()}>
      <option value="none" selected disabled hidden>
        Select an Option
      </option>
      <option value="LEAD">LEAD</option>
      <option value="ADMIN">ADMIN</option>
      <option value="DEVELOPER">DEVELOPER</option>
    </select>
    {!formInputsValidity.role && <p>Please select a role!</p>}
  </div>
            <button className={`${classes.reqbtn} btn btn-primary btn-lg btn-block mt-5`}  id='reqbtn' type="submit">REQUEST</button>

          </div>
        <p>
    Already a user?
    <Link to="/" >LOGIN</Link>
  </p>
        </div>
      </div>
    </div>
  </div>
</section>
</form>
{ showModal &&

<Modal onClose={()=>{setModal(false)}}>
    <Request></Request>
</Modal>

}
</>

  );
};

export default Signup;
