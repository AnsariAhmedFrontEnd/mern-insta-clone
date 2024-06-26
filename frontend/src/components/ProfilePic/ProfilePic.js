import React, { useState, useEffect, useRef, useCallback } from "react";

const ProfilePic = ({ chanageProfile }) => {
  const hiddenFileInput = useRef(null);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  const postDetails = useCallback(() => {
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
  }, [image]);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const postPic = useCallback(() => {
    fetch("http://localhost:5000/uploadProfilePic", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        chanageProfile();
        window.location.reload();
      })
      .catch((err) => console.log(err));
  }, [url, chanageProfile]);

  useEffect(() => {
    if (image) {
      postDetails();
    }
  }, [image, postDetails]);

  useEffect(() => {
    if (url) {
      postPic();
    }
  }, [url, postPic]);

  return (
    <div className="profile-pic darkBg">
      <div className="change-pic centered">
        <div>
          <h2>Change Profile Photo</h2>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            className="upload-btn"
            style={{ color: "#0095f6" }}
            onClick={handleClick}
          >
            Upload Photo
          </button>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={hiddenFileInput}
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            className="upload-btn"
            style={{ color: "#ED4956" }}
            onClick={() => {
              setUrl(null);
              postPic();
            }}
          >
            Remove Current Photo
          </button>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
            onClick={chanageProfile}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePic;