import * as React from 'react';
import styles from "../tiltStyles.module.css"
import { BiSolidCameraPlus } from 'react-icons/bi';
import { Poppins } from 'next/font/google';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';


interface IGetProfileImageProps {
  userId : string; // pass the userId to return a string,
}

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

const GetProfileImage: React.FunctionComponent<IGetProfileImageProps> = (props) => {
  const { userId } = props;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  useEffect(()=>{
    const fetchProfileImage = async ()=>{
      try {
        const response = await fetch(`/api/auth/getProfileImage?userId=${userId}`);
        if(!response.ok) {
          throw new Error('Failed to fetch image data.')
        }
        const data = await response.json();
        console.log(data.image);
        setImagePreview(data.image);
      } catch (error) {
        console.log("Error fetching profile image: " + error)
      }
    }
    fetchProfileImage();
  }, [userId])
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
      <img style={{zIndex:"3", position:"fixed", backgroundColor: "black"}} src="https://www.pngkit.com/png/detail/126-1262807_instagram-default-profile-picture-png.png" alt="Default Profile" width={100} height={100} />
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
    Upload by clicking the camera icon below.
    </p>
    </div>
    </motion.div>
  ) ;
};

export default GetProfileImage;

