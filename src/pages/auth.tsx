import React, { useEffect, useState } from 'react';
import ResetCard from '@/components/cards/ResetCard/ResetCard';
import { NextPageContext } from 'next';
import Scene from '@/components/backgrounds/starsBackground/Scene';
import { useSession } from 'next-auth/react';
import style from '../pages/user/style.module.css';
import { IoSearch } from 'react-icons/io5';
import { animate, motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import GenerateModal from '@/components/buttons/generateModal/generateModal';
import AboutMe from '@/components/sections/AboutMe/AboutMe';

export default function user({ userId }: { userId: string }) {
  const { data: session } = useSession();
  const [selection, setSelection] = useState([true, false, false, false]);

  function handleClick(index: number) {
    const newSelection = [false, false, false, false];
    newSelection[index] = true;
    setSelection(newSelection);
  }

  return (
    <>
      <div id={style.main}>
        <Scene />
        <div id={style.body}>
          <motion.div id={style.profile}>
            <div id={style.profileHeader}>
              <div id={style.profileImage}>
                <img
                  id={style.image}
                  src={session ? session?.user.image : '/default-profile.jpg'}
                  alt="User Profile"
                />
              </div>
              <div id={style.profileName}>
                <h1>{session ? session?.user.name : 'Joe Bloggs'}</h1>
                <p>@{session ? session?.user.name : 'unknown'}</p>
              </div>
            </div>
            <motion.div id={style.profileBody}>
              <h6>Description</h6>
              <p>This user is yet to write a description.</p>
              <GenerateModal fields="Edit Profile" />
            </motion.div>
          </motion.div>
          <div id={style.selector}>
            <ul
              className={selection[0] ? style.selectedText : style.selectorText}
              onClick={() => handleClick(0)}
            >
              About
            </ul>
            <ul
              className={selection[1] ? style.selectedText : style.selectorText}
              onClick={() => handleClick(1)}
            >
              Projects
            </ul>
            <ul
              className={selection[2] ? style.selectedText : style.selectorText}
              onClick={() => handleClick(2)}
            >
              Bookshelf
            </ul>
            <ul
              className={selection[3] ? style.selectedText : style.selectorText}
              onClick={() => handleClick(3)}
            >
              Blog
            </ul>
          </div>
          <div id={style.information}>{selection[0] && <AboutMe />}</div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const { query } = ctx;
  return {
    props: { query },
  };
}