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
  console.log(followers)
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

    // Extract the IDs from the followers and following lists
    const followerIds = user.followers || [];
    const followingIds = user.following || [];

    // Query for the user details of the followers and following
    const followers = await User.find({ _id: { $in: followerIds } })
      .select('_id name image Biography')
      .lean();
    const following = await User.find({ _id: { $in: followingIds } })
      .select('_id name image Biography')
      .lean();

    return {
      props: {
        userId: userId.toString(),
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          Biography: user.Biography,
        },
        followers: followers.map((follower) => ({
          _id: follower._id.toString(),
          name: follower.name,
          image: follower.image,
          Biography: follower.Biography,
        })),
        following: following.map((followedUser) => ({
          _id: followedUser._id.toString(),
          name: followedUser.name,
          image: followedUser.image,
          Biography: followedUser.Biography,
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
