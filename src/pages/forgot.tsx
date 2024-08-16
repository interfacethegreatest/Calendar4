import React from 'react'
import styles from './styles.module.css'
import ForgotCard from '@/components/cards/ForgotCard/ForgotCard';


export default function forgot({}:{}) {
  return (<>
     <div id={styles.authMain}>
         <ForgotCard title='Forgot password?'/> 
     </div>
    </>
  )
}

