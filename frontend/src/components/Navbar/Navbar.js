import React, { useContext } from "react";
import logo from "../../img/logo.png";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { loginContext } from "../../context/loginContext";

const Navbar = ({ login }) => {
  const navigate = useNavigate();
  const { setModalOpen, setUserLogin } = useContext(loginContext);

  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (login || token || !setUserLogin) {
      return (
        <>
          <Link to="/profile" key="profile">
            <li>Profile</li>
          </Link>
          <Link to="/createPost" key="create-post">
            <li>Create Post</li>
          </Link>
          <Link to="/followingpost" key="my-following-post">
            <li>My Following Posts</li>
          </Link>
          <Link to={""} key="logout">
            <button
              className="primary-btn"
              onClick={() => {
                setModalOpen(true);
              }}
            >
              Log Out
            </button>
          </Link>
        </>
      );
    } else {
      return (
        <>
          <Link to="/signin" key="sign-in">
            <li>Sign In</li>
          </Link>
          <Link to="/signup" key="sign-up">
            <li>Sign Up</li>
          </Link>
        </>
      );
    }
  };

  const loginStatusMobile = () => {
    const token = localStorage.getItem("jwt");
    if (login || token || setUserLogin) {
      return (
        <>
          <Link to="/" key="home">
            <li>
              <span className="material-symbols-outlined">home</span>
            </li>
          </Link>
          <Link to="/profile" key="profile-mobile">
            <li>
              <span className="material-symbols-outlined">account_circle</span>
            </li>
          </Link>
          <Link to="/createPost" key="create-post-mobile">
            <li>
              <span className="material-symbols-outlined">add_circle</span>
            </li>
          </Link>
          <Link to="/followingpost" key="following-post-mobile">
            <li>
              <span className="material-symbols-outlined">explore</span>
            </li>
          </Link>
          <Link to={""} key="logout-mobile">
            <li
              onClick={() => {
                setModalOpen(true);
              }}
            >
              <span className="material-symbols-outlined">logout</span>
            </li>
          </Link>
        </>
      );
    } else {
      return (
        <>
          <Link to="/signin" key="sign-in-mobile">
            <li>Sign In</li>
          </Link>
          <Link to="/signup" key="sign-up-mobile">
            <li>Sign Up</li>
          </Link>
        </>
      );
    }
  };

  return (
    <div className="navbar">
      <img
        id="insta-logo"
        src={logo}
        alt="Insta Logo"
        onClick={() => {
          navigate("/");
        }}
      />
      <ul className="nav-menu">{loginStatus()}</ul>
      <ul className="nav-mobile">{loginStatusMobile()}</ul>
    </div>
  );
};

export default Navbar;
