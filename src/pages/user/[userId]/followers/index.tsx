import React from 'react';
import { InferGetServerSidePropsType, NextPageContext } from 'next';
import connectDB from '@/utils/connectDB';
import User from '@/models/User';
import { isValidObjectId } from 'mongoose';
import style from './style.module.css'
import Scene from '@/components/backgrounds/starsBackground/Scene';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from 'next/router';

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
  const router = useRouter();
  console.log('User:', user); 
  console.log('Followers:', followers); 
  
  return (
    <>
    <div id={style.main}>
      <Scene/>
      <div id={style.body}>
        <div id={style.header}>
          <div id={style.headerTop}>
          <div id={style.arrowContainer}>
            <button id={style.arrowButton} onClick={()=>
              router.push({
                pathname: `/user/${userId}`, // Use session.id as userId in the URL
               })
            }>
             <FaArrowLeftLong color='aliceblue'/>
            </button>
          </div>
          <div id={style.nameContainer}>
            <h5><b>{user.name}</b></h5>
            <p>@{user.name}</p>
          </div>
          </div>
          <div id={style.pageSelector}>
            <div id={style.following} onClick={()=>{
              router.push({
                pathname: `/user/${userId}/following`, // Use session.id as userId in the URL
               })
            }}>
              <h6>Following</h6>
              <div id={style.followingSelector}></div>
            </div>
            <div id={style.followers}>
              <h6><b>Followers</b></h6>
              <div id={style.followersSelector}></div>
            </div>
          </div>
        </div>
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
