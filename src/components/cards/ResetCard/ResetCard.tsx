"use client";
import * as React from 'react';
import styles from './ResetStyles.module.css';
import { Poppins } from "next/font/google";
import Tilt from 'react-parallax-tilt';
import ResetForm from '@/components/forms/ResetForm/ResetForm';

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface IResetCardProps {
  size?: string;
  title: string;
  buttonString? : string;
  callbackUrl : string;
  csrfToken: string;
  providers:any;
}

const ResetCard: React.FunctionComponent<IResetCardProps> = (props) => {
  const { size, title, buttonString, providers, callbackUrl, csrfToken} = props;
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
          <h1 id={styles.titleText}>Reset Password</h1>
          <p id={styles.spanText}>Sign in instead? <a style={{position:"relative", zIndex:8}} href="/auth">Sign in</a></p>
          <ResetForm providers={providers} csrfToken={csrfToken} callbackUrl={callbackUrl}/>
        </div>
      </Tilt>
    </>
  );
};

export default ResetCard;