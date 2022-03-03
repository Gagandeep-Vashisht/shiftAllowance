import React from "react";

const UserContext = React.createContext({
  users: [],
  addUser: () => {},
  addAllUser: () => {},
  updateUserStatus: () => {},
  deleteUser:()=>{},
});

export default UserContext;
