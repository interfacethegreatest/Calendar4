"use client";
import * as React from 'react';
import styles from "./buttonStyle.module.css";
import { Poppins } from "next/font/google";
import { animate, motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';
import { signIn } from 'next-auth/react';

const font = Poppins({
    subsets: ["latin"],
    weight: ["400"],
})

interface ISocialButtonProps {
    type: "submit";
    providerKey: string; // Changed from 'key' to 'providerKey' to avoid conflicts
    csrfToken: string;
    text: string;
    icon: JSX.Element;
    width: string;
}

const COLOURS = [
    'rgba(159, 158, 158, 0.7)',
    'rgba(159, 158, 158, 0.5)',  
    'rgba(130, 129, 129, 0.35)', 
    'rgba(189, 188, 188, 0.2)', 
];

const SocialButton: React.FunctionComponent<ISocialButtonProps> = (props) => {
    const { providerKey, csrfToken, type, text, icon, width } = props;
    const colour = useMotionValue(COLOURS[0]);
    const border = useMotionTemplate`2px solid ${colour}`;

    useEffect(() => {
        animate(colour, COLOURS, {
            ease: "easeInOut",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
        });
    }, []);

    return (
        <form method="post" action={`/api/auth/signin/${providerKey}`}>
            <input type="hidden" name="csrfToken" defaultValue={csrfToken} />
            <motion.button
                type={type}
                id={styles.submitSocialButton}
                style={{ width, border }}
                onClick={()=> signIn(providerKey)}
            >
                <span id={styles.defaultTextSocial} className={font.className}>{icon}</span>
            </motion.button>
        </form>
    );
};

export default SocialButton;
