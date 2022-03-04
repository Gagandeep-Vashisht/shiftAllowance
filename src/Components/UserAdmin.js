import React, { useState, useContext, useEffect, useRef } from "react";
import UserContext from "../store/UserContext";
import classes from "./UserAdmin.module.css";
import {FaTrashAlt} from "react-icons/fa"
import Modal from "../UI/Modal";
import AddUser from "./AddUser";
import User from "../model/User";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { fetchToken } from "../util/storage";
// import DownArrow from "material-ui/svg-icons/navigation";

const UserAdmin = () => {
  const userContext = useContext(UserContext);

  const [portalOpened, openPortal] = useState(false);
  const [counter, setCounter] = useState(0);
  const [changeData, setChangeData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [sortKey, setSortKey] = useState();
  const [showDialog, setDialog] = useState(false);
  // const [loaded,setLoaded]=useState(false);
  var data = userContext.users;

  const onConfirm = async (data) => {
    var changedUser = null;

    const d = changeData.filter((e) => data.userId === e.userId);
    if (d.length === 1) {
      changedUser = d[0];
    }

    const temp = changeData.filter((e) => data.userId !== e.userId);
    setChangeData(temp);

    if (
      (changedUser != null && changedUser.status === "Requested") ||
      changedUser == null
    ) {
      changedUser = data;
      var newStatus;

      const confirmBox = window.confirm("Do you Want to Make the User Active");
      if (confirmBox === true) {
        newStatus = "Active";
      } else {
        newStatus = "Inactive";
      }

      changedUser.status = newStatus;
    }
    const body = {
      username: changedUser.email,
      activeFrom: changedUser.activeFrom,
      status: changedUser.status,
      name: changedUser.name,
      role: changedUser.role,
      // password: changedUser.password,
    };
    console.log(body);
    const token = fetchToken();
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Acess-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    };
    console.log("before fetch");
    const res = await fetch(
      `${process.env.REACT_APP_ENDPOINT}/userapi/updateUser/${body.username}`,
      requestOptions
    );
    console.log("after fetch");

    userContext.updateUserStatus(
      new User(data.userId, data.name, data.activeFrom, data.role, data.status),
      changedUser
    );

    // setCounter(counter + 1);
  };

  const display = async () => {
    console.log("dasfas");
    setDialog(true);
  };

  const onSubmit = () => {
    console.log("dddddddddd");
    openPortal(true);
  };

  const onClose = () => {
    openPortal(false);
  };

  const sorting = (col,type) => {
    setSortKey(col);
    if(type==='string'){
    if (order === "ASC") {
      const sorted = [...data].sort((a, b) => (a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1));
      userContext.users = sorted;
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...data].sort((a, b) => (a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1));
      userContext.users = sorted;
      setOrder("ASC");
    }
  }
  if(type==='number'){
    if (order === "ASC") {
      const sorted = [...data].sort((a, b) => (parseInt(a[col]) < parseInt(b[col]) ? 1 : -1));
      userContext.users = sorted;
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...data].sort((a, b) => (parseInt(a[col]) > parseInt(b[col]) ? 1 : -1));
      userContext.users = sorted;
      setOrder("ASC");
    }
  }
    console.log(order, sortKey);
  };
  // var changeData = [];
  useEffect(() => {
    console.log("use effect");
    console.log(changeData);
    // setLoaded(false);
    fetchAllUser();
  }, []);

  const fetchAllUser = async () => {
    console.log("inside fetchAlluser");
    const token = fetchToken();
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // "Acess-Control-Allow-Origin":"*",
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await fetch(
      `${process.env.REACT_APP_ENDPOINT}/userapi/getall`,
      requestOptions
    );
    const jsonData = await res.json();
    console.log(jsonData);
    var tempData = [];
    tempData = jsonData.map((e, i) => {
      return {
        userId: `${i + 1}`,
        name: e.name,
        activeFrom: e.activeFrom,
        role: e.role,
        status: e.status,
        email: e.username,
      };
    });

    console.log(tempData);
    data = [];
    userContext.addAllUser(tempData);

    // setLoaded(true);
  };

  const roleChange = (value, element) => {
    const u = new User(
      element.userId,
      element.name,
      element.activeFrom,
      value.target.value,
      element.status,
      element.email
    );

    var flag = false;
    for (var i = 0; i < changeData.length; i++) {
      // console.log(e.userId, u.userId);
      if (changeData[i].userId === u.userId) {
        changeData[i].role = u.role;
        flag = true;
        break;
      }
    }
    if (!flag) {
      changeData.push(u);
    }
    setCounter(counter + 1);
    setChangeData(changeData);

    // console.log(value.target.value, u);
  };

  const statusChange = (value, element) => {
    const u = new User(
      element.userId,
      element.name,
      element.activeFrom,
      element.role,
      value.target.value,
      element.email
    );
    console.log(u);
    var usePresent = false;
    for (var i = 0; i < changeData.length; i++) {
      if (changeData[i].userId === u.userId) {
        changeData[i].status = u.status;
        usePresent = true;
        break;
      }
    }
    if (!usePresent) {
      changeData.push(u);
    }
    setCounter(counter + 1);
    setChangeData(changeData);
  };

  const checkConfirm = (element) => {
    for (var i = 0; i < changeData.length; i++) {
      if (changeData[i].userId === element.userId) return false;
    }

    return true;
  };
  const onDelete=async (data)=>{
    const body=data.email;
    const token=fetchToken();
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', "Authorization":`Bearer ${token}` },
      // body:JSON.stringify(body)
    
    
  };
  userContext.deleteUser(data);

  console.log(`${process.env.REACT_APP_ENDPOINT}/userapi/deleteuser/${data.email}`);
    const res=[];
    try{
     res=await fetch(`${process.env.REACT_APP_ENDPOINT}/userapi/deleteuser/${data.email}`,requestOptions);
    }catch(e){
      console.log(e);
    }

    const jsonData=await res.json();
    console.log("user deleted",jsonData);
    // data=userContext.users;
  }
  return (
    <div className={classes.mar}>
      <div className={classes.txt}>User Administration</div>

      {
        <div className={"table  table-responsive "}>
          <table className="table table-light table-hover  ">
            <thead>
              <tr className="table-info">
                <th
                  onClick={() => {
                    sorting("userId",'number');
                  }}
                >
                  {" "}
                  <div type="button">
                    User Id{" "}
                    {"userId" === sortKey ? (
                      "ASC" === order ? (
                        <AiFillCaretUp />
                      ) : (
                        <AiFillCaretDown></AiFillCaretDown>
                      )
                    ) : (
                      <AiFillCaretUp />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => {
                    sorting("name",'string');
                  }}
                >
                  <div type="button">
                    Name{" "}
                    {"name" === sortKey ? (
                      "ASC" === order ? (
                        <AiFillCaretUp />
                      ) : (
                        <AiFillCaretDown></AiFillCaretDown>
                      )
                    ) : (
                      <AiFillCaretUp />
                    )}
                  </div>
                </th>
                <th> Active From </th>
                <th> Role </th>
                <th> Status</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {data.map((element) => (
                <tr className="table-success">
                  <td> {element.userId} </td>
                  <td> {element.name} </td>
                  <td> {element.activeFrom}</td>
                  <td>
                    {
                      <select
                        id="role"
                        name="role"
                        onChange={(e) => roleChange(e, element)}
                        key={element.userId}
                      >
                        <option selected hidden>
                          {element.role}
                        </option>

                        <option value="LEAD">LEAD</option>
                        <option value="DEVELOPER">DEVELOPER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    }
                  </td>
                  
                  <td>
                    {
                      <select
                        id="status"
                        key={element.userId}
                        name="status"
                        onChange={(e) => statusChange(e, element)}
                      >
                        <option selected disabled hidden value={element.status}>
                          {element.status}
                        </option>
                        {/* <option value="Requested">Requested</option> */}

                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    }
                  </td>
                  {
                    <td>
                      <button
                        onClick={() => {
                          onConfirm(element);
                        }}
                        disabled={
                          element.status === "Requested"
                            ? false
                            : checkConfirm(element)
                        }
                        className={
                          element.status === "Requested"
                            ? "btn btn-success btn-sm"
                            : !checkConfirm(element)
                            ? "btn btn-success btn-sm"
                            : "btn btn-sm"
                        }
                      >
                        Confirm
                      </button>
                      <span type='button' onClick={()=>onDelete(element)}>
                        <FaTrashAlt style={{color:"red"}} className="mx-2"/>
                      </span>
                    </td>
                  }
                    
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
      {portalOpened && (
        <Modal onClose={onClose}>
          <AddUser onClose={onClose}></AddUser>
        </Modal>
      )}
      <button className={classes.addButton} onClick={onSubmit}>
        Add
      </button>
      
    </div>
  );
};
export default UserAdmin;
