import * as React from 'react';
import styles from "../tiltStyles.module.css"
import { BiSolidCameraPlus } from 'react-icons/bi';
import { Poppins } from 'next/font/google';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface IGetProfileImageProps {
  imagePreview: string | null;
}

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

const GetProfileImage: React.FunctionComponent<IGetProfileImageProps> = (props) => {
  const { imagePreview } = props; 
  const [clicked, setClicked] = useState(true);

  return (
  <motion.div
   initial={{ x: "0vw" }} 
   animate={{ x: clicked ? 0 : "-100vw" }} // Slide out when clicked
   transition={{ type: "spring", stiffness: 70, damping: 20 }}
  >
  <div id={styles.imageContainer} onClick={()=>{}}>
    {
      imagePreview ? 
      <img src={imagePreview} alt="Preview" width={100} height={100} style={{zIndex:3, position:"absolute", objectFit:"cover", background:"black"}}/>
      :
      <img style={{zIndex:"3", position:"fixed", backgroundColor: "black"}} src="/default-profile.jpg" alt="Default Profile" width={100} height={100} />
    }
     <BiSolidCameraPlus style={{cursor:"pointer", zIndex:"4", color:"aliceblue"}} onClick={()=>alert('123')} size={"25px"}/>
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

