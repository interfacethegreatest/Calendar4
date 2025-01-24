import * as React from 'react';
import style from './aboutMeStyles.module.css';
import GenerateModal from '@/components/buttons/generateModal/generateModal';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TiltModalAboutMe from '@/components/modals/TiltModalAboutMe/TiltModalAboutMe';

interface IAboutMeProps {
  setShowContent: Function;
}

const AboutMe: React.FunctionComponent<IAboutMeProps> = (props) => {
  const { setShowContent } = props;
  const [clicked, setClicked] = useState(false);

  return<>
  <div id={style.about}>
  <div id={style.inner}>
  <div><h3><u>About me</u></h3><GenerateModal fields={'Edit'
} setShowContent={setShowContent} setClicked={setClicked}></GenerateModal></div>
  <br />
  <p style={{color: "rgba(247, 243, 243, 0.562);"}} id={style.descriptionText}><u>This is yet to be completed.</u></p>
  <br />
  <div id={style.documents}>
    <h3>Documents</h3>
    <br />
    <div id={style.documentSection}>
    <div id={style.transcriptSection}>
    <h6>Transcripts</h6>
      <div id={style.sectionText}>
        <div id={style.entry}><a href="">Transcript</a><p>Last Updated: 2024-08-13</p></div>
        <div id={style.entry}><a href="">Transcript</a><p>Last Updated: 2024-08-13</p></div>
      </div>
    </div>
    <br />
    <div id={style.transcriptSection}>
      <h6>Professional</h6>
      <div id={style.sectionText}>
       <div id={style.entry}><a href="">Resumé</a><p>Last Updated: 2024-08-13</p></div>
      </div>
    </div>
    <div>
    </div>
    </div>
    <br />
    <h3>Work Experience</h3>
    <br />
    <h5>Buisness</h5>
    <h6>Job role</h6>
    <p style={{fontSize:".8rem"}}>May 2019 - Aug 2024</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, sunt similique omnis pariatur minima laborum corrupti, nostrum perspiciatis aliquid eaque id recusandae facere libero est maxime atque, fugit dolorum dignissimos.
    Obcaecati, quisquam tempore! Provident, excepturi, incidunt distinctio error cupiditate sint, iure eaque non veritatis obcaecati ullam! Commodi quo, illo architecto quia dolor iusto officiis libero facere quis soluta deleniti ad?
    Autem ipsa quidem assumenda voluptates dolorum, dicta magnam. Vero recusandae quod nostrum quasi. Tenetur veniam, aliquid deserunt hic mollitia temporibus blanditiis sequi consectetur ipsam amet, sit aliquam numquam vero nobis.</p>
    <br />
    <h3>Education</h3>
    <br />
    <h5>University of Broomfield</h5>
    <p style={{fontSize:".8rem"}}>May 2019 - Aug 2024</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum eveniet alias cumque numquam repellat autem in explicabo blanditiis ea asperiores. Ea quis non soluta exercitationem qui consectetur delectus suscipit tenetur.</p>
  </div>
  </div>
</div>
</> ;
};

export default AboutMe;
