const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true
    },

    tags: {
      type: [String],
      default: []
    },

    image: {
      type: String,
      default: ""
    },

    content: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published"
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Blog", blogSchema);