import mongoose from "mongoose";

const roomSch = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  roomID: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  users: {
    type: [String],
    default: [],
  },
  messages: {
    type: [
      {
        sender: String,
        content: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
});
const Room =
  mongoose.models.roomDetails || mongoose.model("roomDetails", roomSch);
export default Room;
