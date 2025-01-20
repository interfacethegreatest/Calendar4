import * as React from 'react';
import style from './style.module.css'
import { useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

interface IFollowingBodyProps {
}

const FollowingBody: React.FunctionComponent<IFollowingBodyProps> = (props) => {
 const [loading, setLoading] = useState(true);
 return <>
 {
    loading ? 
    <div id={style.loader}>
     <ClipLoader color="rgb(30, 245, 1)" size={15} />
    </div>
    : null
 }
 </>;
};

export default FollowingBody;
