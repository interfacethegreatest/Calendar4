import React from 'react'
import styles from './styles.module.css'
import RegisterCard from '@/components/cards/RegisterCard/RegisterCard'
import { Poppins } from 'next/font/google';

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function auth() {
  return (<>
     <div id={styles.authMain}>
      <RegisterCard title='Sign Up'/>
     </div>
    </>
  )
}