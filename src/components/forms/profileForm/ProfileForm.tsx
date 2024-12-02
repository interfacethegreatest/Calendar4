import SlideButton from '@/components/buttons/auth/slideButton';
import GetProfileBio from '@/components/modals/tiltModal/modalComponents/GetProfileBio';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { ReactNode, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineLogin } from 'react-icons/ai';
import { z } from 'zod';

interface IAppProps {
}

const FormSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .max(20, { message: "Username must not exceed 20 characters" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(150, { message: "Description must not exceed 150 characters" }),
  website: z
    .string()
    .max(20, { message: "Website must not exceed 20 characters" }) // Apply max constraint
    .url({ message: "Please enter a valid URL" }) // Validate URL format
    .optional(), // Make the field optional
});

type FormSchemaType = z.infer<typeof FormSchema>;

const onSubmit: SubmitHandler<FormSchemaType>=async(values)=>{
  try {
    //success text
    
  } catch (error : any) {
    //error text
  }
}

const App: React.FunctionComponent<IAppProps> = (props) => {
  
  const {
    register,
    handleSubmit,
    watch,
    formState : { errors, isSubmitting}
   } = useForm<FormSchemaType>({
     resolver: zodResolver(FormSchema)
   });
  
  return (
    <>
    <form method="post" action="/api/auth/signin/email" onSubmit={handleSubmit(onSubmit)}>
      <GetProfileBio register={register} watch={watch}/>
      <SlideButton
       type="modalSave"
       text="Save!"
       slide_text="Save your bio,"
       icon={<AiOutlineLogin />}
       disabled={isSubmitting}
       width="250px"
       animation={null}
       setScene={null}
       />
    </form>
    </>
  );
};

export default App;
