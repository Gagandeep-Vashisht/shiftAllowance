import UserContext from "./UserContext";
import { useState, useReducer } from "react";
import User from "../model/User";

const defaultUserState = {
  users: [],
};
const userReducer = (state, action) => {
  if (action.type === "ADD") {
    let updatedUsers = [];
    var existingUser = false;
    for (var u in state.users) {
      if (u.userId === action.user.userId) {
        existingUser = true;
        break;
      }
    }

    if (!existingUser) {
      state.users.splice(0, 0, action.user);
    }
    console.log(action.user.name);
    console.log(updatedUsers);
    console.log(state.users);
    updatedUsers = [...state.users];

    return {
      users: updatedUsers,
    };
  }
  if (action.type === "UPDATE_USER") {
    let index;

    for (let i = 0; i < state.users.length; i++) {
      if (state.users[i].userId === action.user.userId) {
        index = i;
        console.log("Matched", state.users[i].name);

        break;
      }
    }

    // const newUser = new User(
    //   action.user.userId,
    //   action.user.name,
    //   action.user.activeFrom,
    //   action.user.role,
    //   action.status
    // );
    state.users[index] = action.changedUser;
    const updatedUsers = [...state.users];

    return {
      users: updatedUsers,
    };

  }
  if (action.type === "ADDALL") {
    // let updatedUsers = [];
    

    return {
      users: action.user,
    };
  }
  if (action.type === "DELETE_USER") {
    let updatedUsers = [];
   
    updatedUsers = state.users.filter((e,i)=>e.email!==action.user.email);

    return {
      users: updatedUsers,
    };
  }
  return defaultUserState;
};
export default function UserProvider(props) {
 
  const [userState, dispatchUserAction] = useReducer(
    userReducer,
    defaultUserState
  );
  const addUserHandler = (user) => {
    // console.log("addUser");
    // console.log(user.name);

    dispatchUserAction({ type: "ADD", user: user });
  };
  const addAllHandler = (users) => {
    // console.log("addUser");
    // console.log(user.name);

    dispatchUserAction({ type: "ADDALL", user: users });
  };


  const updateUserHandler = (user, changedUser) => {
    dispatchUserAction({
      type: "UPDATE_USER",
      user: user,
      changedUser: changedUser,
    });
  };
  const deleteUserHandler = (user) => {
    dispatchUserAction({
      type: "DELETE_USER",
      user: user,
      
    });
  };
  const currentContext = {
    users: userState.users,
    addUser: addUserHandler,
    updateUserStatus: updateUserHandler,
    addAllUser: addAllHandler,
    deleteUser:deleteUserHandler,
  };

  return (
    <UserContext.Provider value={currentContext}>
      {props.children}
    </UserContext.Provider>
  );
}
