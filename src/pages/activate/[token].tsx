import { NextPageContext } from "next";
import { useEffect, useState } from "react";
import axios from "axios";
import TiltCard from "@/components/cards/TiltCard/TiltCard";
import styles from '../styles.module.css';
import { SlHome } from "react-icons/sl";
import Scene from "@/components/backgrounds/starsBackground/Scene";

export default function activate({ token }:{ token : string }) {
  const [error, setError] = useState("");
  const [ success, setSuccess ] = useState("");
  useEffect(()=>{
    activateAccount()
  }, [token]);
  const activateAccount = async()=>{
    try {
       const { data } = await axios.put("/api/auth/activate", { token });
       setSuccess(data.message); 
    } catch (error) {
        setError((error?.response?.data as Error).message);
    }
  }
  return (
    <div>
      {
        error &&
         <>
          <main id={styles.main}>
            <Scene/>
            <TiltCard 
             buttonString={"Failed login"}
             slideText="Please try again!"
             title="Error!" 
             paragraph={error}
             icon={ <SlHome/>}
             buttonMode="home"
             />
          </main>
        </>
      }
      {
        success && 
        <>
         <main id={styles.main}>
            <Scene/>
            <TiltCard 
             buttonString={"Sign In"}
             slideText="Continue"
             paragraph={success}
             title="Success!" 
             icon={ <SlHome/>}
             buttonMode="signIn"/>
          </main>
        </>
      }
    </div>
  )
}

export async function getServerSideProps(ctx:NextPageContext){
    const { query } = ctx;
    const token = query.token;
    console.log(token)
    return {
        props:{ token },
    };
}
