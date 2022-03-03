
const fetchToken=()=>{

 const token=localStorage.getItem("TOKEN");
 if(token==='' || token ==null){
    return '';
 }
 console.log("Inside fetchUser",token);
 return (token);

}

const saveToken=(token)=>{

    console.log("Inside save token",token);
    localStorage.setItem("TOKEN",(token));
}

const saveUser=(user)=>{
    localStorage.setItem("USER",JSON.stringify(user));
}
const fetchUser=()=>{
    const user=localStorage.getItem("USER");
    console.log(user);
    return JSON.parse(user);
}
const clearStorage=()=>{
    localStorage.clear();
}


export  {fetchToken,saveToken,saveUser,fetchUser,clearStorage};
