import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]'; // Adjust the path to your `next-auth` configuration
import validator from 'validator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    await connectDB();
    console.log('Connection to database successful');
    //Query for false data on the backend,
    //first retrieve session data to pull my user data
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized. Please sign in.' });
    }

    const { description, imageSchema, username, website } = req.body;

    if (!description || !username) {
      return res.status(400).json({ message: 'Please fill in all non-optional fields.' });
    }

    if (website && !validator.isURL(website)) {
      return res.status(400).json({ message: 'Please add a valid URL.' });
    }

    if (imageSchema && !validator.isURL(imageSchema)) {
      return res.status(400).json({ message: 'Please add a valid URL.' });
    }

    const user = await User.findOne({ email: session.user.email }); // Use session email to fetch the user

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Perform updates here

    user.name = username;
    user.website = website;
    user.image = imageSchema;
    user.Biography = description;

    await user.save();
    

    return res.status(200).json({ message: 'User profile updated successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
