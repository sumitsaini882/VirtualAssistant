import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Customize from "./pages/Customize";
import { userDataContext } from "./context/UserContext.jsx";
import Customize2 from "./pages/Customize2.jsx";
import Home from "./pages/Home.jsx";
import History from "./pages/History";

function App() {
  const {userData,setUserData} = useContext(userDataContext)
  return (
    <Routes>
      <Route path="/" element={(userData?.assistantImage  &&  userData?.assistantName)? <Home /> :<Navigate to={"/customize"}/> } />
      <Route path="/signup" element={!userData?<SignUp />:<Navigate to={"/"}/> } />
      <Route path="/signin" element={!userData?<SignIn />:<Navigate to={"/"}/> } />
      <Route path="/customize" element={userData?<Customize /> :<Navigate to={"/signup"}/> } />
      <Route path="/customize2" element={userData?<Customize2 /> :<Navigate to={"/signup"}/> } />
      <Route path="/history" element={<History />} />
    </Routes>
  );
}

export default App;
