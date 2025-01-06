// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validate request body
    if (!req.body) {
      throw new Error("Error! No request body provided.");
    }
    if (!req.body.userId) {
      throw new Error("Error! No userId provided for the page being unfollowed.");
    }
    if (!req.body.session) {
      throw new Error("Error! The user attempted to unfollow without being signed in.");
    }

    // Connect to the database
    await connectDB();

    const { userId, session } = req.body;

    // Find the target user
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      throw new Error("The user to be unfollowed does not exist!");
    }

    // Find the session user
    const sessionUser = await User.findById(session.id);
    if (!sessionUser) {
      throw new Error("The user attempting to unfollow does not exist!");
    }

    // Remove session user from the target user's followers array
    targetUser.followers = targetUser.followers.filter(
      (follower: any) => follower._id.toString() !== session.id
    );

    // Remove target user from the session user's following array
    sessionUser.following = sessionUser.following.filter(
      (following: any) => following._id.toString() !== userId
    );

    // Save the updates to the database
    await targetUser.save();
    await sessionUser.save();

    // Respond with the updated number of followers for the target user
    res.json({ message: targetUser.followers.length });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}
