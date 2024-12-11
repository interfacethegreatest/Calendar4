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

interface IProfileFormProps {
  image: File | null;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const FormSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required." })
    .max(20, { message: "Username must not exceed 20 characters." }),

  description: z
    .string()
    .min(1, { message: "Description is required." })
    .max(150, { message: "Description must not exceed 150 characters." }),

  website: z
    .string()
    .url({ message: "Please submit a valid URL." })
    .optional()
    .or(z.literal('')),

  imageSchema: z.any().optional()
    .refine(file => file?.length === 1 ? ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type) : true, 'Invalid file. Choose either JPEG or PNG image.')
    .refine(file => file?.length === 1 ? file[0]?.size <= MAX_FILE_SIZE : true, 'Max file size allowed is 2MB.')
});

type FormSchemaType = z.infer<typeof FormSchema>;

const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
  try {
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('description', values.description);
    formData.append('website', values.website || '');
    
    if (values.imageSchema) {
      formData.append('imageSchema', values.imageSchema);
    }

    const { data } = await axios.post('/api/auth/uploadProfile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',  // Ensure this header is set
      },
    });
    
    // Success handling
    alert("Submit success");
  } catch (error: any) {
    // Error handling
    console.error("Error during submit:", error);
  }
}
const ProfileForm: React.FunctionComponent<IProfileFormProps> = (props) => {
  const [animation, setAnimation] = useState(true);
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      imageSchema: props.image || null,  // Initialize image field with prop or null
    },
  });

  // Use useEffect to set the image when the component is mounted or the image prop changes
  useEffect(() => {
    if (props.image) {
      setValue('imageSchema', props.image);
      console.log("Image set via setValue:", props.image);
    }
  }, [props.image, setValue]);

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
          inputLength={150} placeholder={''}        />
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
          inputLength={60} placeholder={''}        />
        <br />
        <SlideButtonSubmit
          type="submit"
          slide_text="Secure sign in"
          text={"Sign in"}
          icon={<AiFillLock />}
          width="250px"
          disabled={isSubmitting}
          animation={animation} setScene={()=> null}        />
      </form>
    </>
  );
};

export default ProfileForm;
