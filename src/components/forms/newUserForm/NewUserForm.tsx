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
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

interface INewUserFormProps {}

const FormSchema = z.object({
  goToProfile: z.boolean().default(false),
  goToCalender: z.boolean().default(false),
  goToUserCalender: z.union([z.string().min(24, 'URL too short!').max(24, "URL too long!").regex(new RegExp("^[a-zA-Z0-9]{24}$"), "No special characters or spaces allowed."), z.null()]).optional(),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const NewUserForm: React.FunctionComponent<INewUserFormProps> = () => {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const ref = useRef();
  const { data: session } = useSession();
  // Call useOutsideClick after defining ref
  useOutsideClick(ref, () => setShowContent(false));

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    console.log('Form Submitted', values);
    try {
      const { data } = await axios.post('/api/auth/newUser', {
        ...values,
      });
      console.log('Success: ', data.message);
      if ( data.message == "userProfile"){
        //router.push('/user/'+session)
        router.push('/user/'+session.Id)
      }
    } catch (error: any) {
      console.error('Error:', error);
      setError('goToUserCalender', {
        type: 'manual',
        message: error.response?.data?.message || 'An unexpected error occurred',
      });
    }
  };

  function handleClick() {
    setShowContent((prev) => !prev);
  }

  function calenderButton() {
    setValue('goToCalender', true);
    setValue('goToUserCalender', null);
    handleSubmit(onSubmit)(); 
  }

  function profileButton(){
    setValue("goToProfile", true);
    setValue('goToUserCalender', null);
    handleSubmit(onSubmit)();
  }

  return (
    <div id={style.formMain}>
      <form id={style.formStyle}>
        <button type="button" id={style.newUserButton} onClick={profileButton}>
          <div id={style.buttonLeft}></div>
          <h6>
            <u>Customise your profile.</u>
          </h6>
          <span id={style.glowEffectClass}></span>
        </button>
        <button type="button" onClick={calenderButton} id={style.newUserMiddleButton}>
          <div id={style.buttonLeft}></div>
          <h6>
            <u>Customize your calendar!</u>
          </h6>
          <span id={style.glowEffectClass}></span>
        </button>
        <div ref={ref} onClick={handleClick} id={showContent ? style.newUserButtonBottomClicked : style.newUserButtonBottom}>
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
            <button type="submit" title="Search" onClick={handleSubmit(onSubmit)} id={style.searchButton}></button>
          </div>
          <span id={style.glowEffectClass}></span>
        </div>
      </form>
    </div>
  );
};

export default NewUserForm;
