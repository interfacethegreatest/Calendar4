import React, { useEffect, useState } from 'react'
import ResetCard from '@/components/cards/ResetCard/ResetCard';
import { NextPageContext } from 'next';
import Scene from '@/components/backgrounds/starsBackground/Scene';
import { useSession } from 'next-auth/react';
import style from './style.module.css'
import { IoSearch } from 'react-icons/io5';
import { animate, motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import GenerateModal from '@/components/buttons/generateModal/generateModal';
import { z } from 'zod';

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
  

})

export default function forgot({userId}:{userId:string}) {
  const [profileData , setProfileData] = useState({});
  const [documentData, setDocumentData] = useState(null);
  const colour = useMotionValue(COLOURS[0])
  const border = useMotionTemplate`2px solid ${colour}`;
  const { data : session } = useSession();
  console.log(session)
  const [ selection, setSelection ] = useState([true, false, false, false]);
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
              
              <div id={style.titleLine}><h1 id={style.profileTitle}>{session?.user.name}</h1><div style={{display: "flex", marginLeft:"auto"}}><GenerateModal fields='Edit Profile'/></div></div>
              <h6 id={style.text}><u>Description</u></h6>
              <p id={style.text}>@{session?.user.name}</p>
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
              <div id={style.about}>
                <h3>About me</h3>
                <br />
                <p style={{color: "rgba(247, 243, 243, 0.562);"}} id={style.descriptionText}> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo alias sint natus neque quibusdam obcaecati. Nesciunt illum at voluptates laboriosam nihil. Tenetur tempore fugiat hic maxime est quo magni alias.
                Eveniet sint debitis optio culpa accusantium eligendi voluptate deleniti distinctio totam sunt ea consectetur, adipisci quos aliquid quisquam impedit recusandae consequuntur tempora perferendis! Tempora culpa perferendis iste commodi necessitatibus labore.</p>
                <br />
                <div id={style.documents}>
                  <h3>Documents</h3>
                  <br />
                  <div id={style.documentSection}>
                  <div id={style.transcriptSection}>
                  <h6>Transcripts</h6>
                  {
                    documentData ? null :
                    <div id={style.sectionText}>
                      <div id={style.entry}><a href="">Transcript</a><p>Last Updated: 2024-08-13</p></div>
                      <div id={style.entry}><a href="">Transcript</a><p>Last Updated: 2024-08-13</p></div>
                    </div>
                  }
                  </div>
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
              : null
            }

          </div>

         </div>
         {/* complete form */}
         <div id={style.search}>
          <form style={{display:"flex", width:"100%"}} action="">
            <button>
            <IoSearch id={style.searchIcon} />
            </button>
            <input id={style.searchInput} type="text" 
            placeholder='search'
            autoComplete='off'
            />
          </form>

         </div>
     </div>
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