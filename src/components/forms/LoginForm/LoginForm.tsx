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


interface ILoginFormProps {

}

const FormSchema = z.object({
  email:z.string().email('Please enter a valid email address.'),
  password:z.string().min(7, "Must be atleast 7 characters.")
  .max(42,"Must be less than 42 characters."),
});
type FormSchemaType=z.infer<typeof FormSchema>;

const LoginForm: React.FunctionComponent<ILoginFormProps> = (props) => {
  const {
   register,
   handleSubmit,
   formState : { errors, isSubmitting}
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema)
  });
  const onSubmit: SubmitHandler<FormSchemaType>=async(values)=>{
    
  }
  return <>
  <form id={styles.formStyle} action="" onSubmit={handleSubmit(onSubmit)}>
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
     <br />
      <SlideButton 
       type="submit"
       slide_text="Secure sign in"
       text= {"Sign in"}
       icon={<AiFillLock/>} 
       width="250px"
       disabled={isSubmitting}
       />
  </form>
  </>;
};

export default LoginForm;
