
import React, { useState } from 'react';
import {  signInWithEmailAndPassword } from "firebase/auth";
import logo from './logo.svg';
import './App.css';
import  *as firebase from "firebase/app"
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup, } from "firebase/auth";
import {  signOut } from "firebase/auth";
import {  createUserWithEmailAndPassword } from "firebase/auth";
import {  updateProfile } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";



firebase.initializeApp(firebaseConfig);



function App() {

  const [newUser,setNewUser] =useState(false);
const [user, setUser] = useState({
  isSignedIn: false,
  name :"",
  newUser:false,
  email :"",
  password :"",
  photo :"",
  error :"",
  success:false
})

  const gglProvider = new GoogleAuthProvider();
  const fbProvider = new FacebookAuthProvider();

const handleSignIn = ()=>{
  const auth = getAuth();
signInWithPopup(auth, gglProvider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const {displayName,photoURL,email} = result.user;

         const signInUser ={
           isSignedIn :true,
name : displayName,
email: email,
photo:photoURL,

         }
setUser(signInUser);
    console.log(displayName,photoURL,email);
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
   
  });

  
}
const handleSignOut=() => {
  const auth = getAuth();
signOut(auth).then(() => {
  const signOutUser = {
    isSignedIn : false,
    name : "",
    email:""
  }
  setUser(signOutUser);
  console.log('click')
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
});
  
}
const handleFbSignIn = () => {
  const auth = getAuth();
  signInWithPopup(auth, fbProvider)
    .then((result) => {
      // The signed-in user info.
      const user = result.user;
  
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
  console.log('fb user',user);
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = FacebookAuthProvider.credentialFromError(error);
  
      // ...
    });
}

const handleChange=(event) => {
 let isFieldValid =true;
  
  if(event.target.name ==="email"){
    isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
   
  }

  if(event.target.name ==="password") {
const isPassWordValid = event.target.value.length >6
const passHasNumber=/\d{1}/.test(event.target.value)
isFieldValid=isPassWordValid && passHasNumber;
  }

  if( isFieldValid){
   const newUserInfo ={...user};
   newUserInfo[event.target.name] = event.target.value;
   setUser(newUserInfo);
  }
}


const handleSubmit=(event) => {
  console.log(user.email,user.password)
if (newUser && user.email && user.password){
  const auth = getAuth();
createUserWithEmailAndPassword(auth, user.email, user.password)
  .then(res => {
    // Signed in 
    const newUserInfo = {...user};
    newUserInfo.error ="";
    newUserInfo.success=true;
    setUser(newUserInfo)
    UpdateUserName(user.name)
    //const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    //const errorCode = error.code;
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success=false;
    //const errorMessage = error.message;
    // ..
    //console.log(errorCode, errorMessage)
    setUser(newUserInfo);
   
  });
}
if(!newUser && user.email &&user.password){
  const auth = getAuth();
  signInWithEmailAndPassword(auth, user.email, user.password)
    .then(res=>{
      const newUserInfo = {...user};
      newUserInfo.error ="";
      newUserInfo.success=true;
      setUser(newUserInfo)
      console.log('sign in user info',res.user)
    })
    
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}
event.preventDefault();
}

const UpdateUserName=name=>{
  const auth = getAuth();
  updateProfile(auth.currentUser, {
    displayName: name,
     
  }).then(() => {
    // Profile updated!
    // ...
    console.log('user nm')
  }).catch((error) => {
    // An error occurred
    // ...
  });
}
  return (
    <div className="App">
     
     {
       user.isSignedIn? <button onClick={handleSignOut} >Sign Out</button> :
       <button onClick={handleSignIn} >Sign In</button> 
     
     }
       <br/>
    <button onClick={handleFbSignIn}>Login Using Fb</button>
     {  
       user.isSignedIn && 
       <div>
       <p>Welcome, {user.name}</p>
       <p>Your email : {user.email}</p>

       <img src={user.photo} alt =""></img>
       </div>
     }
<h1>Our own Authentication</h1>
<input type="checkbox" name="newUser" onChange={()=>setNewUser(!newUser)}/>
<label htmlFor = "newUser">New User Sign Up</label>
     <form onSubmit={handleSubmit}>
     
     
    {newUser &&<input type="text" name="name" onBlur={handleChange} placeholder="Name" />} <br></br>
     <input type="email" name="email"onBlur={handleChange}placeholder="Enter your email" required/> <br/> <br/>
     <input type="password" name="password" onBlur={handleChange} placeholder="Enter your password" required /> 
   <br/>
   <input type="Submit" value={newUser?'sign Up': "sign In"}></input>
     </form>
     <p style={{color:"red"}}>{user.error}</p>
    {user.success &&<p style={{color:"Green"}}>User {newUser ?'Create': 'logged in'} Successfully</p> }
    </div>
  );
}

export default App;
