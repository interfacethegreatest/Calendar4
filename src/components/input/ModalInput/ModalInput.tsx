import * as React from 'react';
import style from "./ModalInput.module.css"
import { Poppins } from 'next/font/google';
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
    autoComplete? : boolean; 
}

const ModalInput: React.FunctionComponent<IModalInputProps> = (props) => {
  const {name, label, type, icon, placeholder, register, error} = props;
  return<>
  <div id={style.inputContainer} onClick={()=>alert('hello?')}>
    <span onMouseDown={() => alert('12hello3')} id={style.inputLabel} className={null}>{label}</span>


  </div>
  </> ;
};

export default ModalInput;
