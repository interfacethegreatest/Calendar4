import React from 'react';
import style from './styles.module.css';
import NewUserCard from '../../components/cards/newUserCard/newUserCard'
import { useSession } from 'next-auth/react';
import { SlHome } from 'react-icons/sl';
import Scene from '@/components/backgrounds/starsBackground/Scene';


export default function index() {
  const { data: session } = useSession();
  console.log(session)
  return (
    <main id={style.main}>
      <Scene/>
      <NewUserCard
       buttonString={session?.user?.name?.split(' ')[0] ? `Welcome ${session?.user?.name?.split(' ')[0]}` : "Welcome!"}
       title="User Navigation" 
       icon={<SlHome/>}
       paragraph='Where would you like to go...'
      />
    </main>
  )
}
