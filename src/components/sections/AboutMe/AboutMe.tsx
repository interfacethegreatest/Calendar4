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
  console.log(aboutYouData)
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
         <div id={style.aboutYouContainer}>
         <p id={style.aboutYou}>{aboutYouData.aboutYou}</p>
         </div>
         <br />
         <div id={style.transcriptContainer}>
         <h2 id={style.mainSubtitle}><b>My CV:</b></h2>
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
