import React from 'react'
import styles from './styles.module.css'
import RegisterForm from '@/components/forms/RegisterForm/RegisterForm'

export default function auth() {
  return (
    <div id={styles.authMain}>
      <RegisterForm title='Sign Up'/>
    </div>
  )
}
