import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import { useParams } from "react-router-dom";
const UserProfile = () => {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const { userid } = useParams();
  const [user, setUser] = useState("");
  const [isFollow, setIsFollow] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`https://mern-insta-clone-6l9n.onrender.com/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUser(result.user);
        setPosts(result.posts);
        if (
          result.user.followers.includes(
            JSON.parse(localStorage.getItem("user"))._id
          )
        ) {
          setIsFollow(true);
        }
      });
  }, [userid, isFollow]);

  //To Follow User
  const followUser = (userId) => {
    fetch("https://mern-insta-clone-6l9n.onrender.com/follow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {console.log(data)
        setIsFollow(true)
      });
  };

  //To unfollow User
  const unFollowUser = (userId) => {
    fetch("https://mern-insta-clone-6l9n.onrender.com/unfollow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {console.log(data)
        setIsFollow(false)
      });
  };

  return (
    <div className="profile">
      <div className="profile-frame">
        <div className="profile-pic">
          <img
            src={user.Photo ? user.Photo : picLink}
            alt=""
          />
        </div>
        <div className="profile-data">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1>{user.name}</h1>
            <button
              className="follow-btn"
              onClick={() => {
                if (isFollow) {
                  unFollowUser(user._id);
                } else {
                  followUser(user._id);
                }
              }}
            >
              {isFollow ? "Unfollow" : "Follow"}
            </button>
          </div>
          <div className="profile-info">
            <p>{posts.length} Posts</p>
            <p>{user.followers ? user.followers.length : "0"} Followers</p>
            <p>{user.followings ? user.followings.length : "0"} Following</p>
          </div>
        </div>
      </div>
      <hr className="hr" />
      <div className="gallery">
        {posts.map((post) => {
          return (
            <img
              key={post._id}
              src={post.photo}
              className="item"
              alt=""
              // onClick={() => {
              //   console.log(pics);
              //   toggleDetails(pics);
              // }}
            />
          );
        })}
      </div>
      {/* {show && <PostDetails item={posts} toggleDetails={toggleDetails} />} */}
    </div>
  );
};

export default UserProfile;
