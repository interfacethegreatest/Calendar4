import * as React from 'react';
import style from './style.module.css';
import { Poppins } from 'next/font/google';
import { useRef, useState } from 'react';
import useOutsideClick from './outsideClick'; // Ensure the correct import
import Input from '@/components/input/input';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CiUser } from 'react-icons/ci';

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

interface INewUserFormProps {
  callbackUrl: string;
  csrfToken: string;
}

const FormSchema = z.object({
  //goToProfile: z.boolean().optional(),  // Optional because only one can be true
  //goToCalender: z.boolean().optional(),
  goToUserCalender: z.string().min(16, 'URL too short!').optional(),
})//.refine(
  //(data) => data.goToProfile || data.goToCalender || data.goToUserCalender,
  //{ message: 'You must submit either a button or the calendar URL' }
//);

type FormSchemaType = z.infer<typeof FormSchema>;

const NewUserForm: React.FunctionComponent<INewUserFormProps> = (props) => {
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
   setValue,
   formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

    // Submit form handler
  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
   try {
    console.log(values);
      // Form submission logic (e.g., sending data to an API)
   } catch (error: any) {
    console.error(error.response);
   }
  };

  return (
    <div id={style.formMain}>
      <form id={style.formStyle} method="post" action="/api/auth/NewUser">
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
              <u>Enter User URL?</u>
            </h6>
          )}
          <div id={showContent ? style.inputDivClicked : style.inputDiv}>
          <Input
           name="last_name"
           label="Last name"
           type="text"
           icon={<CiUser />}
           placeholder="Last name"
           register={register}
           error={errors?.goToUserCalender?.message}
           disabled={false}
          />
          </div>
          <span id={style.glowEffectClass}></span>
        </div>
      </form>
    </div>
  );
};

export default NewUserForm;
