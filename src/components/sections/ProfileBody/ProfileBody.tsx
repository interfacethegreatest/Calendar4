import * as React from "react";
import style from "./style.module.css";
import { AiOutlineStar } from "react-icons/ai";
import { Session } from "next-auth";
import GenerateModal from "@/components/buttons/generateModal/generateModal";
import LikeButton from "@/components/buttons/LikeButton/LikeButton";
import { useState } from "react";
import { useRouter } from "next/router";

interface IProfileBodyProps {
  userId: string;
  session: Session | null; // Session object from NextAuth, null if user is not logged in
  userString: string | null; // Optional override for user's name, string type
  descriptionString: string | null; // User newly entered description
  name: string | null; // User's name, nullable
  Biography: string | null;
  following: number;
  followers: number;
  setShowContent: React.Dispatch<React.SetStateAction<boolean>>; // Optional function to toggle modal content
  isLiked : boolean;
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileBody: React.FunctionComponent<IProfileBodyProps> = (props) => {
  const {
    session,
    userString,
    descriptionString,
    name,
    Biography,
    followers,
    following,
    setShowContent,
    userId,
    isLiked,
    setIsLiked,
  } = props;

  const [newFollowers, setFollowing] = useState(followers);
  const isSessionLoading = session === undefined;
  const router = useRouter();

  return (
    <>
      <div id={style.starDiv}>
        <AiOutlineStar id={style.star} />
      </div>

      <div id={style.titleLine}>
        <h1 id={style.profileTitle}>
          {userString ? userString : name}
        </h1>
        <div
          style={{
            display: 'flex',
            marginLeft: 'auto',
            position: 'relative',
            zIndex: '3',
          }}
        >
          {session?.id === userId ? (
            <GenerateModal setShowContent={setShowContent} fields="Edit" />
          ) : (
            <LikeButton
              isLiked={isLiked}
              setIsLiked={setIsLiked}
              userId={userId}
              followers={newFollowers}
              setFollowers={setFollowing}
            />
          )}
        </div>
      </div>

      <p
        id={style.text}
        style={{
          position: 'relative',
          transform: 'translate(0,-10px)',
          marginBottom: '0px',
        }}
      >
        @{userString ? userString : name}
      </p>

      <h6 id={style.text} style={{ marginBottom: '0px' }}>
        <u>Description</u>
      </h6>
      <p style={{ color: 'aliceblue', marginBottom: '0', width: '50%' }}>
        {descriptionString ? descriptionString : Biography}
      </p>

      <div id={style.socials}>
        <div id={style.social}>
          <a href={`/user/${userId}/followers`}>{newFollowers}</a>
          <h6 id={style.location} style={{ color: 'GrayText' }}>
            <a style={{ color: 'GrayText' }} href={`/user/${userId}/followers`}>
              <u>Followers</u>
            </a>
          </h6>
        </div>

        <div id={style.social}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              router.push({
                pathname: `/user/${userId}/followers`, // target page
                query: { selected: 'false' }, // Pass the query parameter as 'false'
              });
            }}
          >
            {following}
          </a>
          <h6 id={style.location} style={{ color: 'GrayText' }}>
            <a href="#"
            style={{color:"GrayText"}}
            onClick={(e)=>{
              e.preventDefault();
              router.push({
                pathname: `/user/${userId}/followers`, // target page
                query: { selected: 'false' }, // Pass the query parameter as 'false'
              })
            }}><u>Following</u></a>
          </h6>
        </div>
      </div>
    </>
  );
};

export default ProfileBody;
