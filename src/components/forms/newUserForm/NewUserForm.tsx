import * as React from 'react';
import style from './style.module.css';
import { Poppins } from 'next/font/google';
import { useRef, useState } from 'react';
import useOutsideClick from './outsideClick'; // Ensure the correct import
import Input from '@/components/input/input';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IoSearch } from 'react-icons/io5';
import axios from 'axios';

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

interface INewUserFormProps {
  csrfToken: string;
}

const FormSchema = z.object({
  //goToProfile: z.boolean().optional(),  // Optional because only one can be true
  //goToCalender: z.boolean().optional(),
  goToUserCalender: z.string().min(16, 'URL too short!'),
})//.refine(
  //(data) => data.goToProfile || data.goToCalender || data.goToUserCalender,
  //{ message: 'You must submit either a button or the calendar URL' }
//);

type FormSchemaType = z.infer<typeof FormSchema>;

const NewUserForm: React.FunctionComponent<INewUserFormProps> = (props) => {
  const { csrfToken } = props;
  const [showContent, setShowContent] = useState(false);
  const ref = useRef();

  // Call useOutsideClick after defining ref
  useOutsideClick(ref, () => setShowContent(false));

  function handleClick() {
    setShowContent(prev => !prev);
  }

  const {
   register,
   handleSubmit,
   setError,
   formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
   try {
    console.log(values.goToUserCalender);
    const { data } = await axios.post('/api/auth/newUser', {
      ...values,
      csrfToken
    });
   } catch (error: any) {
    console.error(error);
    setError('goToUserCalender', {
      type: 'manual',
      message: error.response?.data?.message || 'An unexpected error occurred',
    });
   }
  };

  return (
    <div id={style.formMain}>
      <form id={style.formStyle} action="">
        <button type="button" id={style.newUserButton}>
          <div id={style.buttonLeft}></div>
          <h6>
            <u>Customise your profile.</u>
          </h6>
          <span id={style.glowEffectClass}></span>
        </button>
        <button type="button" id={style.newUserMiddleButton}>
          <div id={style.buttonLeft}></div>
          <h6>
            <u>Customize your calendar!</u>
          </h6>
          <span id={style.glowEffectClass}></span>
        </button>
        <div ref={ref} onClick={()=>handleClick()} id={showContent ? style.newUserButtonBottomClicked : style.newUserButtonBottom}>
          <div id={style.buttonLeft}></div>
          {showContent ? null : (
            <h6 id={style.searchTitle}>
              <u>Find Another Calender?</u>
            </h6>
          )}
          <div id={showContent ? style.inputDivClicked : style.inputDiv}>
          <Input
           name="goToUserCalender"
           label="Click search button"
           type="text"
           icon={<IoSearch />}
           placeholder="Enter User Code"
           register={register}
           error={errors?.goToUserCalender?.message}
           disabled={false}
           autoComplete={true}
          />
          <button title='Search' type='submit' onClick={handleSubmit(onSubmit)} id={style.searchButton}></button>
          </div>
          <span id={style.glowEffectClass}></span>
        </div>
      </form>
    </div>
  );
};

export default NewUserForm;
