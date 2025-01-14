import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Connect to the database
    console.log('123')
    await connectDB();
    console.log('Successfull connection');
    if (!req.body) {
      throw new Error("Error! No req.body");
    }
    console.log('User ID : ' + req.body.userId)
    if (!req.body.userId) {
      throw new Error("Error! The user liked a page without a userId");
    }
    if (!req.body.session) {
      throw new Error("Error! The user sent a like without being signed in.");
    }

    // Retrieve the target user
    console.log('Retreive target user')
    const targetUser = await User.findById(req.body.userId);
    if (!targetUser) {
      throw new Error("The user being followed was not found!");
    }

    // Check if the session user is already a follower
    const isAlreadyFollower = targetUser.followers.some(
      (follower: any) => follower.toString() === req.body.session.id
    );

    // Skip the push operation if already a follower
    if (!isAlreadyFollower) {
      // Add the session user to the followers list of the target user
      await User.findByIdAndUpdate(
        req.body.userId,
        { $push: { followers: req.body.session.id } },
        { new: true, runValidators: true }
      );
    }

    // Add the target user to the following list of the session user
    const followingUser = await User.findByIdAndUpdate(
      req.body.session.id,
      { $push: { following: req.body.userId } },
      { new: true, runValidators: true }
    );

    if (!followingUser) {
      throw new Error("The user attempting to follow doesn't exist!");
    }

    console.log(targetUser.followers.length);
    res.json({ message: targetUser.followers.length +1 });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}
