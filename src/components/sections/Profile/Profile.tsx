import * as React from 'react';
import { motion } from 'framer-motion';
import style from './style.module.css';
import { useRef, useState } from 'react';
import useMousePosition from '@/components/misc/GlowEffect/useMousePartition';
import GlowEffect from '@/components/misc/GlowEffect/GlowEffect';
import FollowButton from '@/components/buttons/followButton/FollowButton';
import GenerateModal from '@/components/buttons/generateModal/generateModal';
import LikeButton from '@/components/buttons/LikeButton/LikeButton';
import { Poppins } from 'next/font/google';
import { RiMapPin2Fill } from "react-icons/ri";
import SunScene from '@/components/react three fibre/sunScene/SunScene';
import MoonScene from '@/components/react three fibre/moonScene/MoonScene';
import EarthScene from '@/components/react three fibre/EarthScene/EarthScene';
import router from 'next/router';

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface IProfileProps {
  user: any,
  session: any,
  imageString: string | null,
  clicked: boolean,
  setClicked: React.Dispatch<React.SetStateAction<boolean>>,
  setShowContent: Function,
  isLiked: boolean,
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>,
  userString: string | null,
  descriptionString: string | null,
  websiteString: string | null,
}

const Profile: React.FunctionComponent<IProfileProps> = (props) => {
  const { user, imageString, clicked, setClicked, session, setShowContent, isLiked, setIsLiked,
   userString, descriptionString, websiteString,
  } = props;

  const [newFollowers, setFollowing] = useState(user.followers.length);
  const divRef = useRef(null);
  const { x, y } = useMousePosition(divRef);

  // Define Framer Motion variants for the profileOuter animation.
  const outerVariants = {
    rest: {
      width: '50%',
      marginTop:'7.5%',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    hover: {
      width: '96%',
      marginTop: '0',
      height: '425px',
      transition: {
        duration: 0.25,
        ease: 'easeInOut',
      },
    },
  };

  return (
    // Wrap everything in a motion.div that controls the hover state.
    <motion.div 
      className={style.profileContainer} 
      initial="rest" 
      whileHover="hover" 
      animate="rest"
      style={{ border:"1px solid transparent", paddingTop:'0',}}
    >
      <motion.div id={style.profileOuter} variants={outerVariants}>
        
      </motion.div>
      {/* Profile wrapper and primary content */}
      <div id={style.profileWrapper}>
        <div id={style.profile}>
          <div id={style.profileHeaderContainer}>
            <div id={style.profileHeader}>
              <div id={style.profileHeaderBackground} ref={divRef} style={{ position:"relative" }}>
                {(x !== null && y !== null) && (
                  <GlowEffect x={x} y={y}/>
                )}
              </div>
            </div>
            <div id={style.profileOutline}>
              { imageString ? 
                <img id={style.image} src={ imageString } alt="" /> :
                <img id={style.image} src={ user.image } alt="" /> 
              }
            </div>
          </div>
          <div id={style.profileBodyContainer}>
            <div id={style.buttonContainer}>
              {session?.id === user._id ? (
                <GenerateModal setShowContent={setShowContent} fields="Edit" />
              ) : session ? (
                <LikeButton
                  isLiked={isLiked}
                  setIsLiked={setIsLiked}
                  userId={user._id}
                  followers={newFollowers}
                  setFollowers={setFollowing}
                />
              ) : null}
              <div id={style.planetContainer}>
                <SunScene/>
              </div>
            </div>
            <br />
            <div id={style.titleContainer}>
              <h1 className={font.className}>{userString ? userString : user.name}</h1>
              <p>@{userString ? userString : user.name}</p>
            </div>
            <div id={style.descriptionContainer}>
              <h6 id={style.descriptionTitle} style={{ marginBottom: '0px' }}>
                <u className={font.className}><b>Description</b></u>
              </h6>
              <p>
                {descriptionString ? descriptionString : user.Biography}
              </p>
            </div>
            { (websiteString || user.Website) && (
              <div id={style.websiteContainer}>
                <RiMapPin2Fill style={{ marginTop:"3px" }} title='Website link' color='aliceblue' size={20}/>
                <p id={style.websiteText}>
                  <a style={{ color:"grey" }} href={websiteString ? websiteString : user.Website}>
                    {websiteString ? websiteString : user.Website}
                  </a>
                </p>
              </div>
            )}
            <div id={style.socialContainer}>
          <div id={style.followersContainer}>
            <a
              style={{ color:"aliceblue", textDecoration:"none" }}
              href={`/user/${user._id}/followers`}
            >
              {newFollowers}
            </a>
            <h6 id={style.location} style={{ color: 'GrayText' }}>
              <a style={{ color: 'grey', textDecoration:"none" }} href={`/user/${user._id}/followers`}>
                Followers
              </a>
            </h6>
          </div>
          <div id={style.followingContainer}>
            <a
              href="#"
              style={{ color:"aliceblue", textDecoration:"none" }}
              onClick={(e) => {
                e.preventDefault();
                router.push({
                  pathname: `/user/${user._id}/followers`,
                  query: { selected: 'false' },
                });
              }}
            >
              {user.following.length}
            </a>
            <h6 id={style.location} style={{ color: 'GrayText' }}>
              <a 
                href="#"
                style={{ color:"grey", textDecoration:"none" }}
                onClick={(e)=>{
                  e.preventDefault();
                  router.push({
                    pathname: `/user/${user._id}/followers`,
                    query: { selected: 'false' },
                  });
                }}
              >
                Following
              </a>
            </h6>
          </div>
        </div>
          </div>
          <div id={style.tiles}>
            <div id={style.tile1}></div>
            <div id={style.tile2}></div>
            <div id={style.tile3}></div>
            <div id={style.tile4}></div>
            <div id={style.tile5}></div>
            <div id={style.tile6}></div>
            <div id={style.tile7}></div>
            <div id={style.tile9}></div>
            <div id={style.tile10}></div>
            <div id={style.tile12}></div>
            <div id={style.tile13}></div>
            <div id={style.tile15}></div>
            <div id={style.loader}></div>
            <div id={style.loader2}></div>
            <div id={style.loader3}></div>
            <div id={style.loader4}></div>
            <div id={style.loader5}></div>
            <div id={style.loader6}></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
