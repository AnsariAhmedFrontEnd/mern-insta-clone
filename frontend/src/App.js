import React, { useState } from "react";
import "./App.css";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp/SignUp";
import SignIn from "./components/SignIn/SignIn";
import Profile from "./components/Profile/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreatePost from "./components/CreatePost/CreatePost";
import { loginContext } from "./context/loginContext";
import Modal from "./components/Modal/Modal";
import UserProfile from "./components/UserProfile/UserProfile";
import MyFollowingPosts from "./components/MyFollowingPost/MyFollowingPost";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const [userLogin, setUserLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <BrowserRouter>
      <div className="App">
        <GoogleOAuthProvider clientId="746940978049-5aljkluv62vk8b6cb1er4ms0g96ijic4.apps.googleusercontent.com">
          <loginContext.Provider value={{ setUserLogin, setModalOpen }}>
            <Navbar login={userLogin} />
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/signup" element={<SignUp />}></Route>
              <Route path="/signin" element={<SignIn />}></Route>
              <Route exact path="/profile" element={<Profile />}></Route>
              <Route path="/createPost" element={<CreatePost />}></Route>
              <Route path="/profile/:userid" element={<UserProfile />}></Route>
              <Route
                path="/followingpost"
                element={<MyFollowingPosts />}
              ></Route>
            </Routes>
            <ToastContainer theme="dark" />
            {modalOpen && <Modal setModalOpen={setModalOpen} />}
          </loginContext.Provider>
        </GoogleOAuthProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
