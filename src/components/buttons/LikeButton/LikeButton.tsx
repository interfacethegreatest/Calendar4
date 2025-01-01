import * as React from 'react';
import style from './style.module.css'
import { Poppins } from 'next/font/google';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { FcLikePlaceholder } from 'react-icons/fc';


interface ILikeButtonProps {
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["400"],
})

const COLOURS = [
  'rgba(159, 158, 158, 0.7)',
  'rgba(159, 158, 158, 0.5)',  
  'rgba(130, 129, 129, 0.35)', 
  'rgba(189, 188, 188, 0.2)', 
];

const LikeButton: React.FunctionComponent<ILikeButtonProps> = (props) => {
  const colour = useMotionValue(COLOURS[0]);
  const border = useMotionTemplate`2px solid ${colour}`

  return<>
    <motion.button title='Follow' style={{border, position:"relative", zIndex:1}} className={font.className} id={style.editProfile} onClick={()=>setShowContent(true)}>
    <span id={style.mainText}><FcLikePlaceholder /></span>
    </motion.button>
  </> ;
};

export default LikeButton;