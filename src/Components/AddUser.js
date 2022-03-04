import classes from "./AddUser.module.css";
import { useState, useRef, useContext } from "react";
import User from "../model/User";
import UserContext from "../store/UserContext";


import { v4 as uuid } from 'uuid';
import { fetchToken } from "../util/storage";
import { FaPray } from "react-icons/fa";


const isEmpty = (value) => value.trim() === "";
const isSixChars = (value) => value.trim().length >= 6;
function isValidEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}
const AddUser = (props) => {
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
  const roleInputRef = useRef();
  const nameInputRef=useRef();
  const userContext = useContext(UserContext);
  const confirmHandler = async (event) => {
    event.preventDefault();
    console.log("CLickked");
    console.log(userContext.users);

    const enteredEmail = emailInputRef.current.value;
    const enteredPass = passInputRef.current.value;
    const enteredRole = roleInputRef.current.value;
    const enteredName=nameInputRef.current.value;
    const enteredEmailIsValid =
      !isEmpty(enteredEmail) && checkIncedo(enteredEmail);
    const enteredPassIsValid = !isEmpty(enteredPass) && isSixChars(enteredPass);
    const enteredRoleIsValid = enteredRole != "none";
    const enteredNameIsValid=enteredName!=="";
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
    
    const date = new Date();
    const formatdate = formatDate(date);

    
   
    const user={
      "username":enteredEmail,
      "password":enteredPass,
      "role":enteredRole,
      "status":"Active",
      "activeFrom":formatdate,
      "name":enteredName,
    }
    // const token=fetchToken();
   
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
  };
    const res=await fetch(`${process.env.REACT_APP_ENDPOINT}/userapi/user`,requestOptions);
    const jsonData=await res.json();
    console.log("user request sent");

    userContext.addUser(
      new User(
        userContext.users.length+1,
        user.name,
        user.activeFrom,
        enteredRole,
        "Active",
        user.email,
      )
    );
    
    console.log(userContext.users);
    emailInputRef.current.value = "";
    passInputRef.current.value = "";
    nameInputRef.current.value="";
    roleInputRef.current.value = "none";
    
    props.onClose();
  };

  const emailControlClasses = `${classes.control} ${
    formInputsValidity.email ? "" : classes.invalid
  }`;
  const nameControlClasses = `${classes.control} ${
    formInputsValidity.name ? "" : classes.invalid
  }`;
  const passControlClasses = `${classes.control} ${
    formInputsValidity.pass ? "" : classes.invalid
  }`;
  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
  return (
    <div className={classes.mar}>
      <h1>ADD USER</h1>
      <hr></hr>
      <form className={classes.form} onSubmit={confirmHandler}>
        <div className="form-group contaier">
          <label for="email" className={(emailControlClasses, classes.txt)}>
            Email address
          </label>
          <input
            id="email"
            ref={emailInputRef}
            type="email"
            className="form-control"
            name="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            required
          />
        </div>
        <div className="form-group contaier">
          <label for="name" className={(nameControlClasses, classes.txt)}>
            Name 
          </label>
          <input
            id="name"
            ref={nameInputRef}
            type="text"
            className="form-control"
            name="name"
            aria-describedby="Name"
            placeholder="Enter Full Name"
            required
          />
        </div>
        {!formInputsValidity.name && <p>Please Enter Name!</p>}
        <div className="form-group">
          <label
            for="password"
            value="password"
            className={(passControlClasses, classes.txt)}
          >
            Password
          </label>
          <input
            id="pass"
            style={{fontWeight:"bold"}}
            ref={passInputRef}
            type="password"
            className="form-control"
            name="pass"
            aria-describedby="passHelp"
            placeholder="Enter Password"
            required
          />
        </div>
        {!formInputsValidity.pass && <p>Invalid Password!</p>}

        <label for="role" className={classes.txt}>
          Role
        </label>
        <select
          name="roles"
          id="roles"
          className="form-control"
          ref={roleInputRef}
          key={new Date()}
        >
          <option value="none" selected disabled hidden>
            Select role
          </option>
          <option value="LEAD">LEAD</option>
          <option value="ADMIN">ADMIN</option>
          <option value="DEVELOPER">DEVELOPER</option>
          {/* <option *ngFor="let r of roles" [value]="r.name">{{r.name}}</option> */}
        </select>
        {!formInputsValidity.role && <p>Select a role!</p>}
        {/* <button type="button" className="btn btn-primary my-3">
          Submit
        </button> */}
        <div className={classes.actions}>
          <button className={classes.submit}>Add</button>
        </div>
      </form>
      <hr />
    </div>
  );
};
export default AddUser;
