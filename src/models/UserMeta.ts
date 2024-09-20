import mongoose from "mongoose";

const UserMeta = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    isNewUser: {
        type: Boolean,
        default: true,
    },
    profileVisited: {
        type: Boolean,
        default: false,
    },
    calendarVisited: {
        type: Boolean,
        default: false,
    },
});
