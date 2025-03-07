import React, { useState, useEffect } from 'react';
import style from './style.module.css';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import FollowingButton from '@/components/buttons/followingButton/FollowingButton';
import FollowButton from '@/components/buttons/followButton/FollowButton';
import { is } from '@react-three/fiber/dist/declarations/src/core/utils';

interface IFollowingBodyProps {
  userid: string;
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

interface FollowerStatus {
  isFollowing: boolean;
  isFollowingYou: boolean;
}

const FollowingBody: React.FunctionComponent<IFollowingBodyProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const { userid, followers, following } = props;
  
  console.log(following)
  const { data: session } = useSession();
  const router = useRouter();
  const [ clicked , setClicked ] = useState(false);
  const [followingStatus, setFollowingStatus] = useState<Record<string, FollowerStatus>>({});
    useEffect(() => {
      const fetchFollowingStatus = async () => {
        if (!session || !session.id || following.length === 0 ) return; // Ensure all required data is present
        try {
          setLoading(true); // Explicitly set loading to true at the start
          console.log(following)
          const response = await fetch('/api/auth/getFollowing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionUserId: session.id,
              //this is really followingId's however 
              //changing this woul affect the getFollowing function
              //therefore this will be kept the same,
              followerIds: following.map((f) => f._id),
              followers: followers.map((f) => f._id),
            }),
          });
    
          if (!response.ok) {
            throw new Error('Failed to fetch following status');
          }
    
          const { isFollowingList } = await response.json();
          console.log(isFollowingList)
          // Safely map the API response to state
          const statusMap = isFollowingList.reduce(
            (acc, { followerId, isFollowing, isFollowingYou }) => ({
              ...acc,
              [followerId]: { isFollowing, isFollowingYou },
            }),
            {} as Record<string, FollowerStatus>
          );
          setLoading(false)
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

  if (loading) {
    return (
      <div className={style.loader}>
        <ClipLoader color="rgb(30, 245, 1)" size={15} />
      </div>
    );
  }

  // Render content when loading is complete
  return (
    <>
     {
      following.map((follower) => {
        const isFollowing = followingStatus[follower._id]?.isFollowing;
        const isFollowingYou = followingStatus[follower._id]?.isFollowingYou;
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
                 { isFollowingYou && (
                   <p id={style.followsYou} style={{ color: 'grey' }}>
                     Follows you
                   </p>
                 )}
               </div>
               <p>{follower.Biography}</p>
             </div>
             {session && !isCurrentUser && (
              isFollowing === !clicked ? (
              <FollowingButton 
               clicked={clicked} 
               setClicked={setClicked} 
               userId={follower._id} 
              />
              ) : (
              <FollowButton 
               clicked={clicked} 
               setClicked={setClicked} 
               userId={follower._id} 
              />
              )
              )}
           </div>
         );
       })
     }
    </>
  );
};

export default FollowingBody;
