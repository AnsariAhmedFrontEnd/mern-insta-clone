import React from "react";
import "./PostDetails.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PostDetails = ({ item, toggleDetails }) => {
  const navigate = useNavigate();
  const removePost = (postId) => {
    if (window.confirm("Do You Really Want to Delete This Post?")) {
      fetch(`http://localhost:5000/deletePost/${postId}`, {
        method: "delete",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          toggleDetails();

          navigate("/");
          notifyB(result.message);
        });
    }
  };

  const notifyB = (msg) => {
    toast.success(msg);
  };

  return (
    <div className="show-comments">
      <div className="container">
        <div className="post-pic">
          <img src={item.photo} alt="" />
        </div>
        <div className="details">
          <div
            className="card-header"
            style={{ borderBottom: "1px solid #00000029" }}
          >
            <div className="card-pic">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
            <h5>{item.postedBy.name}</h5>
            <div className="delete-post" onClick={() => removePost(item._id)}>
              <span className="material-symbols-outlined">delete</span>
            </div>
          </div>
          <div
            className="comment-section"
            style={{ borderBottom: "1px solid #00000029" }}
          >
            {item.comments.map((comment) => {
              return (
                <p className="comm">
                  <span className="commentor" style={{ fontWeight: "bolder" }}>
                    {comment.postedBy.name}{" "}
                  </span>
                  <span className="comment-text">{comment.comment}</span>
                </p>
              );
            })}
          </div>
          <div className="card-content">
            <p>{item.likes.length} Likes</p>
            <p>{item.body}</p>
          </div>
          <div className="add-comment">
            <span className="material-symbols-outlined">mood</span>
            <input
              type="text"
              placeholder="Add a comment"
              //   value={comment}
              //   onChange={(e) => {
              //     setComment(e.target.value);
              //   }}
            />
            <button
              className="comment"
              //   onClick={() => {
              //     makeComment(comment, item._id);
              //     toggleComments();
              //   }}
            >
              Post
            </button>
          </div>
        </div>
      </div>
      <div
        className="close-comment"
        onClick={() => {
          toggleDetails();
        }}
      >
        <span className="material-symbols-outlined material-symbols-outlined-comment">
          close
        </span>
      </div>
    </div>
  );
};

export default PostDetails;
