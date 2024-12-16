import React, { useEffect, useRef, useState } from 'react'
import ResetCard from '@/components/cards/ResetCard/ResetCard';
import { NextPageContext } from 'next';
import Scene from '@/components/backgrounds/starsBackground/Scene';
import { useSession } from 'next-auth/react';
import style from './style.module.css'
import { IoSearch } from 'react-icons/io5';
import { animate, motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import GenerateModal from '@/components/buttons/generateModal/generateModal';
import { z } from 'zod';
import AboutMe from '@/components/sections/AboutMe/AboutMe';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MdOutlineClose, MdOutlineEdit } from "react-icons/md";
import axios from 'axios';
import outsideClick from '@/components/input/outsideClick';
import TiltModal from '@/components/modals/tiltModal/tiltModal';

const COLOURS = [
  'rgba(159, 158, 158, 0.7)',
  'rgba(159, 158, 158, 0.5)',  
  'rgba(130, 129, 129, 0.35)', 
  'rgba(189, 188, 188, 0.2)', 
  'rgba(159, 158, 158, 0.17)'
];

const formSchemaProfile = z.object({
  name:z.string().min(2, "Must be atleast 2 characters.")
  .max(26, "Must be less than 26 characters.")
  .regex(new RegExp("^[a-zA-z]+$"), "No special characters allowed."),
  description: z.string().min(7, "Must be atleast.").max(250, "Must be at maximum 250 characters.")
  .regex(new RegExp("^[a-zA-z]+$"), "No special characters allowed."),
});
type FormSchemaType = z.infer<typeof formSchemaProfile>


export default function user({userId}:{userId:string}) {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  const colour = useMotionValue(COLOURS[0])
  const { data : session } = useSession();

  const [ selection, setSelection ] = useState([true, false, false, false]);
  const [showContent, setShowContent] = useState(false)
  const [ imageString, setImageString ] = useState(null);
  const [ userString, setUserString ] = useState(null);
  const [ descriptionString, setDescriptionString ] = useState(null);
  const [ websiteString, setWebsiteString ] = useState(null);

  const ref = useRef();
  outsideClick(ref, ()=>setShowContent(false))
  useEffect(() => {
    console.log(document.documentElement.clientWidth)
    animate(colour, COLOURS, {
        ease: "easeInOut",
        duration: 10,
        repeat: Infinity,
        repeatType: "mirror",
    });
  }, []);

  useEffect(()=>{
    console.log(session)
    setImageString(session?.image);
    setDescriptionString(session?.description)

  },[session])

  useEffect(() => {
    const handleResize = () => {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;

      setWindowSize({ width, height });
    };

    // Attach the resize event listener
    window.addEventListener("resize", handleResize);

    // Call the function immediately to log the initial size
    handleResize();

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleClick(arg0: number) {
    var newSelection = [false, false, false,false]
    newSelection[arg0] = true;
    setSelection(newSelection)
  }
  const [clicked, setClicked] = useState(false)
  useEffect(() => {
    if (showContent) {
      window.scrollTo(0,0)
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }
  })

  return (<>
     <div id={style.main}>
      <Scene/>
         <div id={style.body}>
          <motion.div id={style.profile}>
            <div id={style.profileHeader}>
              <div id={style.loader}>
              </div>
              <div id={style.profileImage}>
                {
                  session && <img id={style.image} src={ imageString ? imageString : session?.image} alt="" /> 
                }
              </div>
            </div>
            <motion.div id={style.profileBody}>
            {
              session && <div id={style.titleLine}><h1 id={style.profileTitle}>{userString ? userString : session?.user.name}</h1><div style={{display: "flex", marginLeft:"auto"}}><GenerateModal setShowContent={setShowContent} fields='Edit Profile'/></div></div>
            }
            {
              session && <p id={style.text} style={{position:"relative", transform:"translate(0,-10px)", marginBottom:"0px"}}>@{session?.user.name}</p>
            }
            <h6 id={style.text} style={{marginBottom:"0px"}}><u>Description</u></h6>
            {
              session && <p style={{color:"aliceblue"}}>{descriptionString ? descriptionString : "This user has not set a description."}</p>
            }
            <div id={style.socials}><div id={style.social}><a href="">0</a><h6 id={style.location} style={{color:"GrayText"}}><u>Following</u></h6></div><div id={style.social}><a href="">0</a><h6 id={style.location} style={{color:"GrayText"}}><u>Following</u></h6></div></div>
            </motion.div>
          </motion.div>
          <div id={style.selector}>
            {
              selection[0] ? <ul id={style.selectedText}>About</ul> : <ul onClick={()=>handleClick(0)} id={style.selectorText}>About</ul>
            }
            {
              selection[1] ? <ul id={style.selectedText}>Projects</ul> : <ul onClick={()=>handleClick(1)} id={style.selectorText}>Projects</ul>
            }
            {
              selection[2] ? <ul id={style.selectedText}>Bookshelf</ul> : <ul onClick={()=>handleClick(2)} id={style.selectorText}>Bookshelf</ul>
            }
            {
              selection[3] ? <ul id={style.selectedText}>Blog</ul> : <ul onClick={()=>handleClick(3)} id={style.selectorText}>Blog</ul>
            }
          </div>
          <br />
          <div id={style.information}>
            {
              selection[0] ? 
              <AboutMe/>
              : null
            }

          </div>

         </div>
     </div>
     {
            showContent ? 
              <div id={style.modalBacking}>
                <motion.div
            initial={{ x: "-100vw" }} 
            animate={{ x: clicked ? "-100vw" : 0 }} // Slide out when clicked
            transition={{ type: "spring", stiffness: 70, damping: 20 }}>
              <TiltModal website={setWebsiteString} description={setDescriptionString} imageString={setImageString} username={setUserString} setShowContent={setShowContent}  closeModal={setClicked} icon={<MdOutlineClose/>}/>
              </motion.div>
              </div>
             : null
     }
    </>
  )
}

export async function getServerSideProps(ctx : NextPageContext){
    const { query } = ctx;
    console.log("hello"+query);
    return{
        props: { query },
    }
}