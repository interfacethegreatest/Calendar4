import * as React from 'react';
import style from './style.module.css'
import { AiOutlineStar } from 'react-icons/ai';
import { Session } from 'next-auth';
import GenerateModal from '@/components/buttons/generateModal/generateModal';
import LikeButton from '@/components/buttons/LikeButton/LikeButton';

interface IProfileBodyProps {
    session: Session | null; // Session object from NextAuth, null if user is not logged in
    userString: string | null; // Optional override for user's name, string type
    descriptionString: string | null; //user newly entered description
    name: string | null; // User's name, nullable
    Biography: string | null;
    following : number;
    followers: number;
    setShowContent: React.Dispatch<React.SetStateAction<boolean>>; // Optional function to toggle modal content
}

const ProfileBody: React.FunctionComponent<IProfileBodyProps> = (props) => {
const { session, userString, descriptionString, name, Biography, followers, following, setShowContent} = props;
return <>
 <div id={style.starDiv}>
  <AiOutlineStar id={style.star}/>
 </div>
 {
 /* If the user is signed in, populate the div with the session data. If not use the User from the backend, this enables the user change to be recorded and set. */
  session ? <div id={style.titleLine}><h1 id={style.profileTitle}>{userString ? userString : name}</h1><div style={{display: "flex", marginLeft:"auto", position:"relative", zIndex:"3"}}><GenerateModal setShowContent={setShowContent} fields='Edit'/></div></div> :
  <div id={style.titleLine}><h1 id={style.profileTitle}>{name}</h1><div id={style.LikeButton} style={{display: "flex", marginLeft:"auto", position:"relative", zIndex:"3"}}><LikeButton /></div></div>
 }
 {
  session ? <p id={style.text} style={{position:"relative", transform:"translate(0,-10px)", marginBottom:"0px"}}>@{userString ? userString : name}</p> :
  <p id={style.text} style={{position:"relative", transform:"translate(0,-10px)", marginBottom:"0px"}}>@{name}</p>
 }
 <h6 id={style.text} style={{marginBottom:"0px"}}><u>Description</u></h6>
 {
  session ? <p style={{color:"aliceblue", marginBottom:"0", width:"50%"}}>{ session ? descriptionString : Biography }</p> :
  <p style={{color:"aliceblue", marginBottom:0, width:"50%"}}>{Biography}</p>
 }
 <div id={style.socials}><div id={style.social}><a href="">{following}</a><h6 id={style.location} style={{color:"GrayText",}}><u>Following</u></h6></div><div id={style.social}><a href="">{followers}</a><h6 id={style.location} style={{color:"GrayText"}}><u>Following</u></h6></div></div>
</> ;
};

export default ProfileBody;
