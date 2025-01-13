import React, { useState, useEffect } from 'react';
import style from './style.module.css';
import { ClipLoader } from 'react-spinners';

interface IFollowersBodyProps {
  followers: Array<{
    _id: string;
    name: string;
    image: string;
    Biography: string;
  }>;
  following: Array<{
    _id: string;
    name: string;
    image: string;
    Biography: string;
  }>;
}

const FollowersBody: React.FunctionComponent<IFollowersBodyProps> = ({ followers, following }) => {
  const [loading, setLoading] = useState(true);

  // Helper function to check if a follower is in the following list
  const isFollowing = (followerId: string): boolean => {
    return following.some((followedUser) => followedUser._id === followerId);
  };

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
              <img src={follower.image} id={style.image} alt={`${follower.name}'s profile`} />
            </div>
            <div id={style.profileMainText}>
              <p id={style.profileMainName}>
                <b>{follower.name}</b>
              </p>
              <div id={style.profileFollowers}>
              <p id={style.profileMainAt} style={{ color: 'grey' }}>
                @{follower.name}
              </p>
              <br />
              {isFollowing(follower._id) && (
                <p id={style.followsYou} style={{color:"rgb(7, 7, 7)"}}>
                  Follows you
                </p>
              )}
              </div>
              <p>{follower.Biography}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FollowersBody;
