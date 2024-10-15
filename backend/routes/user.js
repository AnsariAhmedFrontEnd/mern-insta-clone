const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");

//To get user Profile
router.get("/user/:id", (req, res) => {
  USER.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return POST.find({ postedBy: req.params.id })
        .populate("postedBy", "_id")
        .exec()
        .then((posts) => {
          res.status(200).json({ user, posts });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

// To unfollow
router.put("/unfollow", requireLogin, async (req, res) => {
  try {
    const userToUpdate = await USER.findByIdAndUpdate(
      req.body.followId,
      {
        $pull: { followers: req.user._id },
      },
      {
        new: true,
      }
    );

    if (!userToUpdate) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentUser = await USER.findByIdAndUpdate(
      req.user._id,
      {
        $push: { following: req.body.followId },
      },
      {
        new: true,
      }
    );

    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found" });
    }

    res.json(currentUser);
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: err.message });
  }
});


// To follow
router.put("/follow", requireLogin, async (req, res) => {
  try {
    const userToUpdate = await USER.findByIdAndUpdate(
      req.body.followId,
      {
        $push: { followers: req.user._id },
      },
      {
        new: true,
      }
    );

    if (!userToUpdate) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentUser = await USER.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body.followId },
      },
      {
        new: true,
      }
    );

    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found" });
    }

    res.json(currentUser);
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: err.message });
  }
});

//to upload profile pic

router.put("/uploadProfilePic", requireLogin, (req, res) => {
  USER.findByIdAndUpdate(
    req.user._id,
    {
      $set: { Photo: req.body.pic },
    },
    {
      new: true,
    }
  )
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(422).json({ error: err.message });
    });
});


module.exports = router;