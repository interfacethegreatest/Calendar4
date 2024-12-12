import mongoose from "mongoose";

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
    default: "https://res.cloudinary.com/dmhcnhtng/image/upload/v1664642479/992490_sskqn3.png",
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
  },
  emailVerified: { // Define this as an object
    type: new mongoose.Schema({
      emailVerified: { type: Boolean, default: false },
      isNewUser: { type: Boolean, default: true },
      profileVisited: { type: Boolean, default: false },
      calendarVisited: { type: Boolean, default: false }, // Corrected spelling
      location: { type: Boolean, default: false },
    }),
  },
  Biography: {
    type: String,
    default: "This user has not provided a description.",
  },
  followers: {
    type: Number,
    default: 0, // Default value for new users
  },
  following: {
    type: Number,
    default: 0, // Default value for new users
  },
  role: {
    type: String,
    default: "user",
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
