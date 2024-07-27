import React from 'react'
import styles from './styles.module.css'
import RegisterCard from '@/components/cards/RegisterCard/RegisterCard'

export default function auth() {
  return (
    <div id={styles.authMain}>
      <RegisterCard title='Sign Up'/>
    </div>
  )
}
