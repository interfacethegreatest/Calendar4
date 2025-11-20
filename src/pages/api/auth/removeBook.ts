// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import { request } from "http";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    // Validate request body
    const { bookNumber, userId, session} = req.body;
    console.log(bookNumber)
    if (!userId) {
      throw new Error("Error! No userId provided for the page being modified.");
    }
    if (!session || !session.id) {
      throw new Error("Error! The user attempted to modify without being signed in.");
    }
    if (bookNumber === undefined || bookNumber === null) {
      throw new Error("Error! No project index provided for removal.");
    }

    // Connect to the database
    await connectDB();

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("The specified user does not exist!");
    }

    // Check if user has projects
    if (!Array.isArray(user.books)) {
      throw new Error("This user has no books to remove.");
    }

    // Ensure index is within range
    if (bookNumber < 0 || bookNumber >= user.books.length) {
      throw new Error("Invalid book index.");
    }

    // Remove the project at the specified index
    const removedProject = user.books.splice(bookNumber, 1)[0];

    // Save the updated user document
    await user.save();

    // Respond with success
    res.status(200).json({
      message: `You have removed book: ${removedProject?.title || "Untitled project"}.`,
      removedIndex: bookNumber,
      removedProject,
      updatedProjects: user.projects,
    });

  } catch (error) {
    console.error("Error removing project:", error);
    res.status(500).json({ message: (error as Error).message });
  }
}
