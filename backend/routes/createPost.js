const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const POST = mongoose.model("POST");

router.get("/allposts", requireLogin, (req, res) => {
  let limit = req.query.limit;
  let skip = req.query.skip;
  
  POST.find()
    .populate("postedBy", "_id name Photo")
    .populate("comments.postedBy", "_id name")
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .sort("-createdAt")
    .then((posts) => res.json(posts))
    .catch((err) => console.log(err));
});

router.post("/createPost", requireLogin, (req, res) => {
  const { body, pic } = req.body;
  if (!pic || !body) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  req.user;
  const post = new POST({
    body,
    photo: pic,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      return res.json({ post: result });
    })
    .catch((err) => console.log(err));
});

router.get("/myposts", requireLogin, (req, res) => {
  POST.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((myPosts) => {
      res.json(myPosts);
    });
});

router.put("/like", requireLogin, async (req, res) => {
  try {
    const result = await POST.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id },
      },
      {
        new: true,
      }
    )
      .populate("postedBy", "_id name Photo")
      .exec();

    return res.json(result);
  } catch (err) {
    return res.status(422).json({ error: err });
  }
});

router.put("/unlike", requireLogin, async (req, res) => {
  try {
    const result = await POST.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      {
        new: true,
      }
    )
      .populate("postedBy", "_id name Photo")
      .exec();

    return res.json(result);
  } catch (err) {
    return res.status(422).json({ error: err });
  }
});

router.put("/comments", requireLogin, async (req, res) => {
  try {
    const comment = {
      comment: req.body.text,
      postedBy: req.user._id,
    };

    let post = await POST.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: comment },
      },
      {
        new: true,
      }
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post = await post.populate("comments.postedBy", "_id name");

    res.status(200).json(post);
  } catch (error) {
    return res.status(422).json({ error: error.message });
  }
});

//API to delete post

router.delete("/deletePost/:postId", requireLogin, (req, res) => {
  POST.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id name Photo")
    .exec()
    .then((post) => {
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        return POST.deleteOne({ _id: req.params.postId })
          .then(() => {
            res.json({ message: "Post Deleted" });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.message });
          });
      } else {
        res.status(403).json({ error: "Unauthorized action" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

//to show my following's posts
router.get("/myfollowingpost", requireLogin, (req, res) => {
  POST.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((posts) => res.json(posts))
    .catch((err) => console.log(err));
});

module.exports = router;