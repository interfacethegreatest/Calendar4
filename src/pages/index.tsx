import Image from "next/image";
import styles from "./styles.module.css"
import { IoHome } from "react-icons/io5";
import TiltCard from "@/components/cards/TiltCard/TiltCard";
import { SlHome } from "react-icons/sl";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useSession, signIn, signOut } from "next-auth/react";
import ParticleBackground from "@/components/backgrounds/particleBackground";


export default function Home() {
  const { data: session } = useSession();
  console.log(session)
  return (
    <>
    <main id={styles.main}>
      <ParticleBackground tileHeight={374} tileWidth={374} height="100vh" width="100vw" backgroundColor="#18191C">
       <TiltCard buttonString={session?.user?.name?.split(' ')[0]}  title="Calendar" icon={ session ? <RiLogoutCircleRLine/> : <SlHome/>}/>
      </ParticleBackground>
    </main>
    </>

  );
}