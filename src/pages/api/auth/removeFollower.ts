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

    // Remove session user's ID from the target user's followers array
    const targetUserUpdate = await User.findByIdAndUpdate(
      userId,
      { $pull: { followers: session.id } },
      { new: true } // Return the updated document
    );

    if (!targetUserUpdate) {
      throw new Error("The user to be unfollowed does not exist!");
    }

    // Remove the target user's ID from the session user's following array
    const sessionUserUpdate = await User.findByIdAndUpdate(
      session.id,
      { $pull: { following: userId } },
      { new: true } // Return the updated document
    );

    if (!sessionUserUpdate) {
      throw new Error("The user attempting to unfollow does not exist!");
    }

    // Respond with the updated number of followers for the target user
    res.json({ message: targetUserUpdate.followers.length });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}
