import * as React from 'react';
import styles from './form.module.css'
import Input from '../../input/input'
import { CiLock} from 'react-icons/ci';
import SlideButton from "../../buttons/auth/slideButton";
import { AiFillLock } from 'react-icons/ai';
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from 'react';
import zxcvbn from 'zxcvbn';
import { toast } from 'react-toastify';
import axios from 'axios';



interface IResetFormProps {
  csrfToken:string;
}

const FormSchema = z.object({
  password:z.string().min(7, "Must be atleast 7 characters.")
  .max(42,"Must be less than 42 characters."),
  confirmPassword: z.string(),
}).refine((data)=> data.password===data.confirmPassword,{
  message:"Password does not match.",
  path: ['confirmPassword'],
});
type FormSchemaType=z.infer<typeof FormSchema>;

const ResetForm: React.FunctionComponent<IResetFormProps> = (props) => {
  const {csrfToken } = props;
  console.log(csrfToken);
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
    console.log(values)
    try {
      const { data } = await axios.post('/api/auth/reset', {
        password:values.password,
        csrfToken,
      });
      reset();
      toast.success(data.message);

    } catch (error: any) {
      toast.error(error.response.data.message);
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
      <SlideButton 
       type="submit"
       slide_text="Reset"
       text= {"Change password"}
       icon={<AiFillLock/>} 
       width="250px"
       disabled={isSubmitting}
       />
  </form>
  </>;
};

export default ResetForm;
