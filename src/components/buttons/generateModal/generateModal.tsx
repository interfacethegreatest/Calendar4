import * as React from 'react';
import style from './styles.module.css'
import { Poppins } from 'next/font/google';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { MdEdit } from "react-icons/md";


interface IGenerateModalProps {
    fields: "Edit" | "Edit Documents";
    setShowContent : Function;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["400"],
})


const GenerateModal: React.FunctionComponent<IGenerateModalProps> = (props) => {
  const { fields, setShowContent } = props;
  return<>
  {
    fields == "Edit" ? 
    <motion.button title='Edit' id={style.editProfile} onClick={()=>{setShowContent(true)}}>
     <div id={style.buttonInner}>
      Edit  
     </div>
    </motion.button> 
    : null
  }
  {
    fields =="Edit Documents" ?
    <motion.button title='Edit' style={{ position:"relative", zIndex:1}} className={font.className} id={style.editProfile} onClick={()=>setShowContent(true)}>
    <span id={style.mainText}><MdEdit style={{marginBottom:"2px", marginRight:"0px", marginTop:"4px"}}/></span>
    </motion.button> 
    : null
  }
  </> ;
};

export default GenerateModal;