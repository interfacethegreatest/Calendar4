"use client";
import * as React from 'react';
import styles from './RegisterStyles.module.css';
import { Poppins } from "next/font/google";
import SlideButton from "../../buttons/auth/slideButton";
import Tilt from 'react-parallax-tilt';
import { GoSignOut } from "react-icons/go";
import { AiFillLock } from 'react-icons/ai';



const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface ITiltCardProps {
  size?: string;
  title: string;
  buttonString? : string;
}

const TiltCard: React.FunctionComponent<ITiltCardProps> = (props) => {
  const { size, title, buttonString } = props;
  return (
    <>
    <h1 id={styles.mainBannerText} className={font.className}>Make the most of your professional career.</h1>
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
          <h1 id={styles.titleText}>Sign Up</h1>
          <div>
            <SlideButton 
              type="button"
              slide_text="Secure sign up"
              text= {"Submit" }
              icon={<AiFillLock/>} 
              width="250px"
              mode="redirect" 
              />
          </div>
        </div>
      </Tilt>
    </>
  );
};

export default TiltCard;
