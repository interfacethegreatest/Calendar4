"use client";
import * as React from 'react';
import styles from './tiltStyles.module.css';
import { Poppins } from "next/font/google";
import SlideButton from "../../buttons/auth/slideButton";
import { AiOutlineLogin } from "react-icons/ai";
import Tilt from 'react-parallax-tilt';
import { SessionContext, signOut } from 'next-auth/react';
import { animate, motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TbLetterD } from "react-icons/tb";
import fileTypeChecker from "file-type-checker";
import GetProfileImage from './modalComponents/GetProfileImage';


const COLOURS = [
  'rgba(159, 158, 158, 0.7)',
  'rgba(159, 158, 158, 0.5)',  
  'rgba(130, 129, 129, 0.35)', 
  'rgba(189, 188, 188, 0.2)', 
  'rgba(159, 158, 158, 0.17)'
];

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface ITiltModalProps {
  size?: string;
  icon: JSX.Element;
  title: string;
  buttonString : string;
  slideText : string;
  paragraph? : string;
  buttonMode? : string;
  session : Boolean;
  ref : React.MutableRefObject<undefined>
  height: number;
  width: number;
  setShowContent: Function;
}

const TiltModal: React.FunctionComponent<ITiltModalProps> = (props) => {
  const { slideText, buttonMode, paragraph, size, icon, title, buttonString, changeScene, session, ref, setShowContent, width, height } = props;
  const [ selection, setSelection ] = useState([true, false, false, false]);
  const [clicked, setClicked] = useState(false); // State to track if the slide-out is triggered
  const [moveModal, setModalMove] = useState(false)
  const colour = useMotionValue(COLOURS[0]);
  const border = `useMotionTemplate2px solid ${colour}`;
  const router = useRouter();
  const [nextSelection, setNextSelection] = useState(false);
  const handleHome = () => {
    router.push('/');
  };

  useEffect(() => {
    animate(colour, COLOURS, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  // Function to trigger slide-out animation
  const closeWindow = () => {
    setClicked(false); // Set the state to true to trigger the slide-out effect
  };

  function handleChildSlide(){
     setClicked(false);
  }
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState(''); // Store preview URL here

  const handleFileInputChange = (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      // When the file is loaded, detect its type (this part assumes you have a `fileTypeChecker`).
      reader.onload = () => {
        const detectedFile = fileTypeChecker.detectFile(reader.result);
        console.log(detectedFile); 
        setImage(file);
        setImagePreview(URL.createObjectURL(file)); // Create a URL for preview
      };

      reader.readAsArrayBuffer(file); // Use the FileReader API to read the file as an ArrayBuffer
    } catch (err) {
      console.error("Error: ", err.message);
    }
  };

  console.log(closeWindow)

  return (
    <motion.div
      initial={{ x: "-100vw" }} 
      animate={{ x: clicked ? "-100vw" : 0 }} // Slide out when clicked
      transition={{ type: "spring", stiffness: 70, damping: 20 }}
      ref={ref}
    >
      <Tilt scale={1} tiltMaxAngleX={2} tiltMaxAngleY={2}>
        <div style={{height:height, width:width, border: border}} id={styles.main}>
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
            <motion.div title='Close down' onClick={() => setShowContent(false)} id={styles.iconHolder} style={{ border }}>
              <div id={styles.iconStyle}>{icon}</div>
            </motion.div>
            <motion.div title='Close down' id={styles.iconHolder} style={{ position:"fixed", left:"46.6%",top:"52%", zIndex:10, opacity:"0"}}>
              <input type="file" name='file' onChange={handleFileInputChange} />
            </motion.div>
          {/* Inner */}
          <div id={styles.inner}>
            <motion.div id={styles.logo}>
            <TbLetterD style={{position:"absolute", height:"100%", zIndex:"2", color:"aliceblue"}} />
            </motion.div>
            {
              selection[0] ?
               <>
               <motion.div
                style={{ width: "525px", height: "525px" }} // Set appropriate dimensions
                initial={{ x: "-100vw" }}
                animate={{ x: moveModal ? "100vw" : 0 }}
                transition={{ type: "spring", stiffness: 70, damping: 20 }}
               >
                <GetProfileImage imagePreview={imagePreview} />
               </motion.div>
              </> : null
            }

          </div>
          <SlideButton 
            type="modalSkip"
            slide_text={slideText}
            text={"Skip For Now"}
            icon={<AiOutlineLogin/>} 
            width="250px"
            mode={buttonMode}
            animation={setModalMove} // animate leave of screen
            setScene={changeScene}
            session={session}
          />
        </div>
      </Tilt>
    </motion.div>
  );
};

export default TiltModal;
