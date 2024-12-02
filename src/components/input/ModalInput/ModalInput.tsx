import * as React from 'react';
import { motion } from 'framer-motion';
import { Poppins } from 'next/font/google';
import { useRef, useState } from 'react';
import { styleText } from 'util';
import style from "./ModalInput.module.css"
import outsideClick from './outsideClick';
import user from '@/pages/auth';

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
  height: number | null;
  topLocation: string | null;
  inputLength: number;
  watch : string;
}

const ModalInput: React.FunctionComponent<IModalInputProps> = (props) => {
  const { name, label, type, icon, placeholder, register, error, disabled, height, topLocation, inputLength, watch } = props;
  const [clicked, setClicked] = useState(false);
  const [text, setText] = useState("");
  const [textCount, setTextCount] = useState(0)
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const handleInputChange = (event : any) => {
    setText(event.target.value);
    const string = event.target.value;
    const length = string.length;
    setTextCount(length);
  };
  //onclick, change styling??
  const handleClickedContent = () => {
    setClicked(true); 
    inputRef.current.focus();
  }
  function unclickContent(){
    if (text.trim() === ""){
      setClicked(false);
      
    }else{
      return
    }
  };
  const ref = useRef();
  outsideClick(ref, () => unclickContent());
  return (
    <div
      onClick={handleClickedContent}
      id={clicked ? style.glowingInputContainer : style.inputContainer}
      ref={ref}
      style={{
        height: height ? `${height}px` : undefined
      }}
    >
      <motion.span
        initial={{ x: 0, y: "50%", fontSize: "1.1rem", color: "rgb(22, 60, 47)" }}
        animate={
          clicked
            ? { x: 0, y: "-20%", fontSize: "0.65rem", color: "rgb(42, 111, 87)"}
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
      <textarea
        id={style.inputStyle}
        ref={inputRef}
        type={type}
        {...register(name)}
        /*disabled={}*/
        autoComplete="off"
        onChange={handleInputChange}
        style={{ top: topLocation!}}
      />

      <h6 id={style.textCount}>
        {textCount} / {inputLength}
      </h6>
    </div>
  );
};

export default ModalInput;
