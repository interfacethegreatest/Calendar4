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
    onClick?: Function; 
}

const COLOURS = [
    'rgba(159, 158, 158, 0.7)',
    'rgba(159, 158, 158, 0.5)',  
    'rgba(130, 129, 129, 0.35)', 
    'rgba(189, 188, 188, 0.2)', 
];

const SlideButton: React.FunctionComponent<ISlideButtonProps> = (props) => {
    const { type, text, slide_text, disabled, icon, width, animation, setScene } = props;
    const colour = useMotionValue(COLOURS[0])
    const border = useMotionTemplate`2px solid ${colour}`
    const router = useRouter();
    const { data: session } = useSession();
    console.log(session + "slidebutton")

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
            type={"submit"}
            disabled={disabled}
            id={styles.submitButton}
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
