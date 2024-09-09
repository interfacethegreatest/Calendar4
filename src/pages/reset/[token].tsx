import React from 'react'
import styles from '../styles.module.css'
import ResetCard from '@/components/cards/ResetCard/ResetCard';
import { NextPageContext } from 'next';
import Scene from '@/components/backgrounds/starsBackground/Scene';


export default function forgot({token}:{token:string}) {
  return (<>
     <div id={styles.authMain}>
      <Scene/>
         <ResetCard csrfToken={token} title='Forgot password?'/> 
     </div>
    </>
  )
}

export async function getServerSideProps(ctx : NextPageContext){
    const { query } = ctx;
    const token = query.token;
    return{
        props: { token },
    }
}
