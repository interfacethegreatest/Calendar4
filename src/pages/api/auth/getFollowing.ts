// /pages/api/check-following.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/connectDB';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sessionUserId, followerIds, followers } = req.body;

  if (!sessionUserId || !Array.isArray(followerIds)) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    await connectDB();

    // Query session user to get their following list
    const sessionUser = await User.findById(sessionUserId).select('following followers').lean();

    if (!sessionUser) {
      return res.status(404).json({ message: 'Session user not found' });
    }

    const isFollowingList = followerIds.map((followerId) => ({
      followerId,
      isFollowing: sessionUser.following.includes(followerId),
    }));

    let isFollowerList
    if ( followers.length > 0) {
      const isFollowerList = followers.map((follower) => ({
        follower,
        isFollower: sessionUser.followers.includes(follower),
      }))
    }
    console.log(isFollowerList);

    return res.status(200).json({ isFollowingList, isFollowerList });
  } catch (error) {
    console.error('Error querying following status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
