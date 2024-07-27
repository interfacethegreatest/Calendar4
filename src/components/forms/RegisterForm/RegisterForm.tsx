import * as React from 'react';
import styles from './form.module.css'
import Input from '../../input/input'
import { CiUser } from 'react-icons/ci';

interface IRegisterFormProps {
}

const RegisterForm: React.FunctionComponent<IRegisterFormProps> = (props) => {
  return <>
  <form id={styles.formStyle} action="">
    <div id={styles.nameStyle}>
     <Input
      name="first_name"
      label="First name"
      type="text"
      icon={<CiUser />}
      placeholder="First name"
      //register={register}
      //error={errors?.first_name?.message}
      //disabled={isSubmitting}
     />
     <Input
      name="last_name"
      label="Last name"
      type="text"
      icon={<CiUser />}
      placeholder="Last name"
      //register={register}
      //error={errors?.first_name?.message}
      //disabled={isSubmitting}
     />
    </div>
  </form>
  </>;
};

export default RegisterForm;
