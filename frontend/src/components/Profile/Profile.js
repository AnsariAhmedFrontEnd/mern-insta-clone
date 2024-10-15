import React, { useState, useEffect } from "react";
import "./Profile.css";
import PostDetails from "../PostDetails/PostDetails";
import ProfilePic from "../ProfilePic/ProfilePic";
const Profile = () => {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const [pic, setPic] = useState([]);
  const [show, setShow] = useState(false);
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);

  const [changePic, setChangePic] = useState(false);

  // To show and hide post Details

  const toggleDetails = (posts) => {
    if (show) {
      setShow(false);
      console.log("hide");
    } else {
      setShow(true);
      console.log("show");
      setPosts(posts);
    }
  };

  useEffect(() => {
    fetch(
      `https://mern-insta-clone-6l9n.onrender.com/user/${
        JSON.parse(localStorage.getItem("user"))._id
      }`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setPic(result.posts);
        setUser(result.user);
      });
  }, []);

  const chanageProfile = () => {
    if (changePic) {
      setChangePic(false);
    } else {
      setChangePic(true);
    }
  };

  return (
    <div className="profile">
      <div className="profile-frame">
        <div className="profile-pic">
          <img
            onClick={() => {
              chanageProfile();
            }}
            src={user.Photo ? user.Photo : picLink}
            alt=""
          />
        </div>
        <div className="profile-data">
          <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
          <div className="profile-info">
            <p>{pic ? pic.length : "0"} Posts</p>
            <p>{user.followers ? user.followers.length : "0"} Followers</p>
            <p>{user.following ? user.following.length : "0"} Following</p>
          </div>
        </div>
      </div>
      <hr className="hr" />
      <div className="gallery">
        {pic.map((pics) => {
          return (
            <img
              key={pics._id}
              src={pics.photo}
              className="item"
              alt=""
              onClick={() => {
                console.log(pics);
                toggleDetails(pics);
              }}
            />
          );
        })}
      </div>
      {show && <PostDetails item={posts} toggleDetails={toggleDetails} />}
      {changePic && <ProfilePic chanageProfile={chanageProfile} />}
    </div>
  );
};

export default Profile;