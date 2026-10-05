const express = require("express");
const Comment = require("../models/Comment");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* ADD COMMENT */
router.post("/:blogId", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        message: "Comment cannot be empty"
      });
    }

    const comment = new Comment({
      text: text.trim(),
      blog: req.params.blogId,
      author: req.user.id
    });

    await comment.save();

    await comment.populate("author", "name");

    res.status(201).json({
      message: "Comment added successfully",
      comment
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add comment",
      error: error.message
    });
  }
});

/* GET COMMENTS FOR A BLOG */
router.get("/:blogId", async (req, res) => {
  try {
    const comments = await Comment.find({
      blog: req.params.blogId
    })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch comments",
      error: error.message
    });
  }
});

/* DELETE COMMENT */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    if (comment.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not allowed to delete this comment"
      });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({
      message: "Comment deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete comment",
      error: error.message
    });
  }
});

module.exports = router;