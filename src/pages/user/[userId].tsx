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
import TiltModal from '@/components/modals/TiltModal/tiltModal';

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
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState : { errors, isSubmitting}
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchemaProfile)
  });
  const onSubmit: SubmitHandler<FormSchemaType>=async(values)=>{
    try {
      const { data } = await axios.post('/api/auth/userProfile',{
        ...values

      })
    } catch (error) {
      
    }

  }
  const [profileData , setProfileData] = useState({});
  const [documentData, setDocumentData] = useState(null);
  const colour = useMotionValue(COLOURS[0])
  const border = useMotionTemplate`2px solid ${colour}`;
  const { data : session } = useSession();
  console.log(session)
  const [ selection, setSelection ] = useState([true, false, false, false]);
  const [showContent, setShowContent] = useState(false)
  const ref = useRef();
  outsideClick(ref, ()=>setShowContent(false))
  useEffect(() => {
    animate(colour, COLOURS, {
        ease: "easeInOut",
        duration: 10,
        repeat: Infinity,
        repeatType: "mirror",
    });
  }, []);

  function handleClick(arg0: number) {
    var newSelection = [false, false, false,false]
    newSelection[arg0] = true;
    setSelection(newSelection)
  }

  useEffect(() => {
    if (showContent) {
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
                <img id={style.image} src={session?.user.image} alt="" />
              </div>
            </div>
            <motion.div id={style.profileBody}>
              <div id={style.titleLine}><h1 id={style.profileTitle}>{session?.user.name}</h1><div style={{display: "flex", marginLeft:"auto"}}><GenerateModal showModal={setShowContent}errors={errors} register={register} handleSubmit={handleSubmit} onSubmit={onSubmit} fields='Edit Profile'/></div></div>
              <p id={style.text}>@{session?.user.name}</p>
              <h6 id={style.text}><u>Description</u></h6>
              <p style={{color:"aliceblue"}}>This user has not provided a description.</p>
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
            showContent ? <div id={style.modalBacking}><TiltModal icon={<MdOutlineClose/>}/></div> : null
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