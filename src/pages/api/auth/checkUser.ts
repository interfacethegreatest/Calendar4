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
                        calendarVisited: false, 
                        location: false
                    },
                    Biography: "This user has not provided a description.",
                    Website: "",
                    followers: 0,
                    following:0,
                    role:"user",
                    __v: 0,
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
