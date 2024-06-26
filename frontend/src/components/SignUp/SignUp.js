import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../img/logo.png";
import "./SignUp.css";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { loginContext } from "../../context/loginContext";

const SignUp = () => {
  const { setUserLogin } = useContext(loginContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const continueWithGoole = (credentialResponse) => {
    console.log(credentialResponse);
    const jwtDetails = jwtDecode(credentialResponse.credential);
    console.log(jwtDetails);
    fetch("http://localhost:5000/googleLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: jwtDetails.name,
        userName: jwtDetails.name,
        email: jwtDetails.email,
        email_verified: jwtDetails.email_verified,
        clientId: credentialResponse.clientId,
        picture: jwtDetails.picture,
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

  //Notification Function
  const notifyA = (msg) => {
    toast.error(msg);
  };

  const notifyB = (msg) => {
    toast.success(msg);
  };

  const regExEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let regexPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;

  const postData = () => {
    if (!regExEmail.test(email)) {
      notifyA("Invalid Email");
      return;
    } else if (!regexPassword.test(password)) {
      notifyA(
        "A strong password will be of a minimum 8 characters. It must include the following, At least one lowercase alphabet, one uppercase alphabet, one Numeric digit,one special character"
      );
      return;
    }
    fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        userName: userName,
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB(data.message);
          navigate("/signin");
        }
        console.log(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  return (
    <div className="sign-up">
      <div className="form-contaier">
        <div className="form">
          <img src={logo} alt="insta-logo" className="insta-logo" />
          <p className="sign-up-para">
            Sign Up to see photos and videos <br />
            from your friends{" "}
          </p>
          <div>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter Your Full Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter Your User Name"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Choose Your Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <p
            className="sign-up-para"
            style={{ fontSize: "12px", margin: "3px 0px" }}
          >
            By signing up, you agree to our Terms, <br /> privacy policy and
            cookies policy.
          </p>
          <input
            type="submit"
            id="submit-btn"
            value="Sign Up"
            onClick={() => {
              postData();
            }}
          />
          <hr />
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              continueWithGoole(credentialResponse);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>

        <div className="form2">
          <Link to="/signin">
            Already have an account ?{" "}
            <span className="sign-in-link">Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
