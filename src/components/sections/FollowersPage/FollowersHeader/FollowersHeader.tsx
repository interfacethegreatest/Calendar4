import * as React from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import style from './style.module.css';
import { FaArrowLeftLong } from "react-icons/fa6";

interface IFollowerHeaderProps {
  userId: string;
  user: {
    name: string;
  };
  selector: boolean;
  setSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

const FollowerHeader: React.FunctionComponent<IFollowerHeaderProps> = ({ userId, user, selector, setSelected }) => {
  const router = useRouter();

  return (
    <div id={style.header}>
      <div id={style.headerTop}>
        <div id={style.arrowContainer}>
          <button
            id={style.arrowButton}
            onClick={() =>
              router.push({
                pathname: `/user/${userId}`, // Navigate back to the user's page
              })
            }
          >
            <FaArrowLeftLong color="aliceblue" />
          </button>
        </div>
        <div id={style.nameContainer}>

          <h5><b>{user.name}</b></h5>
          <p>@{user.name}</p>
          
        </div>
      </div>
      <div id={style.pageSelector}>
        <div
          id={style.following}
          onClick={() => {
            setSelected(false); // Move selector to "Following"
          }}
        >
          <h6><b>Following</b></h6>
        </div>
        <div
          id={style.followers}
          onClick={() => {
            setSelected(true); // Move selector to "Followers"
          }}
        >
          <h6><b>Followers</b></h6>
          <motion.div
            id={style.Selector}
            animate={{
              x: selector ? 0 : 200, // Animate 200px to the right if `selector` is false
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FollowerHeader;
