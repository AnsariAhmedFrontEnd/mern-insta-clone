import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "./CreatePost.css";

const CreatePost = () => {
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false); // New state to handle posting status
  const navigate = useNavigate();

  //Notification Function
  const notifyA = (msg) => {
    toast.error(msg);
  };

  const notifyB = (msg) => {
    toast.success(msg);
  };

  const createPost = useCallback(() => {
    fetch("https://mern-insta-clone-6l9n.onrender.com/createPost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        body,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB("Successfully Posted");
          navigate('/');
        }
        setIsPosting(false); // Reset the posting status
      })
      .catch((err) => {
        console.log(err);
        setIsPosting(false); // Reset the posting status
      });
  }, [body, url, navigate]);

  const postDetails = () => {
    console.log(body, image);
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "mern-insta-clone");
    data.append("cloud_name", "ahmedcloud27");
    fetch("https://api.cloudinary.com/v1_1/ahmedcloud27/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => setUrl(data.url))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (url && !isPosting) {
      setIsPosting(true); // Set the posting status to true
      createPost();
    }
  }, [url, isPosting, createPost]); // Include isPosting in the dependency array

  const loadFile = (event) => {
    const file = event.target.files[0];
    const preview = document.getElementById("file-preview");

    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = function (event) {
        preview.setAttribute("src", event.target.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  return (
    <div className="create-post">
      <div className="post-header">
        <h4 className="heading">Create New Post</h4>
        <button
          id="post-btn"
          onClick={() => {
            if (!isPosting) { // Check if a post is already in progress
              postDetails();
            }
          }}
        >
          Share
        </button>
      </div>
      <div className="main-div">
        <img
          id="file-preview"
          alt="Preview"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Picture_icon_BLACK.svg/1200px-Picture_icon_BLACK.svg.png"
        />
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={(event) => {
            loadFile(event);
            setImage(event.target.files[0]);
          }}
        />
      </div>
      <div className="details">
        <div className="card-header">
          <div className="card-pic">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
          <h5>Ahmed</h5>
        </div>
        <textarea
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
          }}
          type="text"
          placeholder="Write a Caption...."
        />
      </div>
    </div>
  );
};

export default CreatePost;
