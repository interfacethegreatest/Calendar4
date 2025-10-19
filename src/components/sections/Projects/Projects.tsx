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
  const { serverSideProps, getServerSideProps, userId, setShowContentProjects } = props;
  const [projectData, setProjectData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  const [completedProjects, setCompletedProjects] = useState<(boolean | null)[]>([]);
  useEffect(() => {
  const loadBackend = async () => {
    if (serverSideProps && userId) {
      setLoading(true);
      try {
        const response = await fetch(`/api/auth/getUserData?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data.');
        }

        const data = await response.json();
        const projects = data?.user?.projects || [];
        setProjectData(projects);
        const mapped = projects.map((p: any) => Boolean(p.completed));
        console.log('mapped completedProjects (pre-set):', mapped);
        setCompletedProjects(mapped);

      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        getServerSideProps(false);
        setTimeout(() => setLoading(false), 500);
      }
    }
  };

  loadBackend();
}, [serverSideProps, userId, getServerSideProps]);


  
  const handleRemove = async (e: React.MouseEvent, index:number) => {
      try {
        const { data } = await axios.post('/api/auth/removeProject', {
          userId,
          session,
          index,
        });
      } catch (error: any) {
        toast.error(error.message || 'An error occurred');
      }
      getServerSideProps(true);
  };

  const handleNotCompleted = async (e: React.MouseEvent, index:number) => {
      const indexValue = completedProjects[index];
      let newIndexValue : boolean | null = null;
      if ( indexValue === true) {
        const next = [...completedProjects]; // copy
        next[index] = null;                  // set to null
        setCompletedProjects(next);   
        newIndexValue = null;
      }
      if ( indexValue === false) {
        const next = [...completedProjects]; // copy
        next[index] = true;                  // set to null
        setCompletedProjects(next);   
        newIndexValue = true;
      }
      if ( indexValue === null) {
        const next = [...completedProjects]; // copy
        next[index] = false;                  // set to null
        setCompletedProjects(next); 
        newIndexValue = null;  
      }
      console.log(newIndexValue)
      try {
        const { data } = await axios.post('/api/auth/projectNotCompleted', {
          userId,
          session,
          index,
          newIndexValue,
        });
      } catch (error: any) {
        toast.error(error.message || 'An error occurred');
      }
      getServerSideProps(true);
  };

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
                <b>Projects</b>
              </h2>

              <div id={style.editBar}>
                <GenerateModal fields={'Edit Documents'} setShowContent={setShowContentProjects} />
              </div>

              {/* Example: render fetched data safely if present */}
              {projectData && (
                <>
                <br />
                <div id={style.mainContainer}>
                  {
                    projectData && projectData.length > 0 ? (
                      projectData.map((project:any, index:number)=>(
                        <>
                         <div id={style.projectContainer} key={index}>
                          <div id={style.projectMain}>
                           <div id={style.tiles}>
                            <div id={style.tile1}></div>
                            <div id={style.tile2}></div>
                            <div id={style.tile3}></div>
                            <div id={style.tile4}></div>
                            <div id={style.tile5}></div>
                            <div id={style.tile6}></div>
                            <div id={style.tile7}></div>
                            <div id={style.tile9}></div>
                            <div id={style.tile10}></div>
                            <div id={style.tile12}></div>
                            <div id={style.tile13}></div>
                            <div id={style.tile15}></div>
                            <div id={style.loader}></div>
                            <div id={style.loader2}></div>
                            <div id={style.loader3}></div>
                            <div id={style.loader4}></div>
                            <div id={style.loader5}></div>
                            <div id={style.loader6}></div>
                          </div>
                          <div className="" id={style.projectButtonContainer}>
                            <button
                             type="button"
                             onClick={(e) => handleNotCompleted(e, index)}
                             className={
                             completedProjects[index] === true
                             ? style.completedBtn          // e.g. green
                             : completedProjects[index] === false
                             ? style.notCompletedBtn       // e.g. red
                             : style.nullBtn               // e.g. gray
                            }
                             title={
                              completedProjects[index] === true
                              ? 'Completed'
                              : completedProjects[index] === false
                              ? 'Not Completed'
                              : 'Unset'
                            }
                            >
                            {
                            completedProjects[index] === true ? (
                            <IoMdCheckmark size={20} />
                            ) : completedProjects[index] === false ? (
                            <RxCross1 size={20} />
                            ) : (
                            <MdOutlineRemove size={20} />
                            )
                            }
                            </button>
                            <button
                             type="button"
                             onClick={(e) => handleRemove(e, index)}
                             className={style.deleteExperienceBtn}
                             title='delete'
                            >
                             <RiDeleteBin3Line
                             size={"20px"} />
                            </button>
                          </div>
                          <div className="" id={style.projectMainTitle}>
                           <h2><b><u>
                            {
                              project.projectTitle
                            }
                           </u></b></h2>
                          </div>
                          <div id={style.projectMainParagraphContainer}>
                            <p>
                            {
                              project.projectDescription
                            }
                            </p>
                          </div>
                          <div className={style.projectMainTagContainer}>
                           {
                            project.tags && project.tags.length > 0 ? (
                            project.tags.map((tag: string, tagIndex: number) => (
                            <div className={style.projectMainTag} key={tagIndex}>
                             {tag}
                            </div>
                            ))
                            ) : null
                           }
                          </div>
                          </div>
                          <div id={style.projectBacking}></div>
                         </div>
                        </>
                      ))
                    ) : <p>The user is yet to set any projects.</p>
                  }
                </div>
                </>
              )}
            </>
          )}
        </div>
      </Tilt>

      <div id={style.backing}></div>
    </div>
  );
};

export default Projects;
