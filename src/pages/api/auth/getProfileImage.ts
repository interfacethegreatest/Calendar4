import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/connectDB'; // Adjust the path to your MongoDB connection file
import User from '@/models/User'; // Adjust the path to your Mongoose model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await connectDB(); // Ensure the database is connected

        const { userId } = req.query; // Get the userId from the query parameters
        console.log("User ID EQUALS :" + userId)
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ message: 'Invalid user ID / User ID not provided.' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        console.log(user)

        res.status(200).json({ image: user.image }); // Assume 'profileImage' is the field name
    } catch (error) {
        console.error('Error fetching profile image:', error);
        res.status(500).json({ messag4e: 'Internal Server Error' });
    }
}
