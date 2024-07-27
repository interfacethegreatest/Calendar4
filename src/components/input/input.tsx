import * as React from 'react';
import style from './input.module.css'
import { Poppins } from 'next/font/google';
import { useState, useRef, useEffect } from 'react';
import outsideClick from './outsideClick';
// ADD BOTTOM LINE ?
// ADD SIDE DESIGN ?
// ADD TOP DESIGN / GLOW ON HOVER?
// ADD ICON DESIGN

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
}



const Input: React.FunctionComponent<IInputProps> = (props) => {
  const {name, label, type, icon, placeholder} = props;
  const ref = useRef();
  const spanRef = useRef();
  outsideClick(ref, ()=>setShowContent(false));
  const [showContent, setShowContent] = useState(false);
  
  return <>
  <div 
   className={ showContent? style.inputClicked : ''} 
   id={style.inputDiv} 
   ref={ref}
   >
   <div 
    id={style.iconHolder}><div id={style.iconStyle}>{icon}</div></div>
   <input 
    id={style.inputStyle} 
    type={type}
    placeholder={showContent? '': placeholder}
    onFocus={()=>setShowContent(!showContent)}
   />
   <span ref={spanRef} id={style.glowEffect}></span>
  </div>
  </>;
};

export default Input;
