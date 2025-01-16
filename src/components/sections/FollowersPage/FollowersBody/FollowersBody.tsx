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
  const { data: session } = useSession();
  console.log('Session id : '+session?.id)
  console.log('Userid : ' + userid)
  console.log(session?.id===userid)
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
              {
                /* Should query if the session.id == userid to provide the follows you if true provide the follows you */
                session && session?.id ===userid ? (
                  <p id={style.followsYou} style={{color:"grey"}}>
                  Follows you
                  </p>
                ) : null
              }
              </div>
              <p>{follower.Biography}</p>
            </div>
            <FollowButton userId={follower._id} />
          </div>
        ))
      )}
    </div>
  );
};

export default FollowersBody;
