import * as React from 'react';
import style from './style.module.css';
import { Poppins } from 'next/font/google';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

interface IFollowingButtonProps {
  userId: string;
  setClicked: Function;
  clicked: boolean,
}

const 
FollowingButton: React.FunctionComponent<IFollowingButtonProps> = (props) => {
  const { userId, setClicked, clicked } = props;
  const { data: session } = useSession();
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { data } = await axios.post('/api/auth/removeFollower', {
        userId,
        session,
      });
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
    setClicked(!clicked);
  };

  return (
    <button
      id={style.followButton}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)} // Set hover state to true
      onMouseLeave={() => setIsHovered(false)} // Set hover state to false
    >
      {isHovered ? 'Unfollow' : 'Following'}
    </button>
  );
};

export default FollowingButton;
