import * as React from 'react';
import style from './style.module.css';


interface IProfileProps {
}

const Profile: React.FunctionComponent<IProfileProps> = (props) => {
  return <>
  <div id={style.profile}>
  <div id={style.profileHeader}>

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
