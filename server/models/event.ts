import mongoose from "mongoose"

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
)

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [commentSchema],
    // Add document fields
    documentUrl: {
      type: String,
    },
    documentType: {
      type: String,
      enum: ["pdf", "image", null],
    },
  },
  { timestamps: true },
)

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema)

export default Event
