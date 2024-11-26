"use client";

import * as React from "react";
import styles from "./tiltStyles.module.css";
import { Poppins } from "next/font/google";
import SlideButton from "../../buttons/auth/slideButton";
import { AiOutlineLogin } from "react-icons/ai";
import Tilt from "react-parallax-tilt";
import { signOut } from "next-auth/react";
import { animate, motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useState, useEffect, forwardRef } from "react";
import { useRouter } from "next/router";
import { TbLetterD } from "react-icons/tb";
import fileTypeChecker from "file-type-checker";
import GetProfileImage from "./modalComponents/GetProfileImage";
import { Slide } from "react-toastify";
import GetProfileBio from "./modalComponents/GetProfileBio";

const COLOURS = [
  "rgba(159, 158, 158, 0.7)",
  "rgba(159, 158, 158, 0.5)",
  "rgba(130, 129, 129, 0.35)",
  "rgba(189, 188, 188, 0.2)",
  "rgba(159, 158, 158, 0.17)",
];

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface ITiltModalProps {
  size?: string;
  icon: JSX.Element;
  title: string;
  buttonString: string;
  slideText: string;
  paragraph?: string;
  buttonMode?: string;
  session: boolean;
  height: number;
  width: number;
  setShowContent: (value: boolean) => void;
}

// Use forwardRef to handle the `ref` prop
const TiltModal = forwardRef<HTMLDivElement, ITiltModalProps>((props, ref) => {
  const {
    slideText,
    buttonMode,
    paragraph,
    size,
    icon,
    title,
    buttonString,
    session,
    setShowContent,
    width,
    height,
  } = props;

  const [selection, setSelection] = useState([true, false]);
  const [clicked, setClicked] = useState(false); // State to track if the slide-out is triggered
  const colour = useMotionValue(COLOURS[0]);
  const border = useMotionTemplate`2px solid ${colour}`;
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(""); // Store preview URL here

  useEffect(() => {
    animate(colour, COLOURS, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const closeWindow = () => {
    setShowContent(false); // Trigger slide-out effect
  };

  const handleCloseContent = () => {
    setSelection([false, true]);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const allowedTypes = ["image/png", "image/jpeg"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only PNG and JPG files are allowed.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const detectedFile = fileTypeChecker.detectFile(reader.result as ArrayBuffer);
        console.log(detectedFile);
        setImage(file);
        setImagePreview(URL.createObjectURL(file)); // Create a URL for preview
      };

      reader.readAsArrayBuffer(file);
    } catch (err: any) {
      console.error("Error: ", err.message);
    }
  };

  return (
    <motion.div
      initial={{ x: "-100vw" }}
      animate={{ x: clicked ? "-100vw" : 0 }}
      transition={{ type: "spring", stiffness: 70, damping: 20 }}
      ref={ref}
    >
      <Tilt scale={1} tiltMaxAngleX={2} tiltMaxAngleY={2}>
        <div style={{ height, width, border }} id={styles.main}>
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
          <motion.div title="Close down" onClick={closeWindow} id={styles.iconHolder} style={{ border }}>
            <div id={styles.iconStyle}>{icon}</div>
          </motion.div>

          {selection[0] ? (
            <motion.div
              title="Upload Image"
              id={styles.iconHolder}
              style={{ position: "fixed", left: "46.6%", top: "52%", zIndex: 10, opacity: 0, cursor: "pointer" }}
            >
              <input type="file" name="file" onChange={handleFileInputChange} />
            </motion.div>
          ) : null}

          <div id={styles.inner}>
            <motion.div id={styles.logo}>
              <TbLetterD style={{ position: "absolute", height: "100%", zIndex: "2", color: "aliceblue" }} />
            </motion.div>

            {selection[0] ? (
              <>
                <div>
                  <GetProfileImage imagePreview={imagePreview} />
                </div>
                <SlideButton
                  type="modalSkip"
                  text={image === null ? "Skip - Continue Editing": "Next," }
                  slide_text={image === null ? "Continue," : "Continue to bio,"}
                  icon={<AiOutlineLogin />}
                  width="250px"
                  mode={buttonMode}
                  animation={setClicked}
                  setScene={handleCloseContent}
                />
              </>
            ) : (
              <>
                <GetProfileBio/>
                <SlideButton
                  type="modalSave"
                  text="Save!"
                  slide_text="Save your bio,"
                  icon={<AiOutlineLogin />}
                  width="250px"
                  mode={buttonMode}
                  animation={null}
                  setScene={null}
                />
              </>
            )}
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
});

TiltModal.displayName = "TiltModal"; // Add a display name for forwardRef component

export default TiltModal;
