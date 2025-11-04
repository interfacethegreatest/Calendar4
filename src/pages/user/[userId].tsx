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
import FollowersPage from '@/components/sections/FollowersPage/FollowersPage';
import Projects from '@/components/sections/Projects/Projects';
import TiltModalProjects from '@/components/modals/TiltModalProjects/TiltModalProjects';
import Bookshelf from '@/components/sections/Bookshelf/Bookshelf';
import TiltModalBookshelf from '@/components/modals/TiltModalBookshelf/TiltModalBookshelf';


export default function user({
  userId,
  user,
  followingUsers,
  followers,
  following
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  // Used to check logged in user or not,
  const { data : session } = useSession();
  const isFollowing = session ? followingUsers.some(follower => follower._id.toString() === session.id)
  : false;
  const [isLiked, setIsLiked] = useState(isFollowing); // State to toggle the icon
  useEffect(()=>{
    if (session) {
      setIsLiked(followingUsers.some(follower=> follower._id.toString() === session.id))
    }
  }, [session, followingUsers])
  console.log(user._id)
  // Used to set the selection in the below the user profile,
  const [ selection, setSelection ] = useState([true, false, false, false]);
  // Used to show the content in the modal to allow for editing the user profile.
  const [showContent, setShowContent] = useState(false);
  // Used to show the content in the modal to edit the aboutYou section 
  const [showContentAboutMe, setShowContentAboutMe] = useState(false);
  const [showContentProjects, setShowContentProjects] = useState(false);
  const [showContentBookshelf, setShowContentBookshelf] = useState(false);
  // Used in the modal to set and use a user defined image 
  const [ imageString, setImageString ] = useState(null);
  // Used in the modal to set and use a user defined username, 
  const [ userString, setUserString ] = useState(null);
  // Used in the modal to set and use a user defined description 
  const [ descriptionString, setDescriptionString ] = useState(null);
  // Used in the modal to set and use a user defined website
  const [ websiteString, setWebsiteString ] = useState(null);
  // Used in a AboutYou to denote when the User edits or submits new AboutYou data via the modal.
  const [aboutYouServerSideProps, getAboutYouServerSideProps] = useState(true)

  //Used in aboutYouModal to load content,
  const [isAboutYouLoading, setIsAboutYouLoading] = useState(true);
  //uSed in projects to load content,
  const [projectServerSideProps, getProjectServerSideProps] = useState(true);
  //Used in bookshelf to load content,
  const [bookshelfServerSideProps, getBookshelfServerSideProps] = useState(true);
  //Variants for the profile component,
  const profileVariants = {
    initial: { scale: 1, opacity: 1 },
    exit: { 
      scale: 0.5, 
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
  };

  const [trigger, setTrigger] = useState(false);

  // Variants using keyframes:
  const moveVariants = {
    initial: { x: 0, y: 0 },
    moveOut: {
      // y goes from 0 to 200 and then stays at 200,
      // x remains 0 until halfway then goes off-screen to the left.
      y: [0, 200, 200],
      x: [0, 0, "-100vw"],
      transition: {
        times: [0, 0.1, 0.6],
        duration: 1, // adjust duration as needed
        ease: "easeInOut",
      },
    },
  };
  
  function handleClick(arg0: number) {
    //after the user clicks next in the edit modal, move to the next page, setSelection(true) enables this.
    var newSelection = [false, false, false,false]
    newSelection[arg0] = true;
    setSelection(newSelection);
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
  //if second modal opened, scroll to top - disable scrolling,
  useEffect(() => {
    //if modal is opened disable scrolling.
    if (showContentAboutMe) {
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
          <motion.div
          id={style.profileContainer}
          variants={moveVariants}
          initial="initial"
          animate={trigger ? "moveOut" : "initial"}
          >
          <div>
            <div id={style.header}>
            </div>
            <Profile 
            user={user}
            imageString={imageString}
            session={session}
            clicked={clicked}
            setClicked={setClicked}
            setShowContent={setShowContent}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            userString={userString} 
            descriptionString={descriptionString}
            websiteString={websiteString}
            setTrigger={setTrigger}
            />
          </div>
          <br />
          <br />
          <div id={style.selector}>
            {
              selection[0] ? <ul id={style.selectedText}>Bookshelf</ul> : <ul onClick={()=>handleClick(0)} id={style.selectorText}>Bookshelf</ul>
            }
            {
              selection[1] ? <ul id={style.selectedText}>Projects</ul> : <ul onClick={()=>{handleClick(1), getProjectServerSideProps(true) }} id={style.selectorText}>Projects</ul>
            }
            {
              selection[2] ? <ul id={style.selectedText}>About</ul> : <ul onClick={()=>handleClick(2)} id={style.selectorText}>About</ul>
            }
            {
              selection[3] ? <ul id={style.selectedText}>Blog</ul> : <ul onClick={()=>handleClick(3)} id={style.selectorText}>Blog</ul>
            }
          </div>
          <br />
          <div id={style.information}>
            {
              selection[0] ? 
              <Bookshelf 
              setShowContentProjects={setShowContentBookshelf}
              serverSideProps={bookshelfServerSideProps}
              getServerSideProps={getBookshelfServerSideProps}
              userId={userId}
              /> 
               : null
              
            }
          </div>
          <div id={style.information}>
            {
              selection[1] ? 
              <Projects 
               setShowContentProjects={setShowContentProjects}
               serverSideProps={projectServerSideProps}
               getServerSideProps={getProjectServerSideProps}
               userId={userId}
               /> 
               : null
              
            }
          </div>
          <div id={style.information}>
            {
              selection[2] ? 
              <AboutMe 
               isLoading={isAboutYouLoading} 
               setIsLoading={setIsAboutYouLoading} 
               setShowContent={setShowContentAboutMe}
               userId={user._id}
               serverSideProps={aboutYouServerSideProps}
               getServerSideProps={getAboutYouServerSideProps}
               setShowContentAboutMe={setShowContentAboutMe}
               /> : null
            }

          </div>
          </motion.div>
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
              <TiltModal 
               userId={userId} 
               website={setWebsiteString} 
               description={setDescriptionString} 
               imageString={setImageString} 
               username={setUserString} 
               setShowContent={setShowContent}  
               closeModal={setClicked} 
               icon={<MdOutlineClose/>}/>
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
       setServerSideProps={getAboutYouServerSideProps}
      />
    </motion.div>
  </div>
)}
{showContentProjects && (
      <div id={style.modalBacking}>
    <motion.div
      initial={{ x: "-100vw" }}
      animate={{ x: 0 }} // Slides in
      exit={{ x: "-100vw" }} // Slides out
      transition={{ type: "spring", stiffness: 70, damping: 20 }}
    >
      <TiltModalProjects
       showContent={showContentProjects}
       setShowContent={setShowContentProjects} 
       getServerSideProps={getProjectServerSideProps}
      />
    </motion.div>
  </div>
)}

{showContentBookshelf && (
      <div id={style.modalBacking}>
    <motion.div
      initial={{ x: "-100vw" }}
      animate={{ x: 0 }} // Slides in
      exit={{ x: "-100vw" }} // Slides out
      transition={{ type: "spring", stiffness: 70, damping: 20 }}
    >
      <TiltModalBookshelf
       showContent={showContentBookshelf}
       setShowContent={setShowContentBookshelf} 
       getServerSideProps={getBookshelfServerSideProps}
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

    if ( !user.followers ) {
      return { notFound : true }
    }

    if ( !user.following ) {
      return { notFound : true}
    }

    const followerIds = user.followers || [];
    const followingIds = user.following || [];
    const followingUsers = await User.find({ _id: { $in: followerIds } })
    .select('_id name')
    .lean();
    // Query for the user details of the followers and following
    const followers = await User.find({ _id: { $in: followerIds } })
      .select('_id name image Biography')
      .lean();
    const following = await User.find({ _id: { $in: followingIds } })
      .select('_id name image Biography')
      .lean();


    return {
      props: {
        userId,
        user: JSON.parse(JSON.stringify(user)),
        followingUsers: followingUsers.map((follower) => ({
          _id: follower._id.toString(),
          name: follower.name,
        })),
        followers: followers.map((follower) => ({
          _id: follower._id.toString(),
          name: follower.name,
          image: follower.image,
          Biography: follower.Biography,
        })),
        following: following.map((followedUser) => ({
          _id: followedUser._id.toString(),
          name: followedUser.name,
          image: followedUser.image,
          Biography: followedUser.Biography,
        })),
      },
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return {
      notFound: true,
    };
  }
}

