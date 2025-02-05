import * as React from 'react';
import style from './style.module.css';
import { useRef } from 'react';
import useMousePosition from '@/components/misc/GlowEffect/useMousePartition';


interface IProfileProps {
  user: any,
  imageString: string | null;
}

const Profile: React.FunctionComponent<IProfileProps> = (props) => {
  const { user, imageString } = props;
  const divRef = useRef(null);
  const { x,y } = useMousePosition(divRef)
  console.log(x, y)
  return <>
  <div id={style.profile} ref={divRef} style={{position:"relative"}}>
  {(x !== null && y !== null) && (
    <div
      id={style.glow}
      style={{
       position: 'absolute',
       left: x,
       top: y,
       transform: 'translate(-50%, -50%)',
       pointerEvents: 'none', // Ensures the glow doesn't block mouse events
       zIndex: 10,           // Adjust if necessary
      }}
    >
    </div>
  )}
  <div id={style.profileHeaderContainer}>
   <div id={style.profileHeader}>
    <div id={style.profileHeaderBackground}>

    </div>
   </div>
   <div id={style.profileOutline}>
   {
    /* if the user is signed in use the image from the userSession object, else use the DB user object,*/
    imageString ? <img id={style.image} src={ imageString } alt="" /> :
    <img id={style.image} src={ user.image } alt="" /> 
   }
   </div>
  </div>
  <div id={style.tiles}>
    <div id={style.tile1}></div>
    <div id={style.tile2}></div>
    <div id={style.tile3}></div>
    <div id={style.tile4}></div>
    <div id={style.tile5}></div>
    <div id={style.tile6}></div>
    <div id={style.tile7}></div>
    <div id={style.tile9}></div>
    <div id={style.tile10}></div>
    <div id={style.tile12}></div>
    <div id={style.tile13}></div>
    <div id={style.tile15}></div>
    <div id={style.loader}></div>
    <div id={style.loader2}></div>
    <div id={style.loader3}></div>
    <div id={style.loader4}></div>
    <div id={style.loader5}></div>
    <div id={style.loader6}></div>
  </div>
  </div>
  </>;
};

export default Profile;
