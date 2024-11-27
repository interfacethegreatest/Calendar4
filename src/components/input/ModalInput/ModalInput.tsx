import * as React from 'react';
import { motion } from 'framer-motion';
import { Poppins } from 'next/font/google';
import { useRef, useState } from 'react';
import { styleText } from 'util';
import style from "./ModalInput.module.css"
import outsideClick from './outsideClick';

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface IModalInputProps {
  name: string;
  label: string;
  type: string;
  icon: React.ReactNode;
  placeholder: string;
  register: any;
  error: any;
  disabled: boolean;
  autoComplete?: boolean; 
}

const ModalInput: React.FunctionComponent<IModalInputProps> = (props) => {
  const { name, label } = props;
  const [clicked, setClicked] = useState(false);

  const handleClickedContent = () => {
    setClicked(true); // Toggle state
  };
  function unclickContent(){
    setClicked(false);
  };
  const ref = useRef();
  outsideClick(ref, () => unclickContent());
  return (
    <div
      onClick={handleClickedContent}
      id={clicked ? style.glowingInputContainer : style.inputContainer}
      ref={ref}
    >
      <motion.span
        initial={{ x: 0, y: "50%", fontSize: "1.1rem", color: "rgb(22, 60, 47)" }}
        animate={
          clicked
            ? { x: 0, y: "-20%", fontSize: "0.65rem", color: "rgb(57, 148, 116)"}
            : { x: 0, y: "0%", fontSize: "1.1rem", color: "rgb(106, 106, 106)" }
        }
        transition={{ duration: 0.1 }}
        style={{
          position: "absolute",
          left: "10px",
          transformOrigin: "left center",
        }}
        id={style.inputLabel}
      >
        {label}
      </motion.span>
    </div>
  );
};

export default ModalInput;
