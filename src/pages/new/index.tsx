import React from 'react';
import style from './styles.module.css';
import NewUserCard from '../../components/cards/newUserCard/NewUserCard'
import { useSession } from 'next-auth/react';
import { SlHome } from 'react-icons/sl';
import Scene from '@/components/backgrounds/starsBackground/Scene';
import { getCsrfToken, getProviders } from 'next-auth/react';

export default function index({providers, tab, callbackUrl, csrfToken }:{providers:any, tab : string, callbackUrl:string, csrfToken:string}) {
  const { data: session } = useSession();
  return (
    <main id={style.main}>
      <Scene/>
      <NewUserCard
       buttonString={session?.user?.name?.split(' ')[0] ? `Welcome ${session?.user?.name?.split(' ')[0]}` : "Welcome!"}
       title="User Navigation" 
       icon={<SlHome/>}
       paragraph='Where would you like to go...'
       csrfToken={csrfToken}
      />
    </main>
  )
}
