"use client";
import * as React from 'react';
import styles from './LoginStyles.module.css'
import { Poppins } from "next/font/google";
import Tilt from 'react-parallax-tilt';
import LoginForm from '@/components/forms/LoginForm/LoginForm';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface ILoginCardProps {
  size?: string;
  title: string;
  buttonString? : string;
  callbackUrl : string;
  csrfToken: string;
  providers:any;
  changeScene:Function; // initiates leave function,
}

const LoginCard: React.FunctionComponent<ILoginCardProps> = (props) => {
  const { title, providers, callbackUrl, csrfToken, changeScene } = props;
  const router = useRouter();
  const [clicked, setClicked] = useState(false); // State to track if the slide-out is triggered
  const path = router.pathname;

  // Trigger the animation once the component is mounted
  useEffect(() => {
    // Trigger the animation immediately when the component loads
    setClicked(true);
  }, []); // Empty dependency array to run only once after mount

  const handleSlideOut = () => {
    setClicked(!true); // Set the state to true to trigger the slide-out effect
  };

  return (
    <>
      <motion.div
        initial={{ x: "-100vw" }} 
        animate={{ x: clicked ? "0" : "-100vw" }} // Slide in when clicked (triggered on mount)
        transition={{ type: "spring", stiffness: 70, damping: 20 }}
        style={{ 
          width: "100vw",  // Ensure the element does not exceed the viewport width
          overflow: "hidden",  // Prevent overflow during animation
          position: "absolute", // Prevent positioning issues by keeping it within bounds
          top: 40, 
          left: 0, 
          right: 0, 
          bottom: 0
        }}
      >
        <h1 id={styles.mainBannerText} className={font.className}>
          Make the most of your professional career.
        </h1>
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
            <h1 id={styles.titleText}>{title}</h1>
            <p id={styles.spanText}>
              Don't have an account?{" "}
              <a
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
                    changeScene(2);
                 }, 1000); // Delay the state change by 1 second (or however long the animation lasts)
                }}
              >
                Sign up.
              </a>
            </p>
            <LoginForm changeScene={changeScene} animation={handleSlideOut} providers={providers} csrfToken={csrfToken} callbackUrl={callbackUrl} />
          </div>
        </Tilt>
      </motion.div>
    </>
  );
};

export default LoginCard;
