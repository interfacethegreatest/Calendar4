import * as React from 'react';
import style from './style.module.css'
import { Poppins } from 'next/font/google';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

interface IFollowButtonProps {
    userId : string;
    setClicked: Function;
    clicked: boolean;
}

const FollowButton: React.FunctionComponent<IFollowButtonProps> = (props) => {
 const { userId, setClicked, clicked } = props;
 const { data: session } = useSession();
 const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
     const { data } = await axios.post('/api/auth/addFollower',{
        userId, session
     });
    } catch (error : any) {
        toast.error(error)
    }
    setClicked(!clicked);
 }
  
  return <>
  <button 
   onClick={handleClick}
   id={style.followButton}>
    Follow
  </button>
  </> ;
};

export default FollowButton;
