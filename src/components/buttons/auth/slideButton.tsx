"use client";
import * as React from 'react';
import styles from "./buttonStyle.module.css";
import { PropagateLoader } from 'react-spinners';
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google"
import { signIn, signOut, useSession } from 'next-auth/react';
import { animate, motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';

const font = Poppins({
    subsets: ["latin"],
    weight: ["400"],
})

interface ISlideButtonProps {
    type: "submit" | "reset" | "button" | "modalSkip" | "modalSave";
    mode?: string;
    asChild?: boolean;
    text: string;
    slide_text: string | null;
    disabled?: boolean;
    icon: JSX.Element;   width: string
    animation: any; // animation is now a function that doesn't return state
    setScene: Function;
}

const COLOURS = [
    'rgba(159, 158, 158, 0.7)',
    'rgba(159, 158, 158, 0.5)',  
    'rgba(130, 129, 129, 0.35)', 
    'rgba(189, 188, 188, 0.2)', 
];

const SlideButton: React.FunctionComponent<ISlideButtonProps> = (props) => {
    const { type, mode, text, slide_text, disabled, icon, width, animation, setScene } = props;
    const colour = useMotionValue(COLOURS[0])
    const border = useMotionTemplate`2px solid ${colour}`
    const router = useRouter();
    const { data: session } = useSession();

    const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        // if user is attempting to register their account, send them home.
        if (mode === "signIn" || mode === "home") {
            router.push('/');
            return;
        }

        // Run the animation 
        if ( type === "modalSkip"){
            console.log("type = modalSkip")
            e.preventDefault();    
            setScene();
            return;
        }

        if ( session && type ==="button" ) {
            disabled == true;
            router.push(`/user/${session.id}`) 

        }

        // After animation completes, update the state to change the scene
        if (!session && type === "button"){
         setTimeout(() => {
            setScene(1);
         }, 1000); // Delay the state change by 1 second (or however long the animation lasts)
        }else{
            //console.log('SIGN IN! 67 slidebutton')
            //await signIn();
        }
    }

    useEffect(() => {
        animate(colour, COLOURS, {
            ease: "easeInOut",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
        });
    }, []);

    return (
        <motion.button
            type={type}
            disabled={disabled}
            id={styles.submitButton}
            onClick={onClick}
            style={{
                width: width,
                border
            }}
        >
            {disabled ? (
                <PropagateLoader color='white' size={5} style={{ display: "flex", justifyContent: "center", alignItems: "center" }} />
            ) : (
                <>
                    <span id={styles.defaultText} className={font.className}>{text}</span>
                    <span id={styles.hoverText} className={font.className}>{icon}{slide_text}</span>
                </>
            )}
        </motion.button>
    );
};

export default SlideButton;
