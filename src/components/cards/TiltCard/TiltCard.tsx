"use client";
import * as React from 'react';
import styles from './tiltStyles.module.css';
import { Poppins } from "next/font/google";
import SlideButton from "../../buttons/auth/slideButton";
import { AiOutlineLogin } from "react-icons/ai";import Tilt from 'react-parallax-tilt';
import { signOut } from 'next-auth/react';



const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface ITiltCardProps {
  size?: string;
  icon: JSX.Element;
  title: string;
  buttonString? : string;
}

const TiltCard: React.FunctionComponent<ITiltCardProps> = (props) => {
  const { size, icon, title, buttonString } = props;
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
          {
            buttonString ? <div title='Sign Out' onClick={()=>signOut()} id={styles.iconHolder}><div id={styles.iconStyle}>{icon}</div></div> : 
            <div id={styles.iconHolder}><div id={styles.iconStyle}>{icon}</div></div>
          }
          <h1 className={font.className} id={styles.titleText}>{title}</h1>
          <div id={styles.paragraphContainer}>
            <div id={styles.textDiv}>
              <p>A simple appointment booking alert service!</p>
            </div>
          </div>
          
        </div>
      </Tilt>
    </>
  );
};

export default TiltCard;
