import * as React from 'react';
import style from './style.module.css'

interface IGenerateModalProps {
    fields: "Edit Profile" | "Edit Documents";
}

const GenerateModal: React.FunctionComponent<IGenerateModalProps> = (props) => {
  const { fields } = props;
  return<>
  <button id={style.editProfile}>{fields}</button>
  </> ;
};

export default GenerateModal;
