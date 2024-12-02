import ModalInput from '@/components/input/ModalInput/ModalInput';
import * as React from 'react';
import style from "../tiltStyles.module.css"
import { Poppins } from 'next/font/google';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { CiMail } from 'react-icons/ci';
import { useSession } from 'next-auth/react';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { watch } from 'fs';

interface IGetProfileBioProps {
  register: UseFormRegister<{
    username: string;
    description: string;
    website?: string | undefined;
  }>,
  watch: UseFormWatch<{
      username: string;
      description: string;
      website?: string | undefined;
  }>


}

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

const GetProfileBio: React.FunctionComponent<IGetProfileBioProps> = (props) => {
  const { register, watch } = props;
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
        register={register}
        error={undefined}
        disabled={false}
        placeholder={''}
        height={null}
        inputLength={20} topLocation={null}
        watch={watch}/>
  <br />
  <ModalInput
        name="description"
        label="Description"
        type="text"
        icon={<CiMail />}
        register={register}
        error={undefined}
        disabled={false}
        placeholder={''}
        height={150}
        topLocation={"15%"}
        inputLength={150} watch={{}}/>
   <br />
  <ModalInput
   name="website"
   label="Website URL"
   type="text"
   icon={<CiMail />}
   register={register}
   error={undefined}
   disabled={false}
   placeholder={''}
   height={null}
   inputLength={20} topLocation={null}/>
  </motion.div>
  </> ;
};

export default GetProfileBio;
