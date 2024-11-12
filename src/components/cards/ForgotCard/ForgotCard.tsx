"use client";
import * as React from 'react';
import styles from './ForgotStyles.module.css';
import { Poppins } from "next/font/google";
import Tilt from 'react-parallax-tilt';
import ForgotForm from '@/components/forms/ForgotForm/ForgotForm';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface IForgotCardProps {
  title: string;
  changeScene: Function;
}

const ForgotCard: React.FunctionComponent<IForgotCardProps> = (props) => {
  const { title, changeScene } = props;
  const router = useRouter();
  console.log(changeScene)
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
      {/*<h1 id={styles.mainBannerText} className={font.className}>Make the most of your professional career.</h1>*/}
      <br />
      <br />
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
          <div id={styles.forgotDiv}>
           <h1 id={styles.titleText}>{title}</h1>
           <p id={styles.spanText}>Back to <a
                style={{
                  textDecoration: "underline",
                  color: "blue",
                  cursor: "pointer",
                  zIndex: 8,
                  position: "relative",
                }}
                onClick={() => {
                  /*router.push({
                    pathname: path,
                    query: {
                      tab: "signup",
                    },
                  });*/
                  handleSlideOut();
                  setTimeout(() => {
                    changeScene(1);
                 }, 1000); // Delay the state change by 1 second (or however long the animation lasts)
                }}
              >
                Sign up.
              </a></p>
           <ForgotForm/>
          </div>
        </div>
      </Tilt>
      </motion.div>
    </>
  );
};

export default ForgotCard;