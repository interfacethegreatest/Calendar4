"use client";

import * as React from "react";
import styles from "./tiltStyles.module.css";
import { Poppins } from "next/font/google";
import SlideButton from "../../buttons/auth/slideButton";
import { AiOutlineLogin } from "react-icons/ai";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { useState, forwardRef, useEffect } from "react";
import { TbLetterC } from "react-icons/tb";
import fileTypeChecker from "file-type-checker";
import ProfileForm from "@/components/forms/profileForm/ProfileForm";
import GetProfileImage from "../TiltModal/modalComponents/GetProfileImage";
import { MdOutlineClose } from "react-icons/md";
import { z } from "zod";
import AboutMeForm from "@/components/forms/AboutMeForm/AboutMeForm";


const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const FormSchema = z.object({
  Biography: z
    .string()
    .url({ message: "Please submit a valid URL." })
    .optional()
    .or(z.literal('')),
});

interface ITiltModalAboutMeProps {
  setShowContent: Function;
}

// Use forwardRef to handle the `ref` prop
const TiltModalAboutMe = forwardRef<HTMLDivElement, ITiltModalAboutMeProps>((props, ref) => {
  const [clicked, setClicked] = useState(false); // State to track if the slide-out is triggered
  const { setShowContent } = props;
  //log user id for testing,
  const closeWindow = () => {
    setShowContent(false); // Trigger slide-out effect
  };

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
            <AboutMeForm/>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
});

TiltModalAboutMe.displayName = "TiltModalAboutMe";

export default TiltModalAboutMe;
