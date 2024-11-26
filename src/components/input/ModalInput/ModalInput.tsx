import * as React from 'react';
import style from "./ModalInput.module.css"

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
  //input for the user to complete their bio,
  return
  <>
   <div id={style.outerDiv}>

   </div>
  </> ;
};

export default ModalInput;
