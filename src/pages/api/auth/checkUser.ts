import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    
    const { token } = req.body; // Access token from the request body
  
    try {
        console.log("HELLO CHECK USER");
        console.log("token " + token);
        await connectDB();
        
        // Find user by the token (which presumably is their _id)
        const userDB = await User.findById(token);
        console.log("user: " + userDB);
        
        if (!userDB) {
            return res.status(404).json({ message: 'Could not find User' });
        }
  
        // Replace current userDB.emailVerified object with the new structure
        const updatedUser = await User.findByIdAndUpdate(
            userDB._id,
            {
                $set: {
                    emailVerified: {
                        emailVerified: false,
                        isNewUser: true,
                        profileVisited: false,
                        calenderVisited: false, // Consider renaming to "calendarVisited"
                        location: false
                    }
                }
            },
            { new: true } // Return the updated document
        );
  
        console.log("Updated user: " + updatedUser);
        return res.status(200).json({ message: 'User status updated successfully', user: updatedUser });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
