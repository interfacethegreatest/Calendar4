"use client";
import * as React from 'react';
import styles from './LoginStyles.module.css';
import { Poppins } from "next/font/google";
import Tilt from 'react-parallax-tilt';
import LoginForm from '@/components/forms/LoginForm/LoginForm';
import { useRouter } from 'next/router';



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
}

const LoginCard: React.FunctionComponent<ILoginCardProps> = (props) => {
  const { callbackUrl, csrfToken} = props;
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
          <h1 id={styles.titleText}>Sign Up</h1>
          <p id={styles.spanText}>Don't have an account? <a style={{ textDecoration: "underline", color: "blue", cursor: "pointer", zIndex:8, position:"relative" }} onClick={() => {
            router.push({
              pathname: path,
              query: {
                tab: 'signup',
              }
            })
          }}>Sign up.</a></p>
          <LoginForm csrfToken={csrfToken} callbackUrl={callbackUrl}/>
        </div>
      </Tilt>
    </>
  );
};

export default LoginCard;