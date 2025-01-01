import * as React from 'react';
import style from './style.module.css';
import { Poppins } from 'next/font/google';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { FcLikePlaceholder, FcLike, FcDislike } from 'react-icons/fc';

interface ILikeButtonProps {}

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

const LikeButton: React.FunctionComponent = () => {
  const [isLiked, setIsLiked] = React.useState(false); // State to toggle the icon
  const [isHovered, setIsHovered] = React.useState(false); // State to track hover
  const colour = useMotionValue(COLOURS[0]);
  const border = useMotionTemplate`2px solid ${colour}`;

  const handleClick = () => {
    setIsLiked(!isLiked); // Toggle between liked and unliked state
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
      whileHover={{ scale: 1.1 }} // Slightly enlarge on hover
      whileTap={{ scale: 1.1 }} // Enlarge on click
      transition={{ type: 'spring', stiffness: 300, damping: 15 }} // Smooth spring animation
      onClick={handleClick} // Handle the click event
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ border }}
    >
      <motion.span>
        {isLiked && isHovered ? (
          <FcDislike size={20} />
        ) : isLiked ? (
          <FcLike size={20} />
        ) : (
          <FcLikePlaceholder size={20} />
        )}
      </motion.span>
    </motion.button>
  );
};

export default LikeButton;
