import React from 'react';
import { InferGetServerSidePropsType, NextPageContext } from 'next';
import connectDB from '@/utils/connectDB';
import User from '@/models/User';
import { isValidObjectId } from 'mongoose';

interface IFollowersProps {
  userId: string;
  followers: Array<{
    _id: string;
    name: string;
    image: string;
  }>;
  user: {
    _id: string;
    name: string;
    image: string;
    email: string;
    followers: any[];
    following: any[];
    Biography: string;
  };
}

const Followers: React.FunctionComponent<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  userId,
  user,
  followers,
}) => {
  console.log('User:', user); // Check if user is being passed correctly
  console.log('Followers:', followers); // Check if followers are passed correctly
  
  return (
    <>
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
