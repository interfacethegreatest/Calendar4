"use client";
import * as React from 'react';
import styles from './ForgotStyles.module.css';
import { Poppins } from "next/font/google";
import Tilt from 'react-parallax-tilt';
import ForgotForm from '@/components/forms/ForgotForm/ForgotForm';
import { useRouter } from 'next/router';

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface IForgotCardProps {
  title: string;
}

const ForgotCard: React.FunctionComponent<IForgotCardProps> = (props) => {
  const { title } = props;
  const router = useRouter();
  const path = router.pathname;
  return (
    <>
      <h1 id={styles.mainBannerText} className={font.className}>Make the most of your professional career.</h1>
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
           <p id={styles.spanText}>Back to <a style={{ textDecoration: "underline", color: "blue", cursor: "pointer", zIndex:8, position:"relative" }} onClick={() => {
             router.push('/auth');
           }}>Sign in.</a></p>
           <ForgotForm/>
          </div>
        </div>
      </Tilt>
    </>
  );
};

export default ForgotCard;