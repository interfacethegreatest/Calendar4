import * as React from 'react';
import styles from './LoginForm.module.css'
import Input from '../../input/input'
import { CiLock} from 'react-icons/ci';
import SlideButton from "../../buttons/auth/slideButton";
import { AiFillLock } from 'react-icons/ai';
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { CiMail } from "react-icons/ci";
import { toast } from 'react-toastify';
import { signIn } from 'next-auth/react';
import { router } from 'next/router';
import SocialButton from '@/components/buttons/auth/socialButton';
import { FcGoogle } from "react-icons/fc";
import { RxGithubLogo } from "react-icons/rx";
import { FaDiscord } from "react-icons/fa";

interface ILoginFormProps {
  callbackUrl:string;
  csrfToken:string;
  providers: any
}

const FormSchema = z.object({
  email:z.string().email('Please enter a valid email address.'),
  password:z.string().min(7, "Must be atleast 7 characters.")
  .max(42,"Must be less than 42 characters."),
});
type FormSchemaType=z.infer<typeof FormSchema>;

const LoginForm: React.FunctionComponent<ILoginFormProps> = (props) => {
  const { providers, callbackUrl, csrfToken } = props;
  const {
   register,
   handleSubmit,
   formState : { errors, isSubmitting}
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema)
  });
  const onSubmit: SubmitHandler<FormSchemaType>=async(values)=>{
   const res: any = await signIn('credentials', {
    redirect: false,
    email: values.email,
    password: values.password,
    callbackUrl,
   });
   if(res.error){
    return toast.error(res.error)
   }else{
    return router.push('/')
   }
  }
  console.log(providers);
  return <>
  <form id={styles.formStyle} method="post" action="/api/auth/signin/email" onSubmit={handleSubmit(onSubmit)}>
    <input type="hidden" name='csrfToken' defaultValue={csrfToken} />
    <Input
      name="email"
      label="Email address"
      type="text"
      icon={<CiMail/>}
      placeholder="example@example.com"
      register={register}
      error={errors?.email?.message}
      disabled={isSubmitting}
     />
    <br />
    <Input
      name="password"
      label="Password"
      type="password"
      icon={<CiLock/>}
      placeholder="**********"
      register={register}
      error={errors?.password?.message}
      disabled={isSubmitting}
     />
      <SlideButton 
       type="submit"
       slide_text="Secure sign in"
       text= {"Sign in"}
       icon={<AiFillLock/>} 
       width="250px"
       disabled={isSubmitting}
       />
  </form>
  <br />
     <div id={styles.socialDiv}>
      <SocialButton
       type="submit"
       providerKey={providers['google'].id}
       csrfToken={csrfToken}
       text={providers['google'].name}
       icon={<FcGoogle />}
       width='45px'
      />
      <SocialButton
       type="submit"
       providerKey={providers["github"].id}
       csrfToken={csrfToken}
       text={providers["github"].name}
       icon={<RxGithubLogo />}
       width='45px'
      />
      <SocialButton
       type="submit"
       providerKey={providers["discord"].id}
       csrfToken={csrfToken}
       text={providers["discord"].name}
       icon={<FaDiscord/>}
       width='45px'
      />
     </div>
  </>;
};

export default LoginForm;
