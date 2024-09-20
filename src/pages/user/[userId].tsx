import React from 'react'
import ResetCard from '@/components/cards/ResetCard/ResetCard';
import { NextPageContext } from 'next';
import Scene from '@/components/backgrounds/starsBackground/Scene';
import { useSession } from 'next-auth/react';


export default function forgot({userId}:{userId:string}) {
  const { data : session } = useSession();
  return (<>
     <div>
      <Scene/>
         <h1>Hello User</h1>
     </div>
    </>
  )
}

export async function getServerSideProps(ctx : NextPageContext){
    const { query } = ctx;
    console.log("hello"+query);
    return{
        props: { query },
    }
}