import * as React from 'react';
import styles from './form.module.css'
import Input from '../../input/input'
import { CiUser } from 'react-icons/ci';
import SlideButton from "../../buttons/auth/slideButton";
import { AiFillLock } from 'react-icons/ai';
import { useForm } from "react-hook-form";


interface IRegisterFormProps {

}

const RegisterForm: React.FunctionComponent<IRegisterFormProps> = (props) => {
  const {
   register,
   handleSubmit,
   watch,
   formState : { errors, isSubmitting}
  } = useForm();
  const onSubmit = (data : any) => console.log(data);
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
      error={"errors?.first_name?.message"}
      disabled={isSubmitting}
     />
     <Input
      name="last_name"
      label="Last name"
      type="text"
      icon={<CiUser />}
      placeholder="Last name"
      register={register}
      error={"errors?.first_name?.message"}
      disabled={isSubmitting}
     />
    </div>
    <div>
      <SlideButton 
       type="button"
       slide_text="Secure sign up"
       text= {"Submit"}
       icon={<AiFillLock/>} 
       width="250px"
       mode="redirect" 
       />
    </div>
  </form>
  </>;
};

export default RegisterForm;
