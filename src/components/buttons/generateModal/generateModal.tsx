import * as React from 'react';
import style from './style.module.css'
import { useRef, useState } from 'react';
import outsideClick from './outsideClick';

interface IGenerateModalProps {
    fields: "Edit Profile" | "Edit Documents";
    register : Function;
    onSubmit : Function;
    handleSubmit: Function;
    errors : any;
}

const GenerateModal: React.FunctionComponent<IGenerateModalProps> = (props) => {
  const [showContent, setShowContent] = useState(false)
  const ref = useRef();
  outsideClick(ref, ()=>setShowContent(false))
  const { fields } = props;

  return<>
   {
    showContent ? <div id={style.modal} ref={ref}></div> : null
   }
  <button id={style.editProfile} onClick={()=>setShowContent(true)}>{fields == "Edit Documents" ? "Edit": fields}</button>
  </> ;
};

export default GenerateModal;
