import * as React from 'react';
import styles from './form.module.css'
import Input from '../../input/input'
import { CiLock, CiUser } from 'react-icons/ci';
import SlideButton from "../../buttons/auth/slideButton";
import { AiFillLock } from 'react-icons/ai';
import { SubmitHandler, useForm } from "react-hook-form";
import { ClimbingBoxLoader } from 'react-spinners';
import { array, z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { CiMail } from "react-icons/ci";
import { useState, useEffect } from 'react';
import zxcvbn from 'zxcvbn';
import { toast } from 'react-toastify';
import axios from 'axios'

interface IRegisterFormProps {

}

const FormSchema = z.object({
  first_name:z.string().min(2, "Must be atleast 2 characters.")
  .max(26, "Must be less than 26 characters.")
  .regex(new RegExp("^[a-zA-z]+$"), "No special characters allowed."),
  last_name:z.string().min(2, "Must be atleast 2 characters.")
  .max(26, "Must be less than 26 characters.")
  .regex(new RegExp("^[a-zA-z]+$"), "No special characters allowed."),
  email:z.string().email('Please enter a valid email address.'),
  password:z.string().min(7, "Must be atleast 7 characters.")
  .max(42,"Must be less than 42 characters."),
  confirmPassword: z.string(),
  accept: z.literal(true, {
    errorMap: ()=>({
      message: "Please agree to all the terms and conditions before continuing."
    })
  }),

}).refine((data)=> data.password===data.confirmPassword,{
  message:"Password does not match.",
  path: ['confirmPassword'],
});
type FormSchemaType=z.infer<typeof FormSchema>;

const RegisterForm: React.FunctionComponent<IRegisterFormProps> = (props) => {
  const [ passwordScore, setPasswordScore ] = useState(0)
  const [ confirmPasswordScore, setConfirmPasswordScore ] = useState(0)
  const {
   register,
   handleSubmit,
   watch,
   reset,
   formState : { errors, isSubmitting}
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema)
  });
  const onSubmit: SubmitHandler<FormSchemaType>=async(values)=>{
    try {
      const { data } = await axios.post('/api/auth/signup', {
        ...values,
      });
      reset();
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
      reset({password:'', confirmPassword:''});
      
    }
  }
  const validatePasswordStrength =()=>{
    let password = watch().password;
    return zxcvbn(password? password : "").score;
  }
  const validateConfirmPasswordStrength =()=>{
    let confirmPassword = watch().confirmPassword;
    return zxcvbn(confirmPassword? confirmPassword : "").score;
  }
  useEffect(()=>{
    setPasswordScore(validatePasswordStrength())
  }, [watch().password])
  useEffect(()=>{
    setConfirmPasswordScore(validateConfirmPasswordStrength())
  }, [watch().confirmPassword])
  return <>
  <form id={styles.formStyle} action="" onSubmit={handleSubmit(onSubmit)}>
    <div id={styles.nameStyle}>
     <Input
      name="first_name"
      label="First name"
      type="text"
      icon={<CiUser />}
      placeholder="First name"
      register={register}
      error={errors?.first_name?.message}
      disabled={isSubmitting}
     />
     <br />
     <br />
     <Input
      name="last_name"
      label="Last name"
      type="text"
      icon={<CiUser />}
      placeholder="Last name"
      register={register}
      error={errors?.last_name?.message}
      disabled={isSubmitting}
     />
    </div>
    <br />
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
     {
      <div id={styles.validatePasswordStrength}>
        {
          Array.from(Array(passwordScore).keys()).map((span,i)=>(
            <span
             id={
              validatePasswordStrength() <= 2 ?
              styles.validatePasswordRed :
              validatePasswordStrength() == 3 ?
              styles.validatePasswordYellow :
              validatePasswordStrength() >= 4?
              styles.validatePasswordGreen :
              styles.validatePasswordRed
             }
             style={{width:"25%"}}
             >

            </span>
          ))
        }
      </div>
     }
     <br />
    <Input
      name="confirmPassword"
      label="Confirm Password"
      type="password"
      icon={<CiLock/>}
      placeholder="**********"
      register={register}
      error={errors?.confirmPassword?.message}
      disabled={isSubmitting}
     />
     {
      <div id={styles.validatePasswordStrength}>
        {
          Array.from(Array(confirmPasswordScore).keys()).map((span,i)=>(
            <span
             id={
              validateConfirmPasswordStrength() <= 2 ?
              styles.validatePasswordRed :
              validateConfirmPasswordStrength() == 3 ?
              styles.validatePasswordYellow :
              validateConfirmPasswordStrength()>= 4?
              styles.validatePasswordGreen :
              styles.validatePasswordRed
             }
             style={{width:"25%"}}
             >

            </span>
          ))
        }
      </div>
     }
     <br />
    <div id={styles.checkBoxDesign}>
      <input type="checkbox" id='accept' {...register("accept")}/>
      <div id={styles.Text}>I accept the&nbsp;<a href="" target='_blank'>terms</a>&nbsp;and&nbsp;<a href="" target='_blank'>privacy policy</a></div>
    </div>http://localhost:3000/auth?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F
    <div id={styles.errorText}>
      {errors.accept?.message}</div>
      <SlideButton 
       type="submit"
       slide_text="Secure sign up"
       text= {"Submit"}
       icon={<AiFillLock/>} 
       width="250px"
       disabled={isSubmitting}
       />
  </form>
  </>;
};

export default RegisterForm;
