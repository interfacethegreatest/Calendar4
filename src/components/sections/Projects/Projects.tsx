import * as React from 'react';
import style from './aboutMeStyles.module.css';
import GenerateModal from '@/components/buttons/generateModal/generateModal';
import { useState } from 'react';
import Tilt from 'react-parallax-tilt';
interface IProjectsProps {
  setShowContentProjects: Function;
}

const Projects: React.FunctionComponent<IProjectsProps> = (props) => {
  const {setShowContentProjects } = props;
  const [aboutYouData, setAboutYouData] = useState(null);
  const [refreshedData , setRefreshedData] = useState(false);


  return (
    <div id={style.about}>
      <div id={style.backing2}></div>
      <Tilt
       scale={1}
       tiltMaxAngleX={1}
       tiltMaxAngleY={1}
       style={{ display: 'block', width: '100%' }} 
      >
      <div id={style.main}>
            <h2 id={style.mainTitle}><b>Projects</b></h2>
            <div id={style.editBar}>
              <GenerateModal fields={'Edit Documents'} setShowContent={setShowContentProjects} />
            </div>
      </div>
      </Tilt>
      <div id={style.backing}></div>
    </div>
  );
};

export default Projects;
