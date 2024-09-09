import React from 'react'
import styles from './styles.module.css'
import ForgotCard from '@/components/cards/ForgotCard/ForgotCard';
import Scene from '@/components/backgrounds/starsBackground/Scene';


export default function forgot({}:{}) {
  return (<>
     <div id={styles.authMain}>
      <Scene/>
         <ForgotCard title='Forgot password?'/> 
     </div>
    </>
  )
}

