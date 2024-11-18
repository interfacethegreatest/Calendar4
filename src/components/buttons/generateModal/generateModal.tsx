import * as React from 'react';
import style from './styles.module.css'
import { useRef, useState } from 'react';
import outsideClick from './outsideClick';
import { Poppins } from 'next/font/google';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import TiltModal from '@/components/modals/TiltModal/tiltModal';

interface IGenerateModalProps {
    fields: "Edit Profile" | "Edit Documents";
    register : Function;
    onSubmit : Function;
    handleSubmit: Function;
    errors : any;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["400"],
})

const COLOURS = [
  'rgba(159, 158, 158, 0.7)',
  'rgba(159, 158, 158, 0.5)',  
  'rgba(130, 129, 129, 0.35)', 
  'rgba(189, 188, 188, 0.2)', 
];

const GenerateModal: React.FunctionComponent<IGenerateModalProps> = (props) => {
  const [showContent, setShowContent] = useState(false)
  const ref = useRef();
  outsideClick(ref, ()=>setShowContent(false))
  const { fields } = props;
  const colour = useMotionValue(COLOURS[0]);
  const border = useMotionTemplate`2px solid ${colour}`

  return<>
    

    {showContent && (
        <TiltModal ref={ref}></TiltModal>
      )}
  <motion.button style={{border}} className={font.className} id={style.editProfile} onClick={()=>setShowContent(true)}>
    {fields == "Edit Documents" ? "Edit": fields}
  </motion.button>
  </> ;
};

export default GenerateModal;