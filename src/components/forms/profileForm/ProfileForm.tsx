import { useEffect } from 'react';
import ModalInput from '@/components/input/ModalInput/ModalInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiFillLock } from 'react-icons/ai';
import { CiLock, CiMail } from 'react-icons/ci';
import SlideButtonSubmit from '@/components/buttons/auth/slideButtonSubmit';
import { z } from 'zod';
import styles from './tiltStyles.module.css';
import { Poppins } from 'next/font/google';
import axios from 'axios';
import { useEdgeStore } from '@/lib/edgestore';
import { toast } from 'react-toastify';

interface IProfileFormProps {
  image: File | null;
  imageString : Function, 
  username: Function,
  description: Function,
  website: Function,
  closeWindow: Function,
  userData: any,
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});
//accepted front end image constraints
const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];
//formSchema with frontend trimming of data
const FormSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required." })
    .max(20, { message: "Username must not exceed 20 characters." }),

  description: z
    .string()
    .min(1, { message: "Description is required." })
    .max(150, { message: "Description must not exceed 150 characters." }),
   // optional schema.
  website: z
    .string()
    .url({ message: "Please submit a valid URL." })
    .optional()
    .or(z.literal('')),

  imageSchema: z
    .string()
    .url({ message: "Please submit a valid URL." })
    .optional()
    .or(z.literal('')),
});

type FormSchemaType = z.infer<typeof FormSchema>;


const ProfileForm: React.FunctionComponent<IProfileFormProps> = (props) => {
  const onSubmit: SubmitHandler<FormSchemaType> = async (values ) => {
    // handle onsubmit functrion
    try {
      // Success handling
  
      const { data } = await axios.post('/api/auth/uploadProfile',{
        ...values,
      });
      //window.location.reload();
      // set the user pages' object for a fast update instead of above refresh.
      props.username(values.username);
      if ( values.imageSchema ) {
        props.imageString(values.imageSchema);
      };
      props.description(values.description);
      props.website(values.website);
      toast.success(`${data.message}: changes`);
      setTimeout(props.closeWindow(), 3000);
    } catch (error: any) {
      // Error handling
      alert("Error during submit: "+ error);
    }
  }
  const [animation, setAnimation] = useState(true);
  const { edgestore } = useEdgeStore()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });
  const { image } = props ;

  // Use useEffect to set the image when the component is mounted or the image prop changes
  useEffect(() => {
    const uploadImage = async () => {
      //if an image has been uploaded....
      if (image) {
        try {
          const res = await edgestore.myPublicImages.upload({
            file: image, // Ensure `file` is the actual image file
            onProgressChange: (progress) => {
              console.log(progress);
            },
          });
          setValue('imageSchema', res.url); // Set the uploaded image URL
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }else{
        return;
      }
    };
  
    uploadImage(); // Call the function
  }, [image, setValue]);
  

  return (
    <>
      <h1 id={styles.modalTitle} className={font.className}>
        <b>Please Complete Your Bio</b>
      </h1>
      <p id={styles.innerText} className={font.className}>
        ..Fill out all the relative information. Then submit.
      </p>
      <br />
      <form id={styles.formStyle} onSubmit={handleSubmit(onSubmit)}>
        <ModalInput
          name="username"
          label="Username"
          type="text"
          icon={<CiMail />}
          register={register}
          error={errors?.username?.message}
          disabled={isSubmitting}
          height={null}
          topLocation={null}
          inputLength={20} placeholder={''}/>
        <br />
        <ModalInput
          name="description"
          label="Description"
          type="text"
          icon={<CiLock />}
          register={register}
          error={errors?.description?.message}
          disabled={isSubmitting}
          height={150}
          topLocation={20}
          inputLength={150} placeholder={''}/>
        <br />
        <ModalInput
          name="website"
          label="Website URL (optional)"
          type="text"
          icon={<CiMail />}
          register={register}
          error={errors?.website?.message}
          disabled={isSubmitting}
          height={null}
          topLocation={null}
          inputLength={60} placeholder={''}/>
        <br />
        <SlideButtonSubmit
          type="submit"
          slide_text="Save your details"
          text={"Save"}
          icon={<AiFillLock />}
          width="250px"
          disabled={isSubmitting}
          animation={animation} setScene={()=> null}/>
      </form>
    </>
  );
};

export default ProfileForm;
