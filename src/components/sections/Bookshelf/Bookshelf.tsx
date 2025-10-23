import * as React from 'react';
import style from './aboutMeStyles.module.css';
import GenerateModal from '@/components/buttons/generateModal/generateModal';
import { useEffect, useState } from 'react';
import Tilt from 'react-parallax-tilt';
import { SyncLoader } from 'react-spinners';
import { RiDeleteBin3Line } from 'react-icons/ri';
import { RxCross1 } from "react-icons/rx";     
import { IoMdCheckmark } from "react-icons/io"; 
import { MdOutlineRemove } from "react-icons/md"; 
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface IProjectsProps {
  setShowContentProjects: (v: boolean) => void;
  serverSideProps: boolean;
  getServerSideProps: (v: boolean) => void;
  userId: string | string[] | undefined;
}

const Projects: React.FunctionComponent<IProjectsProps> = (props) => {
  const { setShowContentProjects } = props;
  const [loading, setLoading] = useState<boolean>(false);
  
  return (
    <div id={style.about}>
      <div id={style.backing2}></div>

      <Tilt scale={1} tiltMaxAngleX={1} tiltMaxAngleY={1} style={{ display: 'block', width: '100%' }}>
        <div id={style.main}>
          {loading ? (
            <div id={style.spinnerCentre}>
              <div id={style.spinner}>
                <SyncLoader size={5} color="#f0f8ff" />
              </div>
            </div>
          ) : (
            <>
              <h2 id={style.mainTitle}>
                <b>Bookshelf</b>
              </h2>

              <div id={style.editBar}>
                <GenerateModal fields={'Edit Documents'} setShowContent={setShowContentProjects} />
              </div>
                <br />
                <div id={style.mainContainer}>
                  {
                  }
                </div>
            </>
          )}
        </div>
      </Tilt>

      <div id={style.backing}></div>
    </div>
  );
};

export default Projects;
