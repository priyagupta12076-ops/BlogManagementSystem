const express = require("express");
const Blog = require("../models/Blog");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


/* CREATE BLOG */

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      tags,
      image,
      content,
      status
    } = req.body;

    const blog = new Blog({
      title,
      description,
      category,
      tags,
      image,
      content,
      status,
      author: req.user.id
    });

    await blog.save();

    res.status(201).json({
      message: "Blog created successfully",
      blog
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create blog",
      error: error.message
    });
  }
});


/* MY BLOGS */

router.get("/user/my-blogs", authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find({
      author: req.user.id
    }).sort({ createdAt: -1 });

    res.json(blogs);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch blogs",
      error: error.message
    });
  }
});


/* ADMIN - GET ALL BLOGS */

router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const blogs = await Blog.find()
        .populate("author", "name email")
        .sort({ createdAt: -1 });

      res.json(blogs);

    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch all blogs",
        error: error.message
      });
    }
  }
);


/* GET ALL PUBLISHED BLOGS */

router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({
      status: "published"
    })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json(blogs);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch blogs",
      error: error.message
    });
  }
});


/* GET SINGLE BLOG */

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name");

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    res.json(blog);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch blog",
      error: error.message
    });
  }
});


/* UPDATE BLOG */

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    // Only the blog owner can edit it
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to edit this blog"
      });
    }

    const {
      title,
      description,
      category,
      tags,
      image,
      content,
      status
    } = req.body;

    blog.title = title;
    blog.description = description;
    blog.category = category;
    blog.tags = tags;
    blog.image = image;
    blog.content = content;
    blog.status = status;

    await blog.save();

    res.json({
      message: "Blog updated successfully",
      blog
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update blog",
      error: error.message
    });
  }
});


/* ADMIN - DELETE ANY BLOG */

router.delete(
  "/admin/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);

      if (!blog) {
        return res.status(404).json({
          message: "Blog not found"
        });
      }

      await Blog.findByIdAndDelete(req.params.id);

      res.json({
        message: "Blog deleted successfully by admin"
      });

    } catch (error) {
      res.status(500).json({
        message: "Failed to delete blog",
        error: error.message
      });
    }
  }
);


/* DELETE BLOG - OWN BLOG */

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    // Only the blog owner can delete it
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to delete this blog"
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      message: "Blog deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete blog",
      error: error.message
    });
  }
});


module.exports = router;