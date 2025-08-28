import * as React from 'react';
import style from './aboutMeStyles.module.css';
import GenerateModal from '@/components/buttons/generateModal/generateModal';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TiltModalAboutMe from '@/components/modals/TiltModalAboutMe/TiltModalAboutMe';
import { FadeLoader, SyncLoader } from 'react-spinners';
import axios from 'axios';

interface IAboutMeProps {
  setShowContent: Function;
  setIsLoading : Function;
  isLoading: Boolean;
  userId: string;
  serverSideProps: Boolean;
  getServerSideProps:Function;
  setShowContentAboutMe:Function;

}

const AboutMe: React.FunctionComponent<IAboutMeProps> = (props) => {
  const { setShowContent, setIsLoading, isLoading, userId, serverSideProps, getServerSideProps, setShowContentAboutMe} = props;
  const [clicked, setClicked] = useState(false);
  const [aboutYouData, setAboutYouData]= useState(null);
  
  useEffect(() => {
    const loadBackend = async () => {
      // Run if serverSideProps is true OR it's the first load
      if (serverSideProps || userId) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/auth/getUserData?userId=${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch data.');
          }
          const data = await response.json();
          setAboutYouData(data.user.aboutYou);
          console.log(data.user.aboutYou);
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          getServerSideProps(false);
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }
      }
    };
  
    loadBackend();
  }, [serverSideProps, userId]); 
  
  
  

  return<>
  <div id={style.about}>
    <div id={style.backing2}></div>
    <div id={style.main}>
      {
        isLoading?
        <div id={style.spinnerCentre}>
        <>
        <div id={style.spinner}>
        <SyncLoader size={5} color='#f0f8ff' /> 
        </div>
        </>
        </div>
        : 
        <>
         <h2 id={style.mainTitle}><b>About Me</b></h2>
         <div id={style.editBar}><GenerateModal fields={'Edit Documents'} setShowContent={setShowContentAboutMe}></GenerateModal></div>
         <br />
         <div id={style.aboutYouContainer} className={style.AboutYou}>
         <p id={style.aboutYousW}>
          {aboutYouData ?  aboutYouData.aboutYou ? aboutYouData.aboutYou : "No about me set yet.": "No About Me set yet."}
         </p>
         </div>
         <br />
         <div id={style.cvContainer}>
          <h2 id={style.cvTitle}><b>My CV:</b></h2>
          {
            aboutYouData ? aboutYouData.cv ? <h2 id={style.mainSubtitleInitial}><b></b><p id={style.mainSubtitle}><a href={aboutYouData != null ? aboutYouData.cv : null}>This is a link to my CV.</a></p></h2> : <h2 id={style.mainSubtitleInitial}><b></b><p id={style.mainSubtitle}>No CV set yet.</p></h2> : <h2 id={style.mainSubtitleInitial}><b></b><p id={style.mainSubtitle}>No CV set yet.</p></h2>
          }
         </div>
         <br />
         <div id={style.transcriptContainer}>
          <h2 id={style.transcriptTitle}><b>Transcripts:</b></h2>
          <div className="" id={style.dataContainer}>
          {aboutYouData?.transcripts && aboutYouData.transcripts.length > 0 ? (
           aboutYouData.transcripts.map((transcript: any, index: number) => (
           <div key={index}>
            <p>
            {index + 1 + ". "}
            <a href={transcript}>Transcript</a>
            </p>
           </div>
          ))
          ) : (
          <p id={style.elseTranscriptText}>The user is yet to provide any transcripts.</p>
          )}

          </div>
         </div>
         <br />
         <br />
         <div className="" id={style.workExperienceContainer}>
          <h2 className="" id={style.workExperienceTitle}><b>Work Experience:</b></h2>
          {
           aboutYouData?.workExperience && aboutYouData.workExperience.length > 0 ? (
           aboutYouData.workExperience.map((experience: any, index: number) => {
            const endDate = new Date(experience.endDate);
            const month = endDate.toLocaleString("default", { month: "long" }); // e.g., "August"
            const year = endDate.getFullYear(); // e.g., 2025
            console.log("month: " + month + " year: "+ year);

          return (
           <div key={index}>
            <p>
             {index + 1}. <b>{experience.businessName}, {experience.jobTitle}</b> — <b>{month}, {year}</b>
            </p>
            <p>{experience.jobDescription}</p>
           </div>
          );
          })
          ) : (
           <p id={style.elseWorkExperienceText}>The user is yet to provide any work experience.</p>
          )
          }
         </div>
         <br />
        <br />
         <div className="" id={style.educationalBackgroundContainer}>
          <h2 className="" id={style.educationlBackgroundTitle}><b>Educational Background:</b></h2>
          {
           aboutYouData?.educationalBackground && aboutYouData.educationalBackground.length > 0 ? (
           aboutYouData.educationalBackground.map((background: any, index: number) => {
            const endDate = new Date(background.endDate);
            const month = endDate.toLocaleString("default", { month: "long" }); // e.g., "August"
            const year = endDate.getFullYear(); // e.g., 2025

          return (
           <div key={index}>
            <p>
             {index + 1}. <b>{background.qualificationTitle}</b> — <b>{month}, {year}</b>
            </p>
            <p>{background.educationalInstitution}</p>
           </div>
          );
          })
          ) : (
           <p id={style.elseWorkExperienceText}>The user is yet to provide any educational background.</p>
          )
          }

         </div>
        </>
      }
    
    </div>
    <div id={style.backing}>
     
    </div>
    
  </div>
</> ;
};

export default AboutMe;
