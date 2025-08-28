import * as React from 'react';
import style from './aboutMeStyles.module.css';
import GenerateModal from '@/components/buttons/generateModal/generateModal';
import { useEffect, useState } from 'react';
import { SyncLoader } from 'react-spinners';

interface IProjectsProps {
  setShowContentProjects: Function;
}

const Projects: React.FunctionComponent<IProjectsProps> = (props) => {
  const {setShowContentProjects } = props;
  const [aboutYouData, setAboutYouData] = useState(null);


  return (
    <div id={style.about}>
      <div id={style.backing2}></div>
      <div id={style.main}>
            <h2 id={style.mainTitle}><b>Projects</b></h2>
            <div id={style.editBar}>
              <GenerateModal fields={'Edit Documents'} setShowContent={setShowContentProjects} />
            </div>
      </div>
      <div id={style.backing}></div>
    </div>
  );
};

export default Projects;
