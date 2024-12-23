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
import { AiOutlineStar } from 'react-icons/ai';
import { BiLinkExternal } from 'react-icons/bi';
import { isValidObjectId } from 'mongoose';


const COLOURS = [
  'rgba(159, 158, 158, 0.7)',
  'rgba(159, 158, 158, 0.5)',  
  'rgba(130, 129, 129, 0.35)', 
  'rgba(189, 188, 188, 0.2)', 
  'rgba(159, 158, 158, 0.17)'
];


export default function user({userId, user}:{userId:string, user: InferGetServerSidePropsType<typeof getServerSideProps>}) {
  console.log(user)
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
    //Record the changes to window size upon window resize,
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
                  /* if the user is signed in use the image from the userSession object, else use the DB user object,*/
                  session ? <img id={style.image} src={ imageString } alt="" /> :
                  <img id={style.image} src={ user.image } alt="" /> 
                }
              </div>
              <br />
            </div>
            <motion.div id={style.profileBody}>
              <div id={style.starDiv}>
              <AiOutlineStar id={style.star}/>
              </div>
            {
              /* If the user is signed in, populate the div with the session data. If not use the User from the backend, this enables the user change to be recorded and set. */
              session ? <div id={style.titleLine}><h1 id={style.profileTitle}>{userString ? userString : session?.user.name}</h1><div style={{display: "flex", marginLeft:"auto", position:"relative", zIndex:"3"}}><GenerateModal setShowContent={setShowContent} fields='Edit Profile'/></div></div> :
              <div id={style.titleLine}><h1 id={style.profileTitle}>{user.name}</h1></div>
            }
            {
              session ? <p id={style.text} style={{position:"relative", transform:"translate(0,-10px)", marginBottom:"0px"}}>@{session?.user.name}</p> :
              <p id={style.text} style={{position:"relative", transform:"translate(0,-10px)", marginBottom:"0px"}}>@{user.name}</p>
            }
            <h6 id={style.text} style={{marginBottom:"0px"}}><u>Description</u></h6>
            {
              session ? <p style={{color:"aliceblue", marginBottom:"0", width:"50%"}}>{ descriptionString }</p> :
              <p style={{color:"aliceblue", marginBottom:0, width:"50%"}}>{user.Biography}</p>
            }
            <div id={style.socials}><div id={style.social}><a href="">0</a><h6 id={style.location} style={{color:"GrayText",}}><u>Following</u></h6></div><div id={style.social}><a href="">0</a><h6 id={style.location} style={{color:"GrayText"}}><u>Following</u></h6></div></div>
            {
            user.Website !="" ? (
            <>
            <div
            id={style.websiteDiv}
            style={{ cursor: "pointer" }} // Indicates that the div is clickable
            >
            <div style={{display:"flex", flexDirection: "row-reverse"}}>
            <div id={style.websiteIconHolder}>
            <a href={user.Website} target="_blank" rel="noopener noreferrer">
              <BiLinkExternal color='grey' />
            </a>
            </div>
            <h6>
             <a style={{color:"aliceblue", fontSize:"1.1rem", textDecoration:"none", paddingRight:"10px"}} href={user.Website} id={user.websiteTextLink} target="_blank" rel="noopener noreferrer">
             Website:
             </a>
            </h6>
            </div>
            <a href={user.Website} target="_blank" rel="noopener noreferrer"><p style={{ fontSize:".6rem", textDecoration:"none", position:"relative", zIndex:"3", width:"100%"}}>{user.Website}</p></a>
            
            <div id={style.websiteLoader}>
              
            </div>
            </div>
            </>
            ) : null
            }

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
      //Modal object, TiltModal is animated onto screen.
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
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return {
      notFound: true,
    };
  }
}
