import Image from "next/image";
import styles from "./styles.module.css"
import { IoHome } from "react-icons/io5";
import TiltCard from "@/components/cards/TiltCard/TiltCard";
import { SlHome } from "react-icons/sl";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useSession, signIn, signOut, getCsrfToken, getProviders } from "next-auth/react";
import Scene from "@/components/backgrounds/starsBackground/Scene";
import { useEffect, useState } from "react";
import LoginCard from "@/components/cards/LoginCard/LoginCard";
import { NextPageContext } from "next";
import RegisterCard from "@/components/cards/RegisterCard/RegisterCard";
import ForgotCard from "@/components/cards/ForgotCard/ForgotCard";
import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home({providers, callbackUrl, csrfToken }:{providers:any, tab : string, callbackUrl:string, csrfToken:string}) {
  const { data: session } = useSession();
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [scene , setScene] = useState(0);

  useEffect(() => {
    // Mock scene loading complete after a delay
    const timer = setTimeout(() => {
      setSceneLoaded(true); // Set to true when Scene has "loaded"
    }, 500); // Adjust delay as needed based on actual loading time

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  console.log(providers)

  return (
    <>
      <main id={styles.main}>
        {/*<Scene />*/}
        <h1 id={styles.mainBannerText} className={font.className}>
          Make the most of your professional career.
        </h1>
        {sceneLoaded && scene === 0 && (
          <TiltCard 
            buttonString={session?.user?.name?.split(' ')[0] ? `Welcome ${session?.user?.name?.split(' ')[0]}` : "Welcome!"}
            title="Calendar" 
            icon={ session ? <RiLogoutCircleRLine /> : <SlHome /> }
            slideText={session?.user?.name?.split(' ')[0] ? "Continue," : "Login / Create an account"}
            buttonMode="X"
            changeScene={setScene}
            session={session != null}
          />
        )}
        {
          sceneLoaded && scene === 1 && (
            <LoginCard changeScene={setScene} providers={providers} csrfToken={csrfToken} callbackUrl={callbackUrl} title='Sign In' clicked={false}/>
          )
        }
        {
          sceneLoaded && scene === 2 && (
            <RegisterCard changeScene={setScene} providers={providers} csrfToken={csrfToken} callbackUrl={callbackUrl} title='Sign In' clicked={false}/>
          )
        }
        {
         sceneLoaded && scene === 3 && (
         <>
         {console.log("Passing setScene to ForgotCard:", setScene)}
         <ForgotCard changeScene={setScene} title="Forgot password?" />
         </>
        )
       }
      </main>
    </>
  );
}

export async function getServerSideProps(ctx:NextPageContext) {
  const { req, query } = ctx;
  const tab = query.tab ? query.tab : "signin";
  const callbackUrl = query.callbackUrl ? query.callbackUrl : process.env.NEXTAUTH_URL;
  const csrfToken = await getCsrfToken(ctx);
  const providers = await getProviders();
  return {
    props: { providers, tab : JSON.parse(JSON.stringify(tab)), callbackUrl, csrfToken},
  }
}