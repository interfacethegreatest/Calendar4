
import ModalInput from '@/components/input/ModalInput/ModalInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiFillLock, AiOutlineLogin } from 'react-icons/ai';
import { z } from 'zod';
import styles from './tiltStyles.module.css'
import { Poppins } from 'next/font/google';
import { CiLock, CiMail } from 'react-icons/ci';
import SlideButtonSubmit from '@/components/buttons/auth/slideButtonSubmit';
import SlideButton from '@/components/buttons/auth/slideButton';
import Input from '@/components/input/input';

interface IProfileFormProps {
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const FormSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .max(20, { message: "Username must not exceed 20 characters" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(150, { message: "Description must not exceed 150 characters" }),
  website: z
    .string()
    .max(20, { message: "Website must not exceed 20 characters" }) // Apply max constraint
    .url({ message: "Please enter a valid URL" }) // Validate URL format
    .optional(), // Make the field optional
});

type FormSchemaType = z.infer<typeof FormSchema>;

const onSubmit: SubmitHandler<FormSchemaType>=async(values)=>{
  try {
    //success text
    alert("SUBMIT SUCCESS  ")
    
  } catch (error : any) {
    //error text
  }
}

const ProfileForm: React.FunctionComponent<IProfileFormProps> = (props) => {
  const [ animation, setAnimation ] = useState(true);
  const { data : session } = useSession();
  
  const {
    register,
    handleSubmit,
    watch,
    formState : { errors, isSubmitting}
   } = useForm<FormSchemaType>({
     resolver: zodResolver(FormSchema)
   });
  
  return (<>
    <h1 id={styles.modalTitle} className={font.className}>
       <b>
        Please Complete Your Bio
       </b>    
      </h1>
      <p id={styles.innerText} className={font.className}>
       ..Fill out all the relative information. Then submit.
      </p>
      <br />
      <form id={styles.formStyle} method="post" action="/api/auth/signin/email" onSubmit={handleSubmit(onSubmit)}>
    <ModalInput
        name="username"
        label="Username"
        type="text"
        icon={<CiMail />}
        placeholder="example@example.com"
        register={register}
        error={errors?.email?.message}
        disabled={isSubmitting} height={null} topLocation={null} inputLength={20} watch={{}}     />
    <br />
    <ModalInput
        name="description"
        label="Description"
        type="text"
        icon={<CiLock />}
        placeholder="**********"
        register={register}
        error={errors?.password?.message}
        disabled={isSubmitting} height={150} topLocation={20} inputLength={150} watch={{}}     />
        <br />
    <ModalInput
        name="password"
        label="Password"
        type="password"
        icon={<CiLock />}
        placeholder="**********"
        register={register}
        error={errors?.password?.message}
        disabled={isSubmitting} height={null} topLocation={null} inputLength={20} watch={{}}     />
    <br />
    <SlideButtonSubmit
     type="submit"
     slide_text="Secure sign in"
     text= {"Sign in"}
     icon={<AiFillLock/>} 
     width="250px"
     disabled={isSubmitting}
     animation={animation}
    />
  </form>
    </>
  );
};

export default ProfileForm;
