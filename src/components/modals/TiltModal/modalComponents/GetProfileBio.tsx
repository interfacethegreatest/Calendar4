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
 
  console.log(session)
  return <>
  
  </> ;
};

export default GetProfileBio;
