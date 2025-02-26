import React, { useState, useEffect } from 'react';
import style from './style.module.css';
import { ClipLoader } from 'react-spinners';
import FollowButton from '@/components/buttons/followButton/FollowButton';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import FollowingButton from '@/components/buttons/followingButton/FollowingButton';

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
  const { data: session } = useSession();
  const router = useRouter();
  const [ clicked , setClicked ] = useState(false);
  const [followingStatus, setFollowingStatus] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const fetchFollowingStatus = async () => {
      if (!session || !session.id || followers.length === 0) return; // Ensure all required data is present
  
      try {
        setLoading(true); // Explicitly set loading to true at the start
        const response = await fetch('/api/auth/getFollowing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionUserId: session.id,
            followerIds: followers.map((f) => f._id),
            followers: followers.map((f) => f._id),
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch following status');
        }
  
        const { isFollowingList, isFollowerList } = await response.json();

        console.log(isFollowerList)
  
        // Safely map the API response to state
        const statusMap = isFollowingList.reduce(
          (acc, { followerId, isFollowing }) => ({
            ...acc,
            [followerId]: isFollowing,
          }),
          {}
        );
  
        setFollowingStatus(statusMap); // Update the state with the API result
        console.log(statusMap)
      } catch (error) {
        console.error('Error fetching following status:', error);
        toast.error('Unable to fetch following status');
      } finally {
        setLoading(false); // Ensure loading is set to false in all cases
      }
    };
  
    fetchFollowingStatus();
  }, [followers, session]);
  
  return (
    <div id={style.followersBody}>
      {loading ? (
        <div id={style.loader}>
          <ClipLoader color="rgb(30, 245, 1)" size={15} />
        </div>
      ) : (
        followers.map((follower) => {
          const isFollowing = followingStatus[follower._id];
          const isCurrentUser = session && session.id === follower._id;
  
          return (
            <div
              key={follower._id}
              id={style.User}
              onClick={() => {
                router.push({
                  pathname: `/user/${follower._id}`,
                });
              }}
            >
              <div id={style.imageContainer}>
                <img
                  src={follower.image}
                  id={style.image}
                  alt={`${follower.name}'s profile`}
                />
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
                  {session && session.id === userid && (
                    <p id={style.followsYou} style={{ color: 'grey' }}>
                      Follows you
                    </p>
                  )}
                </div>
                <p>{follower.Biography}</p>
              </div>
              {!isCurrentUser && (
                <>
                  {isFollowing === undefined ? (
                    <ClipLoader size={10} color="rgb(30, 245, 1)" />
                  ) : isFollowing ? (
                    !clicked ?
                    <FollowingButton clicked={clicked} setClicked={setClicked} userId={follower._id} /> 
                    :
                    <FollowButton clicked={clicked} setClicked={setClicked} userId={follower._id} />
                  ) : (
                     !clicked ?
                    <FollowButton clicked={clicked} setClicked={setClicked} userId={follower._id} />
                    :
                    <FollowingButton clicked={clicked} setClicked={setClicked} userId={follower._id} /> 
                  )}
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default FollowersBody;
