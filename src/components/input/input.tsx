import * as React from 'react';
import style from './input.module.css';
import { Poppins } from 'next/font/google';
import { useState, useRef, useEffect } from 'react';
import outsideClick from './outsideClick';

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
}

const Input: React.FunctionComponent<IInputProps> = (props) => {
  const { name, label, type, icon, placeholder, register, disabled, error } = props;
  const ref = useRef();
  const spanRef = useRef();
  outsideClick(ref, () => setShowContent(false));
  const [showContent, setShowContent] = useState(false);

  const inputClass = error ? style.inputClickedError : style.inputClicked;
  const glowEffectClass = error ? style.glowEffectError : style.glowEffect;
  const iconHolderClass = error ? style.iconHolderError : style.iconHolder;
  const iconStyle = error ? style.iconStyleError : style.iconStyle;
  const inputDiv = error ? style.inputDivError : style.inputDiv;

  return (
    <div
      className={showContent ? inputClass : ''}
      id={inputDiv}
      ref={ref}
    >
      <div id={iconHolderClass}><div id={iconStyle}>{icon}</div></div>
      <input
        id={style.inputStyle}
        type={type}
        placeholder={showContent ? '' : placeholder}
        onFocus={() => setShowContent(!showContent)}
        {...register(name)}
        disabled={disabled}
      />
      <span ref={spanRef} id={glowEffectClass}></span>
      
    </div>
  );
};

export default Input;
