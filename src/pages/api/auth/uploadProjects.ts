// pages/api/auth/uploadAboutMe.ts   (if using Pages Router)

import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]'; // adjust path if needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectDB();
    console.log('Connected to database');

    // 1. Ensure user is authenticated
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return res.status(401).json({ message: 'Unauthorized. Please sign in.' });
    }


    // 2. Extract values from request body
    const { ProjectTitle, ProjectDescription, Tags, dueAt } = req.body;
    console.log('Incoming form values:', req.body.values);
    
    // 3. Validate required fields (AboutMe can be empty string)
    if (ProjectTitle === undefined) {
      return res.status(400).json({ message: 'ProjectTitle field missing.' });
    }
     
    if ( ProjectDescription === undefined) {
      return res.status(400).json({ message: 'ProjectDescription field missing.' });
    }
    
    if (!Array.isArray(Tags)) {
      return res.status(400).json({ message: 'Tags field must be an array.' });
    }
    
    if ( dueAt === undefined) {
        return res.status(400).json({ message: 'dueAt field missing.' });
    }

    // 4. Find the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 5. Append field to user.projects
    user.projects.push({
        projectTitle: ProjectTitle,
        projectDescription: ProjectDescription,
        tags: Tags,
        dueAt: dueAt ? new Date(dueAt) : null,
        createdAt: new Date(),
    });

    await user.save();
   
    return res.status(200).json({ message: 'Project details updated successfully.' });

  } catch (error: any) {
    console.error('Error in uploadAboutMe API:', error);
    return res.status(500).json({ error: error.message });
  }
}
