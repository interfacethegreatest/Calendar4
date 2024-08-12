import React from 'react'
import styles from './styles.module.css'
import RegisterCard from '@/components/cards/RegisterCard/RegisterCard'
import { Poppins } from 'next/font/google';
import LoginCard from '@/components/cards/LoginCard/LoginCard';
import { NextPageContext } from 'next';

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function auth({ tab }:{ tab : string}) {
  console.log(tab);
  return (<>
     <div id={styles.authMain}>
      {
        tab == "signin" ? <LoginCard title='Sign In'/> : <RegisterCard title='Sign Up'/>
      }
     </div>
    </>
  )
}

export async function getServerSideProps(ctx:NextPageContext) {
  const { req, query } = ctx;
  const tab = query.tab ? query.tab : "signin";
  return {
    props: { tab : JSON.parse(JSON.stringify(tab))},
  }
}