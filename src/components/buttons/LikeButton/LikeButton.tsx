import * as React from 'react';
import style from './style.module.css';
import { Island_Moments, Poppins } from 'next/font/google';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { FcLikePlaceholder, FcLike, FcDislike } from 'react-icons/fc';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Session } from 'inspector';

interface ILikeButtonProps {
  userId: string;
  followers : number;
  setFollowers: React.Dispatch<React.SetStateAction<number>>;
  isLiked : boolean;
  setIsLiked : Function;
}

const font = Poppins({
  subsets: ['latin'],
  weight: ['400'],
});

const COLOURS = [
  'rgba(159, 158, 158, 0.7)',
  'rgba(159, 158, 158, 0.5)',
  'rgba(130, 129, 129, 0.35)',
  'rgba(189, 188, 188, 0.2)',
];

const LikeButton: React.FunctionComponent<ILikeButtonProps> = (props) => {
  const { userId, followers, setFollowers, isLiked, setIsLiked } = props;
  const { data: session } = useSession();
  // State to toggle the icon
  const [isHovered, setIsHovered] = React.useState(false); // State to track hover
  const colour = useMotionValue(COLOURS[0]);
  const border = useMotionTemplate`2px solid ${colour}`;
  const setFollowing = async () =>{
    try {
     //increment userId's followers +1,
     //increment session.id's (the user viewing the page's details) following +1,
     const { data } = await axios.post('/api/auth/addFollower',{
      userId, session
     });
     console.log(data.message)
     setFollowers(data.message)
    } catch (error : any) {
        toast.error(error);
    }
  }
  const removeFollowing = async () =>{
    try {
      const { data } = await axios.post('/api/auth/removeFollower',{
        userId, session
       });
       setFollowers(data.message)
    } catch (error : any) {
      toast.error(error)
    }
  }


  const handleClick = () => {
    setIsLiked(!isLiked); // Toggle between liked and unliked state
    if (!isLiked) {
      setFollowing();
    } else{
      removeFollowing();
      setFollowers(followers-1)
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <motion.button
      title={isLiked ? 'Unfollow' : 'Follow'}
      id={style.editProfile}
      //whileHover={{ scale: 1.1 }} // Slightly enlarge on hover
      whileTap={{ scale: 1.1 }} // Enlarge on click
      animate={{
        width: isLiked ? '43px' : '96px', // Animate width based on isLiked state
      }}
      initial={{
        width: '96px', // Initial width
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 15,
      }} // Smooth spring animation
      onClick={handleClick} // Handle the click event
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ border }}
    >
      <motion.span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {isLiked && isHovered ? (
          <FcDislike size={20} />
        ) : isLiked ? (
          <FcLike size={20} />
        ) : (
          <>
            <FcLikePlaceholder size={20} />
            <span>Follow</span>
          </>
        )}
      </motion.span>
    </motion.button>
  );
};

export default LikeButton;
