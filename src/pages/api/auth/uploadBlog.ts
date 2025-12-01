// pages/api/auth/uploadBlog.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // adjust path if needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // 1. Connect to the database
    await connectDB();
    console.log("Connected to database (uploadBlog)");

    // 2. Ensure user is authenticated
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return res.status(401).json({ message: "Unauthorized. Please sign in." });
    }

    // 3. Extract values from request body
    const { values } = req.body || {};
    if (!values) {
      return res.status(400).json({ message: "Missing values in request body." });
    }

    const { BlogTitle, BlogDescription } = values;

    console.log("Incoming blog values:", values);

    // 4. Basic validation (client already uses Zod, but we double-check)
    if (!BlogTitle || typeof BlogTitle !== "string") {
      return res
        .status(400)
        .json({ message: "BlogTitle is required and must be a string." });
    }

    if (!BlogDescription || typeof BlogDescription !== "string") {
      return res
        .status(400)
        .json({ message: "BlogDescription is required and must be a string." });
    }

    // 5. Find the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 6. Ensure blogs array exists (defensive)
    if (!Array.isArray(user.blogs)) {
      // @ts-ignore – depending on your TS definition for User
      user.blogs = [];
    }

    // 7. Push new blog into user's blogs array
    user.blogs.push({
      blogTitle: BlogTitle,
      blogDescription: BlogDescription,
      createdAt: new Date(),
    });

    // 8. Save user
    await user.save();

    return res.status(200).json({ message: "Blog added successfully." });
  } catch (error: any) {
    console.error("Error in uploadBlog API:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
}
