import * as React from 'react';
import style from './input.module.css';
import { Poppins } from 'next/font/google';
import { useState, useRef, useEffect } from 'react';
import outsideClick from './outsideClick';
import { IoAlert } from "react-icons/io5";
import { CiLock, CiUnlock } from 'react-icons/ci';
import Tilt from 'react-parallax-tilt';

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface IInputProps {
  name: string;
  label: string;
  type: string;
  icon: React.ReactNode;
  placeholder: string;
  register: any;
  error: any;
  disabled: boolean;
  autoComplete? : boolean; 
}

const Input: React.FunctionComponent<IInputProps> = (props) => {
  const { name, label, type, icon, placeholder, register, disabled, error, autoComplete } = props;
  const ref = useRef();
  const spanRef = useRef();
  outsideClick(ref, () => setShowContent(false));
  const [showContent, setShowContent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputClass = error ? style.inputClickedError : style.inputClicked;
  const glowEffectClass = error ? style.glowEffectError : style.glowEffect;
  const iconHolderClass = error ? style.iconHolderError : style.iconHolder;
  const iconStyle = error ? style.iconStyleError : style.iconStyle;
  const inputDiv = error ? style.inputDivError : style.inputDiv;

  return (
    <>
    <div>
     <div
      className={showContent ? inputClass : ''}
      id={inputDiv}
      ref={ref}
     >
      <div title={error ? error : label} id={iconHolderClass}><div id={iconStyle}>
        {
          name == "password" || name == "confirmPassword" ?
          showPassword ? <CiUnlock onClick={()=> setShowPassword((prev)=>!prev)}/> : <CiLock onClick={()=>setShowPassword((prev)=>!prev)}/>
          : icon
        }
      </div></div>
      <input
        id={style.inputStyle}
        type={showPassword ? 'text' : type}
        placeholder={showContent ? '' : placeholder}
        onFocus={() => setShowContent(!showContent)}
        {...register(name)}
        disabled={disabled}
        style={autoComplete ? {autocomplete : "off"} : null}
        autoComplete="off"
      />
      <span ref={spanRef} id={glowEffectClass}></span>
     </div>
     <div id={ error ? style.errorText : style.Text}>
      {error? error: label}</div>
    </div>
    </>
  );
};

export default Input;
