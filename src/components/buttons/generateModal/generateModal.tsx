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

const COLOURS = [
  'rgba(159, 158, 158, 0.7)',
  'rgba(159, 158, 158, 0.5)',  
  'rgba(130, 129, 129, 0.35)', 
  'rgba(189, 188, 188, 0.2)', 
];

const GenerateModal: React.FunctionComponent<IGenerateModalProps> = (props) => {
  //const [showContent, setShowContent] = useState(false)
  //const ref = useRef();
  //outsideClick(ref, ()=>setShowContent(false))
  const { fields, setShowContent } = props;
  const colour = useMotionValue(COLOURS[0]);
  const border = useMotionTemplate`2px solid ${colour}`

  return<>
  {
    fields == "Edit" ? 
    <motion.button title='Edit' style={{border, position:"relative", zIndex:1}} className={font.className} id={style.editProfile} onClick={()=>setShowContent(true)}>
    <span id={style.mainText}><MdEdit style={{marginBottom:"2px", marginRight:"0px", marginTop:"4px"}}/></span>
    </motion.button> 
    : null
  }
  {
    fields =="Edit Documents" ?
    <motion.button title='Edit' style={{border, position:"relative", zIndex:1}} className={font.className} id={style.editProfile} onClick={()=>setShowContent(true)}>
    <span id={style.mainText}><MdEdit style={{marginBottom:"2px", marginRight:"0px", marginTop:"4px"}}/></span>
    </motion.button> 
    : null
  }
  </> ;
};

export default GenerateModal;