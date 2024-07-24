import Image from "next/image";
import styles from "./styles.module.css"
import { IoHome } from "react-icons/io5";
import TiltCard from "@/components/cards/TiltCard";
import { SlHome } from "react-icons/sl";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useSession, signIn, signOut } from "next-auth/react";


export default function Home() {
  const { data: session } = useSession();
  console.log(session)
  return (
    <>
    <main id={styles.main}>
      <br />
       <TiltCard buttonString={session?.user?.name?.split(' ')[0]}  title="Calendar" icon={ session ? <RiLogoutCircleRLine/> : <SlHome/>}/>
    </main>
    </>

  );
}