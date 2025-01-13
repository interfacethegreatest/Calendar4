import React, { useState } from 'react';
import { InferGetServerSidePropsType, NextPageContext } from 'next';
import connectDB from '@/utils/connectDB';
import User from '@/models/User';
import { isValidObjectId } from 'mongoose';
import style from './style.module.css';
import Scene from '@/components/backgrounds/starsBackground/Scene';
import FollowerHeader from '@/components/sections/FollowersPage/FollowersHeader/FollowersHeader';
import FollowersBody from '@/components/sections/FollowersPage/FollowersBody/FollowersBody';

const Followers: React.FunctionComponent<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  userId,
  user,
  followers,
  following,
}) => {
  const [selector, setSelected] = useState(true);

  return (
    <>
      <div id={style.main}>
        <Scene />
        <div id={style.body}>
          <FollowerHeader userId={userId} user={user} selector={selector} setSelected={setSelected} />
          <FollowersBody followers={followers} following={following} />
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx: NextPageContext) {
  const { query } = ctx;
  const { userId } = query;

  if (!isValidObjectId(userId)) {
    return { notFound: true }; // Validate MongoDB ID
  }

  try {
    await connectDB(); // Connect to MongoDB
    const user = await User.findById(userId).lean(); // Retrieve the user details

    if (!user || (!user.followers && !user.following)) {
      return { notFound: true }; // User, followers, or following not found
    }

    // Extract follower IDs
    const followerIds = user.followers
      .map((follower: any) => (isValidObjectId(follower._id) ? follower._id.toString() : null))
      .filter(Boolean);

    // Extract following IDs
    const followingIds = user.following
      .map((followedUser: any) => (isValidObjectId(followedUser._id) ? followedUser._id.toString() : null))
      .filter(Boolean);

    // Query followers
    const followers = await User.find({ _id: { $in: followerIds } })
      .select('_id name email image Biography')
      .lean();

    // Query following
    const following = await User.find({ _id: { $in: followingIds } })
      .select('_id name email image Biography')
      .lean();

    return {
      props: {
        userId: userId.toString(),
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
        followers: followers.map((follower) => ({
          ...follower,
          _id: follower._id.toString(),
        })),
        following: following.map((followedUser) => ({
          ...followedUser,
          _id: followedUser._id.toString(),
        })),
      },
    };
  } catch (error) {
    console.error('Error fetching user, followers, or following:', error);
    return {
      notFound: true,
    };
  }
}

export default Followers;
