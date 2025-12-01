"use client";

import * as React from "react";
import styles from "./tiltStyles.module.css";
import { Poppins } from "next/font/google";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { useState, forwardRef, useEffect } from "react";
import { TbLetterC } from "react-icons/tb";
import { MdOutlineClose } from "react-icons/md";
import BlogForm from "@/components/forms/BlogForm/BlogForm";


const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});


interface ITiltModalBlogProps {
  setShowContent: Function;
  showContent: Boolean;
  getServerSideProps: Function;
}

// Use forwardRef to handle the `ref` prop
const TiltModalBlog = forwardRef<HTMLDivElement, ITiltModalBlogProps>((props, ref) => {
  const [clicked, setClicked] = useState(false); // State to track if the slide-out is triggered
  const { setShowContent,showContent, getServerSideProps} = props;
  //log user id for testing,
  const closeWindow = () => {
    setShowContent(false); // Trigger slide-out effect
  };
  useEffect(() => {
    if (showContent) {
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.style.overflow = "hidden";
      }, 0);
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showContent]);
  

  

  return (
    <motion.div
      initial={{ x: "-100vw" }}
      animate={{ x: clicked ? "-100vw" : 0 }}
      transition={{ type: "spring", stiffness: 70, damping: 20 }}
      ref={ref}
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
          <motion.div title="Close down" onClick={closeWindow} id={styles.iconHolder}>
            <div id={styles.iconStyle}><MdOutlineClose/></div>
          </motion.div>
          <div id={styles.inner}>
            <motion.div id={styles.logo}>
              <TbLetterC style={{ position: "absolute", height: "100%", zIndex: "2", color: "aliceblue", cursor:"pointer" }} />
            </motion.div>
            <BlogForm closeWindow={closeWindow} getServerSideProps={getServerSideProps}/>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
});

TiltModalBlog.displayName = "TiltModalBlog";

export default TiltModalBlog;
