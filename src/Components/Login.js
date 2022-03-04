import { useRef, useState, useContext } from "react";
import incedologo from '../util/incedo-logo.png'
import classes from "./Login.module.css";
import LoginContext from "../store/LoginContext";
import { Link, useNavigate } from "react-router-dom";
const isEmpty = (value) => value.trim() === "";
const isSixChars = (value) => value.trim().length >= 6;

function isValidEmail(email) {
  var re = /\S+@\S+\.\S+/;

  return re.test(email);
}
const checkIncedo = (email) => {
  // hfasd@incedoinc.com
  const list = email.split("@");
  if (list[1] === "incedoinc.com") return true;
  return false;
};
const Login = (props) => {
  const context = useContext(LoginContext);
  const [formInputsValidity, setFormInputsValidity] = useState({
    email: true,
    pass: true,
  });
  const [message,setMessage]=useState("");
  const [showMessage,setShowMessage]=useState(false);

  const navigate = useNavigate();
  const emailInputRef = useRef();
  const passInputRef = useRef();

  const confirmHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPass = passInputRef.current.value;

    const enteredEmailIsValid =
      !isEmpty(enteredEmail) &&
      isValidEmail(enteredEmail) &&
      checkIncedo(enteredEmail);
    const enteredPassIsValid = !isEmpty(enteredPass) && isSixChars(enteredPass);

    setFormInputsValidity({
      email: enteredEmailIsValid,
      pass: enteredPassIsValid,
    });

    const formIsValid = enteredEmailIsValid && enteredPassIsValid;
    console.log(formIsValid);
    if (!formIsValid) {
      return;
    }

    // api call
    // passed by context
    context({
      email: enteredEmail,
      pass: enteredPass,
      setMessage:setMessage,
      setShowMessage:setShowMessage,
    });
    // setMessage(f)
    emailInputRef.current.value = "";
    passInputRef.current.value = "";
  };

  const emailControlClasses = `${classes.control} ${
    formInputsValidity.email ? "" : classes.invalid
  }`;
  const passControlClasses = `${classes.control} ${
    formInputsValidity.pass ? "" : classes.invalid
  }`;

  return (
    <>
      <form className={classes.form} onSubmit={confirmHandler}>
        <section className="vh-100 " style={{ backgroundColor: "#508bfc" }}>
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div>
                <h2 className="mb-3" style={{ fontSize: 40 ,color:"white"}}>
                  {" "}
                  SHIFT ALLOWANCE
                </h2>
              </div>
              <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                <div
                  className="card shadow-2-strong"
                  style={{ borderRadius: "1rem" }}
                >
                  <div className="card-body p-5 text-center">
                    <h3 className="mb-4" style={{ fontSize: 25 }}>
                      LOGIN
                    </h3>
                    {showMessage&&<div class="alert alert-danger" role="alert">
                      <label style={{fontSize:13}}>
                          {message}
                      </label>
                    </div>}
                    <div className="form-outline mb-9">
                      <div className={emailControlClasses}>
                        <label className="form-label" htmlFor="email">
                          Your Email
                        </label>
                        <input
                          type="text"
                          id="email"
                          className=" form-control-lg"
                          ref={emailInputRef}
                        />
                        {!formInputsValidity.email && (
                          <p>Please enter a valid email!</p>
                        )}
                      </div>
                    </div>
                    <div className="form-outline mb-4">
                      <div className={passControlClasses}>
                        <label htmlFor="pass" className="form-label">
                          Password
                        </label>
                        <input
                          className=" form-control-lg"
                          type="password"
                          id="pass"
                          ref={passInputRef}
                          style={{fontWeight:"bold"}}
                        />
                        <i className="fa fa-eye" style={{position:"absolute", top:20,right:0,}}></i>
                        {!formInputsValidity.pass && (
                          <p>Please enter a valid pass!</p>
                        )}
                      </div>
                    </div>
                    <button
                      className="btn btn-primary btn-lg btn-block"
                      type="submit"
                    >
                      Login
                    </button>
                  </div>
                  <p>
                    New user?
                    <Link to="/signup">Request Access</Link>
                  </p>
  <div className="incedo-logo" style={{"display":"flex","justifyContent":"center","marginTop":"20px"}}>   <div style={{"marginTop":"15px", fontSize:"11px"}}> <p>Powered by</p></div> <img src={incedologo} width="100" alt="" /></div>
                </div>
                
              </div>
            </div>
          </div>
        </section>
      </form>
    </>
  );
};

export default Login;
