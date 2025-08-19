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
    const { AboutMe, CV, Transcripts, workExperience, educationalBackground } = req.body.values;
    console.log('Incoming form values:', req.body.values);
    
    // 3. Validate required fields (AboutMe can be empty string)
    if (AboutMe === undefined) {
      return res.status(400).json({ message: 'AboutMe field missing.' });
    }
     
    if ( CV === undefined) {
      return res.status(400).json({ message: 'CV field missing.' });
    }
    
    if (!Array.isArray(Transcripts)) {
      return res.status(400).json({ message: 'Transcripts field must be an array.' });
    }
    
    if (!Array.isArray(workExperience)) {
      return res.status(400).json({ message: 'workExperience field must be an array.'});
    }

    if(!Array.isArray(educationalBackground)) {
      return res.status(400).json({ message: 'educationalBackground field must be an array.'});
    }

    // 4. Find the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 5. Update nested `aboutYou` fields
    user.aboutYou.aboutYou = AboutMe; 
    user.aboutYou.cv = CV 
    user.aboutYou.transcripts = Transcripts; 
    user.aboutYou.workExperience = workExperience ; 
    user.aboutYou.educationalBackground = educationalBackground ; 

    await user.save();
   
    return res.status(200).json({ message: 'About Me details updated successfully.' });

  } catch (error: any) {
    console.error('Error in uploadAboutMe API:', error);
    return res.status(500).json({ error: error.message });
  }
}
