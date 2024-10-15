import React, { useState, useContext } from "react";
import "./Signin.css";
import logo from "../../img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginContext } from "../../context/loginContext";

const SignIn = () => {
  const {setUserLogin} = useContext(loginContext)
   const [ email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

    //Notification Function
    const notifyA = (msg) => {
      toast.error(msg);
    };
  
    const notifyB = (msg) => {
      toast.success(msg);
    };

  const regExEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const postData = () => {
    if (!regExEmail.test(email)) {
      notifyA("Invalid Email");
      return;
    } 
    fetch("https://mern-insta-clone-6l9n.onrender.com/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB("Signed in Successfully");
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setUserLogin(true);
          navigate("/");
        }
        console.log(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };
  return (
    <div className="sign-in">
      <div>
        <div className="login-form">
          <img src={logo} alt="insta-logo" className="insta-logo" />
          <div>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div>
            <input type="submit" id="btn" value="Sign In" onClick={() => {postData()}} />
          </div>
        </div>
        <div className="login-form2">
          Don't have an account ?
          <Link to="/signup">
            <span className="sign-up-link">Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
