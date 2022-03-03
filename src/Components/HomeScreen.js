import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashBoard from "./Dashboard";

import UserAdmin from "./UserAdmin";
import { clearStorage, fetchUser } from "../util/storage";
// import Navbar from "./Navbar";
const HomeScreen = () => {
  const navigate = useNavigate();

  const [showDashBoard, setDashBoard] = useState(true);
  const user = fetchUser();
  console.log(user);
  const logOut=()=>{
console.log("logout pressed")
                clearStorage();
                navigate('/');
  }
  return (
    <>
      {/* <Navbar></Navbar> */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-info">
        <div className="container-fluid">
          <span className="navbar-brand ml-1"><h3>Shift Allowance</h3></span>
         
         
          <div className="collapse navbar-collapse" id="navbarCollapse">
         { (user!==null &&user.role==='ADMIN') && <div className="mx-1">
              
              <span type="button"
                onClick={() => {
                  setDashBoard(false);
                }}
                style={!showDashBoard?{color:"white"}:{}}
              >
                User Administration
              </span>

              <span type="button"
                className="mx-3 font-weight-bold"
                style={showDashBoard?{color:"white"}:{}}
                
                onClick={() => {
                  setDashBoard(true);
                }}
              >
                Allowance DashBoard
              </span>
            
            </div>}
            <div className="navbar-nav ms-auto">
              <button  type='button' className="btn btn-lg btn-danger"
              onClick={logOut}>
               {user===null?"LOGIN": "LOGOUT"}
              </button>
            </div>
          </div>
        </div>
      </nav>
      { user!==null && showDashBoard ? <DashBoard></DashBoard> :user!==null? <UserAdmin></UserAdmin>:<div>Not loged In</div>}
            
    </>
  );
};

export default HomeScreen;
