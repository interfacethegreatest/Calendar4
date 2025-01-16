import React, { useState, useEffect } from 'react';
import style from './style.module.css';
import { ClipLoader } from 'react-spinners';
import FollowButton from '@/components/buttons/followButton/FollowButton';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

interface IFollowersBodyProps {
  userid: string,
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

const FollowersBody: React.FunctionComponent<IFollowersBodyProps> = ({ followers, following, userid }) => {
  const [loading, setLoading] = useState(false);
  //Function to fetch a session profile and check is the session user is following
  const isFollowing = async (followerId : string): Promise<boolean> =>{
    try {
      const response = await fetch('/api/auth/is-following',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userid, followerId }),
      })
      if (!response.ok) {
        console.error('Failed to check the following status: ', response.statusText)
        return false;
      }
      const { isFollowing } = await response.json();
      return isFollowing;
    } catch (error) {
      toast.error('Error fetching following status: ' + error)
      return false;
    }
  }
  useEffect(() => {
    const checkFollowing = async () => {
      const statuses = await Promise.all(
        followers.map(async (follower) => ({
          id: follower._id,
          isFollowing: await isFollowing(follower._id),
        }))
      );
  
      console.log('Following statuses:', statuses);
      // Update local state if needed
    };
  
    if (followers.length > 0 ) {
      checkFollowing();
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
              <p id={style.followsYou} style={{color:"grey"}}>
                  Follows you
              </p>
              </div>
              <p>{follower.Biography}</p>
            </div>
            {}
            <FollowButton userId={follower._id} />
          </div>
        ))
      )}
    </div>
  );
};

export default FollowersBody;
