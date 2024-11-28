import ModalInput from '@/components/input/ModalInput/ModalInput';
import * as React from 'react';
import style from "../tiltStyles.module.css"
import { Poppins } from 'next/font/google';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { CiMail } from 'react-icons/ci';
import { useSession } from 'next-auth/react';

interface IGetProfileBioProps {
}

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

const GetProfileBio: React.FunctionComponent<IGetProfileBioProps> = (props) => {
  const [ animation, setAnimation ] = useState(true);
  const { data : session } = useSession();
  console.log(session)
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
   name="username"
   label="Username"
   type="text"
   icon={<CiMail />}
   register={undefined}
   error={undefined}
   disabled={false} 
   placeholder={''} 
   height={null}/>
  <br />
  <ModalInput
   name="descrition"
   label="Description"
   type="text"
   icon={<CiMail />}
   register={undefined}
   error={undefined}
   disabled={false} 
   placeholder={''} 
   height={150}/>
  </motion.div>
  </> ;
};

export default GetProfileBio;
