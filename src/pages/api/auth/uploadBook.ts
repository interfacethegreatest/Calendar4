// pages/api/auth/uploadBook.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import { authOptions } from '@/pages/api/auth/[...nextauth]'; // adjust path if needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 1. Connect to the database
    await connectDB();
    console.log('Connected to database (uploadBook)');

    // 2. Ensure user is authenticated
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return res.status(401).json({ message: 'Unauthorized. Please sign in.' });
    }

    // 3. Extract values from request body
    const { values } = req.body || {};
    if (!values) {
      return res.status(400).json({ message: 'Missing values in request body.' });
    }

    const {
      BookTitle,
      BookAuthor,
      Rating,
      ImageUrl,
      BookDescription,
    } = values;

    console.log('Incoming book values:', values);

    // 4. Basic validation (Zod already runs on client, but we double-check)
    if (!BookTitle || typeof BookTitle !== 'string') {
      return res.status(400).json({ message: 'BookTitle is required and must be a string.' });
    }
    if (!BookAuthor || typeof BookAuthor !== 'string') {
      return res.status(400).json({ message: 'BookAuthor is required and must be a string.' });
    }
    if (!BookDescription || typeof BookDescription !== 'string') {
      return res.status(400).json({ message: 'BookDescription is required and must be a string.' });
    }

    const normalizedRating =
      typeof Rating === 'number' && Rating >= 0 && Rating <= 5 ? Rating : null;

    const normalizedImageUrl =
      typeof ImageUrl === 'string' ? ImageUrl : '';

    // 5. Find the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 6. Push new book into user's books array
    user.books.push({
      bookTitle: BookTitle,
      bookAuthor: BookAuthor,
      rating: normalizedRating,
      imageUrl: normalizedImageUrl,
      bookDescription: BookDescription,
      createdAt: new Date(),
    });

    // 7. Save user
    await user.save();

    return res.status(200).json({ message: 'Book added successfully.' });
  } catch (error: any) {
    console.error('Error in uploadBook API:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
