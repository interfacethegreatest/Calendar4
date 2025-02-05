import React, { useEffect, useRef, useState } from 'react'
import { InferGetServerSidePropsType, NextPageContext } from 'next';
import Scene from '@/components/backgrounds/starsBackground/Scene';
import { useSession } from 'next-auth/react';
import style from './style.module.css'
import { animate, motion, useMotionValue } from 'framer-motion';
import GenerateModal from '@/components/buttons/generateModal/generateModal';
import AboutMe from '@/components/sections/AboutMe/AboutMe';
import { MdOutlineClose } from "react-icons/md";
import outsideClick from '@/components/input/outsideClick';
import TiltModal from '@/components/modals/TiltModal/tiltModal';
import connectDB from '@/utils/connectDB';
import User from '@/models/User';
import { isValidObjectId } from 'mongoose';
import WebsiteButton from '@/components/buttons/websiteButton/websiteButton';
import ProfileBody from '@/components/sections/ProfileBody/ProfileBody';
import TiltModalAboutMe from '@/components/modals/TiltModalAboutMe/TiltModalAboutMe';
import Profile from '@/components/sections/Profile/Profile';


export default function user({userId, user}:{userId:string, user: InferGetServerSidePropsType<typeof getServerSideProps>}) {
  // Used to check logged in user or not,
  const { data : session } = useSession();
  // Used to set the selection in the below the user profile,
  const [ selection, setSelection ] = useState([true, false, false, false]);
  // Used to show the content in the modal to allow for editing the user profile.
  const [showContent, setShowContent] = useState(false);
  // Used to show the content in the modal to edit the aboutYou section 
  const [showContentAboutMe, setShowContentAboutMe] = useState(false)
  // Used in the modal to set and use a user defined image 
  const [ imageString, setImageString ] = useState(null);
  // Used in the modal to set and use a user defined username, 
  const [ userString, setUserString ] = useState(null);
  // Used in the modal to set and use a user defined description 
  const [ descriptionString, setDescriptionString ] = useState(null);
  // Used in the modal to set and use a user defined website
  const [ websiteString, setWebsiteString ] = useState(null);
  // Used in a useEffect to find if a profile is already liked by the user,
  const [isLiked, setIsLiked] = useState(false); // State to toggle the icon
  
  function handleClick(arg0: number) {
    //after the user clicks next in the edit modal, move to the next page, setSelection(true) enables this.
    var newSelection = [false, false, false,false]
    newSelection[arg0] = true;
    setSelection(newSelection)
  }
  const [clicked, setClicked] = useState(false)
  useEffect(() => {
    //if modal is opened disable scrolling.
    if (showContent) {
      window.scrollTo(0,0)
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }
  })

  // set isLiked to true if the user is signed in, if the signed in user is not the profile being viewed,
  // and if the person viewing is already following the user being viewed ,
 
  return (<>
     <div id={style.main}>
     <Scene/>
         <div id={style.body}>
          <div >
            <div id={style.header}>

            </div>
            <Profile 
             user={user}
             imageString={imageString}/>
          </div>
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
              <AboutMe setShowContent={setShowContentAboutMe}/>
              : null
            }

          </div>

         </div>
     </div>
     {
      //Modal object, TiltModal is animated onto screen.
            showContent ? 
              <div id={style.modalBacking}>
                <motion.div
            initial={{ x: "-100vw" }} 
            animate={{ x: clicked ? "-100vw" : 0 }} // Slide out when clicked
            transition={{ type: "spring", stiffness: 70, damping: 20 }}>
              <TiltModal userId={user._id} website={setWebsiteString} description={setDescriptionString} imageString={setImageString} username={setUserString} setShowContent={setShowContent}  closeModal={setClicked} icon={<MdOutlineClose/>}/>
              </motion.div>
              </div>
             : null
     }
     {showContentAboutMe && (
      <div id={style.modalBacking}>
    <motion.div
      initial={{ x: "-100vw" }}
      animate={{ x: 0 }} // Slides in
      exit={{ x: "-100vw" }} // Slides out
      transition={{ type: "spring", stiffness: 70, damping: 20 }}
    >
      <TiltModalAboutMe
       showContent={showContentAboutMe}
       setShowContent={setShowContentAboutMe} 
       aboutYou={user.aboutYou} 
      />
    </motion.div>
  </div>
)}
    </>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  const { query } = ctx;
  const { userId } = query;

  if (!isValidObjectId(userId)) {
    return { notFound: true }; // Validate MongoDB ID
  }

  try {
    await connectDB(); // Connect to MongoDB
    const user = await User.findById(userId);

    if (!user) {
      return { notFound: true }; // User not found
    }

    return {
      props: {
        userId,
        user: JSON.parse(JSON.stringify(user)), // Serialize user for Next.js
      },
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return {
      notFound: true,
    };
  }
}

