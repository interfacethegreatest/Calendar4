"use client";
import * as React from 'react';
import styles from './tiltStyles.module.css';
import { Poppins } from "next/font/google";
import SlideButton from "../../buttons/auth/slideButton";
import { AiOutlineLogin } from "react-icons/ai";
import Tilt from 'react-parallax-tilt';
import { SessionContext, signOut } from 'next-auth/react';
import { animate, motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const COLOURS = [
  'rgba(159, 158, 158, 0.7)',
  'rgba(159, 158, 158, 0.5)',  
  'rgba(130, 129, 129, 0.35)', 
  'rgba(189, 188, 188, 0.2)', 
  'rgba(159, 158, 158, 0.17)'
];

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface ITiltCardProps {
  size?: string;
  icon: JSX.Element;
  title: string;
  buttonString : string;
  slideText : string;
  paragraph? : string;
  buttonMode? : string;
  changeScene : Function;
  session : Boolean;
}

const TiltCard: React.FunctionComponent<ITiltCardProps> = (props) => {
  const { slideText, buttonMode, paragraph, size, icon, title, buttonString, changeScene, session } = props;
  const [clicked, setClicked] = useState(false); // State to track if the slide-out is triggered
  const colour = useMotionValue(COLOURS[0]);
  const border = useMotionTemplate`2px solid ${colour}`;
  const router = useRouter();
  const handleHome = () => {
    router.push('/');
  };

  useEffect(() => {
    animate(colour, COLOURS, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  // Function to trigger slide-out animation
  const handleSlideOut = () => {
    setClicked(true); // Set the state to true to trigger the slide-out effect
  };

  return (
    <motion.div
      initial={{ x: "-100vw" }} 
      animate={{ x: clicked ? "-100vw" : 0 }} // Slide out when clicked
      transition={{ type: "spring", stiffness: 70, damping: 20 }}
    >
      <Tilt scale={1} tiltMaxAngleX={2} tiltMaxAngleY={2}>
        <div id={styles.main}>
        <div id={styles.tiles}>
              <div id={styles.tile1}></div>
              <div id={styles.tile2}></div>
              <div id={styles.tile3}></div>
              <div id={styles.tile4}></div>
              <div id={styles.tile5}></div>
              <div id={styles.tile6}></div>
              <div id={styles.tile7}></div>
              <div id={styles.tile9}></div>
              <div id={styles.tile10}></div>
              <div id={styles.tile12}></div>
              <div id={styles.tile13}></div>
              <div id={styles.tile15}></div>
              <div id={styles.loader}></div>
              <div id={styles.loader2}></div>
              <div id={styles.loader3}></div>
              <div id={styles.loader4}></div>
              <div id={styles.loader5}></div>
              <div id={styles.loader6}></div>
            </div>
          {
            buttonString !== "Welcome!" ? 
            <motion.div title='Log Out' onClick={() => signOut()} id={styles.iconHolder} style={{ border }}>
              <div id={styles.iconStyle}>{icon}</div>
            </motion.div> : 
            <motion.div onClick={handleHome} title='Home' id={styles.iconHolder} style={{ border }}>
              <div id={styles.iconStyle}>{icon}</div>
            </motion.div>
          }
          <h1 className={font.className} id={styles.titleText}>{title}</h1>
          <div id={styles.paragraphContainer}>
            <div id={styles.textDiv}>
              <p>{paragraph || "A simple appointment booking alert service!"}</p>
            </div>
          </div>
          {/* Pass the handleSlideOut function to SlideButton */}
          <SlideButton 
            type="button"
            slide_text={slideText}
            text={buttonString}
            icon={<AiOutlineLogin/>} 
            width="250px"
            mode={buttonMode}
            animation={handleSlideOut} // animate leave of screen
            setScene={changeScene}
            session={session}
          />
        </div>
      </Tilt>
    </motion.div>
  );
};

export default TiltCard;
