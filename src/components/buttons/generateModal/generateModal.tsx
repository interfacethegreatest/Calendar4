import * as React from 'react';
import style from './style.module.css'

interface IGenerateModalProps {
    fields: "Edit Profile" | "Edit Documents";
    register : Function;
    onSubmit : Function;
    handleSubmit: Function;
    errors : any;
}

const GenerateModal: React.FunctionComponent<IGenerateModalProps> = (props) => {
  const { fields } = props;
  return<>
  <button id={style.editProfile}>{fields == "Edit Documents" ? "Edit": fields}</button>
  </> ;
};

export default GenerateModal;
