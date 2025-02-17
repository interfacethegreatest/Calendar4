"use client";
import * as React from 'react';
import styles from './newUser.module.css';
import { Poppins } from "next/font/google";
import { AiOutlineLogin } from "react-icons/ai";
import Tilt from 'react-parallax-tilt';
import { getCsrfToken, signOut } from 'next-auth/react';
import { animate, motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Router, useRouter } from 'next/router';
import SunScene from '../../react three fibre/sunScene/SunScene'
import NewUserForm from '@/components/forms/newUserForm/NewUserForm';
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

interface INewUserCardProps {
  size?: string;
  icon: JSX.Element;
  title: string;
  buttonString : string;
  paragraph? : string;
}

const NewUserCard: React.FunctionComponent<INewUserCardProps> = (props) => {
  const {paragraph, icon, title } = props;
  const colour = useMotionValue(COLOURS[0])
  const border = useMotionTemplate`2px solid ${colour}`;
  const router = useRouter();
  const [sceneLoaded, setSceneLoaded] = useState(false);

  useEffect(() => {
    // Mock scene loading complete after a delay
    const timer = setTimeout(() => {
      setSceneLoaded(true); // Set to true when Scene has "loaded"
    }, 500); // Adjust delay as needed based on actual loading time

    return () => clearTimeout(timer); // Clean up the timer
  }, []);
  const handleHome = () => {
    router.push('/')
  }
  useEffect(() => {
    animate(colour, COLOURS, {
        ease: "easeInOut",
        duration: 10,
        repeat: Infinity,
        repeatType: "mirror",
    });
  }, []);
  return (
    <>
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
          <motion.div onClick={()=>{handleHome()}} title='Home' id={styles.iconHolder} style={{border}}><div id={styles.iconStyle}>{icon}</div></motion.div>
          <h1 className={font.className} id={styles.titleText}><u>{title}</u></h1>
          <div id={styles.paragraphContainer}>
            <div id={styles.textDiv}>
              <p id={styles.untouchable}>{paragraph? paragraph : "A simple appointment booking alert service!"}</p>
            </div>
            {
              sceneLoaded && (
                <NewUserForm/>
              )
            }
          </div>
        </div>
        <div id={styles.planetContainer}>
         <div id={styles.planet}>
          <SunScene/>
         </div>
        </div>
      </Tilt>
    </>
  );
};

export default NewUserCard;
