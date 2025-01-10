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
}) => {
  const [selector, setSelected] = useState(true);

  return (
    <>
      <div id={style.main}>
        <Scene />
        <div id={style.body}>
          <FollowerHeader userId={userId} user={user} selector={selector} setSelected={setSelected} />
          <FollowersBody followers={followers}/>
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
    const user = await User.findById(userId).populate('followers'); // Populate the followers list

    if (!user) {
      return { notFound: true }; // User not found
    }

    const followers = user.followers.map((follower: any) => ({
      _id: follower._id.toString(),
      name: follower.name,
      image: follower.image,
      Biography: follower.Biography,
    }));

    return {
      props: {
        userId: userId.toString(),
        user: JSON.parse(JSON.stringify(user)), // Proper serialization
        followers,
      },
    };
  } catch (error) {
    console.error('Error fetching user or followers:', error);
    return {
      notFound: true,
    };
  }
}

export default Followers;
