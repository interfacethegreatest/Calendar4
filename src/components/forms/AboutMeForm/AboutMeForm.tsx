import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import style from './style.module.css';

interface IAboutMeFormProps {
}

const FormSchema = z.object({
  AboutMe: z
    .string()
    .min(1, { message: "Description is required." })
    .max(1050, { message: "Description must not exceed 1050 characters." })
    .optional()
    .or(z.literal('')),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const AboutMeForm: React.FunctionComponent<IAboutMeFormProps> = (props) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });
  const onSubmit: SubmitHandler<FormSchemaType> = async (values ) => {
    try {
        
    } catch (error) {
        alert("Error during submit: "+ error);
    }
  }
  return <>
  <form id={style.innerContainer} action="" onSubmit={handleSubmit(onSubmit)}>
     <div id={style.leftArrowContainer}>

     </div>
     <div id={style.mainBodyContainer}>
     <h2 id={style.title}><b>Describe yourself briefly:</b></h2>
     <h5 id={style.subtitle}>Provide text for your about you section:</h5>
     </div>
     <div id={style.rightArrowContainer}>

     </div>
  </form>
  </>;
};

export default AboutMeForm;
