import React, { useEffect, useState } from 'react'
import ResetCard from '@/components/cards/ResetCard/ResetCard';
import { NextPageContext } from 'next';
import Scene from '@/components/backgrounds/starsBackground/Scene';
import { useSession } from 'next-auth/react';
import style from './style.module.css'
import { IoSearch } from 'react-icons/io5';
import { animate, motion, useMotionTemplate, useMotionValue } from 'framer-motion';

const COLOURS = [
  'rgba(159, 158, 158, 0.7)',
  'rgba(159, 158, 158, 0.5)',  
  'rgba(130, 129, 129, 0.35)', 
  'rgba(189, 188, 188, 0.2)', 
  'rgba(159, 158, 158, 0.17)'
];

export default function forgot({userId}:{userId:string}) {
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
              <h1 id={style.profileTitle}>{session?.user.name}</h1>
              <h6 id={style.text}><u>Description</u></h6>
              <p id={style.text}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto vero, reprehenderit culpa quidem odit excepturi nobis nihil ipsam incidunt, minima modi in libero omnis eaque. Suscipit assumenda accusantium eveniet corrupti.</p>

            </motion.div>
          </motion.div>
          <br />
          <br />
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
                <p id={style.descriptionText}> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo alias sint natus neque quibusdam obcaecati. Nesciunt illum at voluptates laboriosam nihil. Tenetur tempore fugiat hic maxime est quo magni alias.
                Eveniet sint debitis optio culpa accusantium eligendi voluptate deleniti distinctio totam sunt ea consectetur, adipisci quos aliquid quisquam impedit recusandae consequuntur tempora perferendis! Tempora culpa perferendis iste commodi necessitatibus labore.</p>
                <br />
                <div id={style.documents}>
                  <h3>Documents</h3>
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