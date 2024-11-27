import ModalInput from '@/components/input/ModalInput/ModalInput';
import * as React from 'react';
import style from "../tiltStyles.module.css"
import { Poppins } from 'next/font/google';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { CiMail } from 'react-icons/ci';

interface IGetProfileBioProps {
}

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

const GetProfileBio: React.FunctionComponent<IGetProfileBioProps> = (props) => {
  const [ animation, setAnimation ] = useState(true);
  return <>
  <motion.div
   initial={{ x: "-100vw" }} 
   animate={{ x: animation ? 0 : "-100vw" }} // Slide out when clicked
   transition={{ type: "spring", stiffness: 70, damping: 20 }}
   >
  <h1 id={style.modalTitle} className={font.className}>
    <b>
     Please Complete Your Bio
    </b>    
  </h1>
  <p id={style.innerText} className={font.className}>
    ..Fill out all the relative information. Then submit.
  </p>
  {
    //start input design
  }
  <br />
  <ModalInput
   name="email"
   label="Email address"
   type="text"
   icon={<CiMail/>}
   placeholder="example@example.com"
   register={undefined} 
   error={undefined} 
   disabled={false}/>
   </motion.div>
  </> ;
};

export default GetProfileBio;
