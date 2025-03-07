import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import FollowerHeader from './FollowersHeader/FollowersHeader';
import FollowersBody from './FollowersBody/FollowersBody';
import FollowingBody from './FollowingBody/FollowingBody';

interface IFollowersPageProps {
    userId : string | string[] | undefined,
    followers: {
        _id: any;
        name: any;
        image: any;
        Biography: any;
    }[],
    following: {
        _id: any;
        name: any;
        image: any;
        Biography: any;
    }[],
    user: {
        _id: any;
        name: any;
        email: any;
        image: any;
        Biography: any;
    },
}

const FollowersPage: React.FunctionComponent<IFollowersPageProps> = (props) => {
const { user, userId, followers, following } = props;
const [selector, setSelected] = useState(true);
const router = useRouter();
useEffect(()=> {
   if ( router.query.selected === 'false' ){
    setSelected(false); // set selector to false if query parameter is false,
   } else{
    setSelected(true);
   }
}, [router.query.selected])
return(
<>
 <FollowerHeader userId={userId} user={user} selector={selector} setSelected={setSelected} />
  {
    selector ?
    <FollowersBody userid={userId} followers={followers} following={following} />
    : 
    <FollowingBody userid={userId} followers={followers} following={following}/>
 }
</>
)
};

export default FollowersPage;
