// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import type { NextApiRequest, NextApiResponse } from "next";
import { projectCompilationEventsSubscribe } from "next/dist/build/swc/generated-native";
import { Turret_Road } from "next/font/google";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    // Validate request body
    const { userId, session, index, newIndexValue } = req.body;

    if (!userId) {
      throw new Error("Error! No userId provided for the page being modified.");
    }
    if (!session || !session.id) {
      throw new Error("Error! The user attempted to modify without being signed in.");
    }
    if (index === undefined || index === null) {
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
    if (!Array.isArray(user.projects)) {
      throw new Error("This user has no projects to remove.");
    }

    // Ensure index is within range
    if (index < 0 || index >= user.projects.length) {
      throw new Error("Invalid project index.");
    }
    
    const project = user.projects[index];
    project.completed = project.completed === null
    ? false
    : !project.completed;


    // Remove the project at the specified index
    //const removedProject = user.projects[index]
    await user.save();
    return res.status(200).json({ projects: user.projects });
  } catch (error) {
    console.error("Error removing project:", error);
    res.status(500).json({ message: (error as Error).message });
  }
}
