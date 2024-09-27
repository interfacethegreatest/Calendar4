import React, { useState } from 'react'
import ResetCard from '@/components/cards/ResetCard/ResetCard';
import { NextPageContext } from 'next';
import Scene from '@/components/backgrounds/starsBackground/Scene';
import { useSession } from 'next-auth/react';
import style from './style.module.css'
import { IoSearch } from 'react-icons/io5';

export default function forgot({userId}:{userId:string}) {
  const { data : session } = useSession();
  const [ selection, setSelection ] = useState([true, false, false, false]);
  console.log(session);

  function handleClick(arg0: number) {
    var newSelection = [false, false, false,false]
    newSelection[arg0] = true;
    setSelection(newSelection)
  }

  return (<>
     <div id={style.main}>
      <Scene/>
         <div id={style.body}>
          <br />
          <div id={style.profile}>
           <img id={style.profileImage} src={session?.user.image} alt="Profile Image" />
           <div id={style.titleText}>
            <h1 id={style.name}>{session?.user.name}</h1>
            <p id={style.description}>Description, i.e. Forensics, Web development and AI Enthusiast, Aspiring Entrepeneur.</p>
            <h6 id={style.location}>Location, i.e. London, Enfield, Great Britain</h6>
            <div id={style.social}>
              <div id={style.socials}>
                 <a href="">0</a><h6 id={style.location} style={{color:"GrayText"}}><u>Following</u></h6>
              </div>
              <div id={style.socials}>
                 <a href="">0</a><h6 id={style.location} style={{color:"GrayText"}}><u>Followers</u></h6>
              </div>
            </div>
           </div>
          </div>
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
                <p> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo alias sint natus neque quibusdam obcaecati. Nesciunt illum at voluptates laboriosam nihil. Tenetur tempore fugiat hic maxime est quo magni alias.
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