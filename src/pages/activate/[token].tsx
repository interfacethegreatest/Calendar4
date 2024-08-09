import { NextPageContext } from "next";
import { useEffect, useState } from "react";
import axios from "axios";
import ParticleBackground from "@/components/backgrounds/particleBackground";
import TiltCard from "@/components/cards/TiltCard/TiltCard";
import styles from '../styles.module.css';
import { SlHome } from "react-icons/sl";

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
           <ParticleBackground tileHeight={374} tileWidth={374} height="100vh" width="100vw" backgroundColor="#18191C">
            <TiltCard 
             buttonString={"Failed login"}
             slideText="Please try again!"
             title="Error!" 
             paragraph={error}
             icon={ <SlHome/>}
             buttonMode="home"
             />
           </ParticleBackground>
          </main>
        </>
      }
      {
        success && 
        <>
         <main id={styles.main}>
           <ParticleBackground tileHeight={374} tileWidth={374} height="100vh" width="100vw" backgroundColor="#18191C">
            <TiltCard 
             buttonString={"Sign In"}
             slideText="Continue"
             paragraph={success}
             title="Success!" 
             icon={ <SlHome/>}
             buttonMode="signIn"/>
           </ParticleBackground>
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
