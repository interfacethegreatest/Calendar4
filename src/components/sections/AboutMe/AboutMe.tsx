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

  </div>
</> ;
};

export default AboutMe;
