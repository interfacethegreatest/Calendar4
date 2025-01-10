import React, { useState, useEffect } from 'react';
import style from './style.module.css';
import { ClipLoader } from 'react-spinners';
import { motion } from 'framer-motion';

interface IFollowersBodyProps {
  followers: Array<{
    _id: string;
    name: string;
    image: string;
    Biography: string;
  }>;
}

const FollowersBody: React.FunctionComponent<IFollowersBodyProps> = ({ followers }) => {
  const [loading, setLoading] = useState(true);
  console.log(followers)
  // You can set the loading to false once data is populated
  useEffect(() => {
    if (followers.length > 0) {
      setLoading(false);
    }
  }, [followers]);

  return (
    <div id={style.followersBody}>
      {loading ? (
        <div id={style.loader}>
          <ClipLoader color="rgb(30, 245, 1)" size={15} />
        </div>
      ) : (
        followers.map((follower) => (
          <div key={follower._id} id={style.User}>
            <div id={style.imageContainer}>
                <img src={follower.image} id={style.image} alt="" />
            </div>
            <div id={style.profileMainText}>
                <p id={style.profileMainName}><b>{follower.name}</b></p>
                <p id={style.profileMainAt} style={{color:"grey"}}>@{follower.name}</p>
                <p>{follower.Biography}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FollowersBody;
