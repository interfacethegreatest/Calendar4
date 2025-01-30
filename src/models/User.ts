import mongoose from "mongoose";
import { any, string } from "zod";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    default: "https://toppng.com/uploads/preview/instagram-default-profile-picture-11562973083brycehrmyv.png",
  },
  password: {
    type: String,
    minlength: 7,
  },
  emailVerified: {
    type: new mongoose.Schema({
      emailVerified: { type: Boolean, default: false },
      isNewUser: { type: Boolean, default: true },
      profileVisited: { type: Boolean, default: false },
      calendarVisited: { type: Boolean, default: false },
      location: { type: Boolean, default: false },
    }),
  },
  aboutYou: {
    type: new mongoose.Schema({
      aboutYou: { type: String, default: "This is yet to be completed." },
      cv: { type: String, default: "" },
    }),
    default: {},
  },
  Biography: {
    type: String,
    default: "This user has not provided a description.",
  },
  Website: {
    type: String,
    default: "", // Default value for an empty string
  },
  followers: {
    //remove zeroth object in schema
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  following: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  role: {
    type: String,
    default: "user",
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
