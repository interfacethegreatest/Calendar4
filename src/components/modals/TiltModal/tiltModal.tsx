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
  height: number;
  width: number;
  setShowContent: (value: boolean) => void;
  imageString : Function, 
  username: Function,
  description: Function,
  website: Function,
  userId:string,
}

// Use forwardRef to handle the `ref` prop
const TiltModal = forwardRef<HTMLDivElement, ITiltModalProps>((props, ref) => {
  const {
    buttonMode,
    icon,
    setShowContent,
    width,
    height,
    imageString,
    username,
    description,
    website,
    userId,
  } = props;
  //log user id for testing,
  console.log(userId)
  const [userData, setUserData] = useState(null);
  const [selection, setSelection] = useState([true, false]);
  const [clicked, setClicked] = useState(false); // State to track if the slide-out is triggered
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(""); // Store preview URL here
  //const { edgestore } = useEdgeStore();
  const closeWindow = () => {
    setShowContent(false); // Trigger slide-out effect
  };

  const handleCloseContent = () => {
    setSelection([false, true]);
  };

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      // Catch user submitted file
      const file = event.target.files?.[0];
      if (!file) return;
      //catch wrong file types
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only PNG and JPG files are allowed.");
        return;
      }
    

      //read and save file type 
      const reader = new FileReader();
      reader.onload = () => {
        const detectedFile = fileTypeChecker.detectFile(reader.result as ArrayBuffer);
        console.log(detectedFile);
        console.log(file)
        setImage(file);
        setImagePreview(URL.createObjectURL(file)); // Create a URL for preview
      };
      //upload to edgestore...
      /*const res = await edgestore.myPublicImages.upload({
        file,
        onProgressChange: (progress) =>{
          console.log(progress)
        },
        
      })*/
      //console.log(res.url);

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
        <div style={{ height, width, }} id={styles.main}>
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
              <TbLetterC style={{ position: "absolute", height: "100%", zIndex: "2", color: "aliceblue", cursor:"pointer" }} />
            </motion.div>

            {selection[0] ? (
              <>
                <div>
                  <GetProfileImage newImage={imagePreview} userId={userId}/>
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
                <ProfileForm 
                 imageString={imageString}
                 website={website} 
                 username={username} 
                 description={description} 
                 image={image}
                 closeWindow={closeWindow}
                 userData={userData}/>
              </>
            )}
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
});

TiltModal.displayName = "TiltModal";

export default TiltModal;
