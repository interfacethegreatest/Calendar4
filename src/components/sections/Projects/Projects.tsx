import * as React from 'react';
import style from './aboutMeStyles.module.css';
import GenerateModal from '@/components/buttons/generateModal/generateModal';
import { useEffect, useState } from 'react';
import Tilt from 'react-parallax-tilt';
import { SyncLoader } from 'react-spinners';
import { RiDeleteBin3Line } from 'react-icons/ri';

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

  useEffect(() => {
    const loadBackend = async () => {
      // Only fetch if told to (serverSideProps) and we have a userId
      if (serverSideProps && userId) {
        setLoading(true);
        try {
          const response = await fetch(`/api/auth/getUserData?userId=${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch data.');
          }
          const data = await response.json();
          setProjectData(data.user.projects);
          console.log(data.user.projects);
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          // turn off the flag from the server-side trigger
          getServerSideProps(false);
          // small delay for smoother spinner UX
          setTimeout(() => {
            setLoading(false);
          }, 500);
        }
      } else {
        // Nothing to fetch → don't get stuck on spinner
        //setLoading(false);
      }
    };

    loadBackend();
  }, [serverSideProps, userId, getServerSideProps]);

  function remove(index: number): void {
    alert('123');
  }

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
                             onClick={() => remove(index)}
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
