import * as React from 'react';
import styles from './ForgotForm.module.css'
import Input from '../../input/input'
import {CiMail} from 'react-icons/ci';
import SlideButton from "../../buttons/auth/slideButton";
import { AiFillLock } from 'react-icons/ai';
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'react-toastify';
import axios from 'axios';

interface IForgotFormProps {

}

const FormSchema = z.object({
  email:z.string().email('Please enter a valid email address.'),
});
type FormSchemaType=z.infer<typeof FormSchema>;

const ForgotForm: React.FunctionComponent<IForgotFormProps> = (props) => {
  const {} = props;
  const {
   register,
   handleSubmit,
   reset,
   formState : { errors, isSubmitting}
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema)
  });
  const onSubmit: SubmitHandler<FormSchemaType>=async(values)=>{
    try {
      const { data } = await axios.post('api/auth/forgot', {
        email: values.email,
      });
      reset();
      toast.success(data.message);
    } catch (error : any) {
      toast.error(error.response.data.message);
    }
  }
  console.log(errors)
  return <>
  <form id={styles.formStyle} onSubmit={handleSubmit(onSubmit)}>
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
    <SlideButton 
     type="submit"
     slide_text="Secure recovery"
     text= {"Send Email"}
     icon={<AiFillLock/>} 
     width="250px"
     disabled={isSubmitting}
    />
  </form>
  </>;
};

export default ForgotForm;
