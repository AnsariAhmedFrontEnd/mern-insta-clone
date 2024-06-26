import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Home.css";

const Home = () => {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [item, setItem] = useState([]);
  const limitRef = useRef(10);
  const skipRef = useRef(0);
  const fetchingRef = useRef(false); // Ref to keep track of ongoing fetch requests
  const navigate = useNavigate();

  const notifyB = (msg) => {
    toast.success(msg);
  };

  const fetchPosts = useCallback(() => {
    if (fetchingRef.current) return; // Prevent duplicate fetch calls

    fetchingRef.current = true;
    fetch(`http://localhost:5000/allposts?limit=${limitRef.current}&skip=${skipRef.current}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData((prevData) => [...new Set([...prevData, ...result])]); // Prevent duplicate posts
        fetchingRef.current = false;
      })
      .catch((err) => {
        console.log(err);
        fetchingRef.current = false;
      });
  }, []);

  const handlScroll = useCallback(() => {
    if (
      document.documentElement.clientHeight + window.pageYOffset >=
      document.documentElement.scrollHeight
    ) {
      skipRef.current += 10;
      fetchPosts();
    }
  }, [fetchPosts]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/signup");
    }
    fetchPosts();
    window.addEventListener("scroll", handlScroll);
    return () => {
      window.removeEventListener("scroll", handlScroll);
    };
  }, [navigate, fetchPosts, handlScroll]);

  const toggleComments = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setItem(posts);
      setShow(true);
    }
  };

  const likePost = (id) => {
    fetch("http://localhost:5000/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
      });
  };

  const unLikePost = (id) => {
    fetch("http://localhost:5000/unlike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
      });
  };

  const makeComment = (text, id) => {
    fetch("http://localhost:5000/comments", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: text,
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setComment("");
        notifyB("Comment Posted");
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
      });
  };

  return (
    <div className="home">
      {data.map((post) => (
        <div className="card" key={post._id}>
          <div className="card-header">
            <div className="card-pic">
              <img
                src={post.postedBy.Photo ? post.postedBy.Photo : picLink}
                alt=""
              />
            </div>
            <h5>
              <Link to={`/profile/${post.postedBy._id}`}>
                {post.postedBy.name}
              </Link>
            </h5>
          </div>
          <div className="card-image">
            <img src={post.photo} alt="" />
          </div>
          <div className="card-content">
            {post.likes.includes(JSON.parse(localStorage.getItem("user"))._id) ? (
              <span
                onClick={() => unLikePost(post._id)}
                className="material-symbols-outlined material-symbols-outlined-red"
              >
                favorite
              </span>
            ) : (
              <span
                className="material-symbols-outlined"
                onClick={() => likePost(post._id)}
              >
                favorite
              </span>
            )}
            <p>{post.likes.length} Likes</p>
            <p>{post.body}</p>
            <p
              style={{ fontWeight: "bold", cursor: "pointer" }}
              onClick={() => toggleComments(post)}
            >
              View all comments
            </p>
          </div>
          <div className="add-comment">
            <span className="material-symbols-outlined">mood</span>
            <input
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="comment"
              onClick={() => {
                makeComment(comment, post._id);
                toggleComments();
              }}
            >
              Post
            </button>
          </div>
        </div>
      ))}
      {show && (
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
              </div>
              <div
                className="comment-section"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                {item.comments.map((comment) => (
                  <p className="comm" key={comment._id}>
                    <span
                      className="commentor"
                      style={{ fontWeight: "bolder" }}
                    >
                      {comment.postedBy.name}{" "}
                    </span>
                    <span className="comment-text">{comment.comment}</span>
                  </p>
                ))}
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
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  className="comment"
                  onClick={() => {
                    makeComment(comment, item._id);
                    toggleComments();
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
          <div
            className="close-comment"
            onClick={() => toggleComments()}
          >
            <span className="material-symbols-outlined material-symbols-outlined-comment">
              close
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
