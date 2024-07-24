"use client";
import * as React from 'react';
import styles from "./buttonStyle.module.css";
import { PropagateLoader } from 'react-spinners';
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google"
import { signIn } from 'next-auth/react';

const font = Poppins({
    subsets: ["latin"],
    weight: ["400"],
})

interface ISlideButtonProps {
    type: "submit" | "reset" | "button";
    mode?: "modal" | "redirect"
    asChild?: boolean;
    text: string;
    slide_text: string;
    disabled?: boolean;
    icon: JSX.Element;
    width: string
}

const SlideButton: React.FunctionComponent<ISlideButtonProps> = (props) => {
    const { type, text, slide_text, disabled, icon, width, asChild, mode } = props;
    const router = useRouter();
    const onClick = () => {
        if (mode === "redirect"){
            
            signIn()
        }

    }
    if ( mode === "modal"){
        return (
            <span>
                IMPLEMENT MODAL
            </span>
        )
    }
    return (
        <button
            type={type}
            disabled={disabled}
            id={styles.submitButton}
            onClick={onClick}
            style={{width:width}}
        >
            {disabled? (<PropagateLoader color='white'size={5} style={{display:"flex", justifyContent:"center", alignItems:"center"}}/>) : (
                <>
                <span id={styles.defaultText} className={font.className}>{text}</span>
                <span id={styles.hoverText} className={font.className}>{icon}{slide_text}</span>
                </>
            )}
            
        </button>
    );
};

export default SlideButton;
