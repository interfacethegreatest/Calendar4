import * as React from 'react';
import styles from "../tiltStyles.module.css"
import { BiSolidCameraPlus } from 'react-icons/bi';
import { Poppins } from 'next/font/google';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface IGetProfileImageProps {
}

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

const GetProfileImage: React.FunctionComponent<IGetProfileImageProps> = (props) => {
  const [clicked, setClicked] = useState(true);
  return (
  <motion.div
   initial={{ x: "0vw" }} 
   animate={{ x: clicked ? 0 : "-100vw" }} // Slide out when clicked
   transition={{ type: "spring", stiffness: 70, damping: 20 }}
  >
  <div id={styles.imageContainer} onClick={()=>{}}>
    <img style={{zIndex:"1"}} src="/default-profile.jpg" alt="Default Profile" width={100} height={100} />
    <div onClick={()=>alert('321')} id={styles.clickableContainer}>
     <BiSolidCameraPlus style={{cursor:"pointer", zIndex:"4"}} onClick={()=>alert('123')} size={"25px"}/>
    </div>
   </div>
    <div style={{display:"flex", flexDirection:"column"}}>
    <h1 id={styles.modalTitle} className={font.className}>
        <b>
        Pick a Profile Picture
        </b>
    </h1>
    <p id={styles.innerText}>
    Please upload a favourite selfie. Upload below.
    </p>
    </div>
    </motion.div>
  ) ;
};

export default GetProfileImage;

function setClicked(arg0: boolean) {
    throw new Error('Function not implemented.');
}

