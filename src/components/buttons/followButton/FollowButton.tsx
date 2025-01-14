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
}

const FollowButton: React.FunctionComponent<IFollowButtonProps> = (props) => {
 const { userId } = props;
 const { data: session } = useSession();
 console.log(userId)
 const handleClick = async () => {
    try {
     const { data } = await axios.post('/api/auth/addFollower',{
        userId, session
     });
    } catch (error : any) {
        toast.error(error)
    }
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
