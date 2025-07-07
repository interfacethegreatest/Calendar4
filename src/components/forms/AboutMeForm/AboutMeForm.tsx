import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import style from './style.module.css';
import { motion } from 'framer-motion';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useState } from 'react';
import ModalInput from '@/components/input/ModalInput/ModalInput';
import { CiLock } from 'react-icons/ci';
import SlideButtonSubmit from '@/components/buttons/auth/slideButtonSubmit';
import { AiFillLock } from 'react-icons/ai';
import { Poppins } from 'next/font/google';
import { RiDeleteBin3Line } from "react-icons/ri";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface IAboutMeFormProps {
  AboutMe: {
    description: string,
    cv:string,
  },
}

const FormSchema = z.object({
  AboutMe: z
    .string()
    .min(1, { message: "Description is required." })
    .max(525, { message: "Too many characters." })
    .optional()
    .or(z.literal('')),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const AboutMeForm: React.FunctionComponent<IAboutMeFormProps> = (props) => {
  const { AboutMe } = props;
  const [changedSlide, setChangedSlide] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animation, setAnimation] = useState(true);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });
  const onSubmit: SubmitHandler<FormSchemaType> = async (values ) => {
    try {
        console.log(values)
    } catch (error) {
        alert("Error during submit: "+ error);
    }
  }
  const nextSlide = () => {
    const value = getValues("AboutMe")
    setChangedSlide(value?.trim().length! > 0)
    console.log(currentSlide + 1)
    setCurrentSlide((prev) => prev + 1);
  };
  const prevSlide = () => {
    const value = getValues("AboutMe")
    setChangedSlide(value?.trim().length! > 0)
    setCurrentSlide((prev) => prev - 1);
  };
  return <>
  <form id={style.innerContainer} action="" onSubmit={handleSubmit(onSubmit)}>
     <div id={style.leftArrowContainer}>
      { currentSlide != 0 && (
        <motion.div title="Slide Back" onClick={prevSlide} id={style.iconHolder}>
         <div id={style.iconStyle}><MdOutlineKeyboardArrowLeft/></div>
        </motion.div>
      )}
     </div>
     <div id={style.mainBodyContainer}>
      {
        currentSlide === 0 && (
          <>
          <h2 id={style.title} ><b>Describe yourself briefly:</b></h2>
          <h5 id={style.subtitle}>Provide text for your about you section:</h5>
          <br />
          <ModalInput
           name="AboutMe"
           label="About Me:"
           type="text"
           icon={<CiLock />}
           register={register}
           error={errors?.AboutMe?.message}
           disabled={isSubmitting}
           height={250}
           topLocation={20}
           inputLength={525} placeholder={''} 
           prevSlide={getValues}/>
          </> 
        )
      }
      {
        currentSlide === 1 && (
          <>
           <h2 id={style.title}>Upload a CV file:</h2>
           <h5 id={style.subtitle}>You can provide a CV for public view...</h5>
           <br />
           <div id={style.priorCVHolder}>
              {
                AboutMe.cv == "" && /*?*/
                <>
                 <p id={style.fileText}><b><a href={AboutMe.cv}>Your Cv.</a> Delete to upload a new copy,</b></p>
                 <button onClick={()=>alert("Clicked.")} id={style.deleteContainer}>
                  <RiDeleteBin3Line />
                 </button>
                </>
                /*:
                <>
                 <p id={style.file}>..Previously uploaded cv's will appear here..</p>
                </>*/
              }
              
           </div>
          </> 
        )
      }
      {
        currentSlide === 4 && (
          <>
           <SlideButtonSubmit
            type="submit"
            slide_text="Save your details"
            text={"Save"}
            icon={<AiFillLock />}
            width="250px"
            disabled={isSubmitting}
            animation={animation} setScene={()=> null}/>
          </> 
        )
      }
      <div id={style.slideCountContainer}>
      {Array.from({ length: currentSlide }, (_, index) => (
       <div key={index} id={style.incrementDiv}></div>
      ))}
      </div>
     </div>
     <div id={style.rightArrowContainer}>
     { currentSlide <= 3 && (
        <motion.div title="Skip / Continue" onClick={nextSlide} id={style.iconHolder}>
         <div id={style.iconStyle}><MdOutlineKeyboardArrowRight/></div>
        </motion.div>
      )}
      </div>
  </form>
  </>;
};

export default AboutMeForm;
