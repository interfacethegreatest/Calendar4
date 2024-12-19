"use client";
import * as React from 'react';
import styles from './RegisterStyles.module.css';
import { Poppins } from "next/font/google";
import Tilt from 'react-parallax-tilt';
import RegisterForm from '@/components/forms/RegisterForm/RegisterForm';
import ResetForm from '@/components/forms/ResetForm/ResetForm';
import { motion } from 'framer-motion';
import { useState } from 'react';

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface ITiltCardProps {
  size?: string;
  title: string;
  buttonString? : string;
  callbackUrl : string;
  csrfToken: string;
  providers:any;
  changeScene:Function;
}

const TiltCard: React.FunctionComponent<ITiltCardProps> = (props) => {
  const { size, title, buttonString, providers, callbackUrl, csrfToken, changeScene} = props;
  const [clicked, setClicked] = useState(false); // State to track if the slide-out is triggered
  const handleSlideOut = () => {
    setClicked(true); // Set the state to true to trigger the slide-out effect
  };
  return (
    <>
    <motion.div
      initial={{ x: "-100vw" }} 
      animate={{ x: clicked ? "-100vw" : 0 }} // Slide out when clicked
      transition={{ type: "spring", stiffness: 70, damping: 20 }}
    >
      <br />
      <div>
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
          <h1 id={styles.titleText}>Reset Password</h1>
          <p id={styles.spanText}>Sign in instead? <a
           onClick={()=>{
            handleSlideOut();
            setTimeout(() => {
              changeScene(1);
            }, 1000); // Delay the state change by 1 second (or however long the animation lasts)
           }}
           style={{position:"relative", zIndex:8, color:"blue", textDecoration:"underline"}}>Sign in</a></p>
          <RegisterForm providers={providers} csrfToken={csrfToken} callbackUrl={callbackUrl}/>
        </div>
      </Tilt>
      </div>
      </motion.div>
    </>
  );
};

export default TiltCard;