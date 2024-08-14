import React from 'react'
import styles from './styles.module.css'
import RegisterCard from '@/components/cards/RegisterCard/RegisterCard'
import { Poppins } from 'next/font/google';
import LoginCard from '@/components/cards/LoginCard/LoginCard';
import { NextPageContext } from 'next';
import { getCsrfToken, getProviders } from 'next-auth/react';

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function auth({ tab, callbackUrl, csrfToken }:{ tab : string, callbackUrl:string, csrfToken:string}) {
  return (<>
     <div id={styles.authMain}>
      {
        tab == "signin" ?
         <LoginCard csrfToken={csrfToken} callbackUrl={callbackUrl} title='Sign In'/> :
         <RegisterCard title='Sign Up'/>
      }
     </div>
    </>
  )
}

export async function getServerSideProps(ctx:NextPageContext) {
  const { req, query } = ctx;
  const tab = query.tab ? query.tab : "signin";
  const callbackUrl = query.callbackUrl ? query.callbackUrl : process.env.NEXTAUTH_URL;
  const csrfToken = await getCsrfToken(ctx);
  const providers = await getProviders();
  console.log(providers)
  return {
    props: { tab : JSON.parse(JSON.stringify(tab)), callbackUrl, csrfToken},
  }
}