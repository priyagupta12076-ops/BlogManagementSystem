const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blogs");
const commentRoutes = require("./routes/comments");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);

<<<<<<< HEAD
const PORT = process.env.PORT || 8080;
=======
const PORT = 8080;
>>>>>>> c8b4c06 (Initial commit)
const MONGO_URL =
    process.env.MONGO_URL || "mongodb://127.0.0.1:27017/blogmanagement";

app.get("/", (req, res) => {
    res.json({
        message: "Blog Management System API is running"
    });
});

mongoose
    .connect(MONGO_URL)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error.message);
    });

<<<<<<< HEAD
app.listen(PORT, "0.0.0.0", () => {
=======
app.listen(PORT, () => {
>>>>>>> c8b4c06 (Initial commit)
    console.log(`Server running on port ${PORT}`);
});