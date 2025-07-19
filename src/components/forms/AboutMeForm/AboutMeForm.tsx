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
import { UploaderProvider } from '@/components/upload/uploader-provider';
import { useEdgeStore } from '@/lib/edgestore';
import { Dropzone } from '@/components/upload/dropzone';
import { toast } from 'react-toastify';
import { FileUploader } from '@/components/upload/multiFile';

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface IAboutMeFormProps {
  AboutMe: {
    description: string;
    cv: string;
  };
}

const FormSchema = z.object({
  AboutMe: z
    .string()
    .max(525, { message: "Too many characters." })
    .optional()
    .or(z.literal('')),

  CV: z
    .union([
      z.string().url({ message: "CV must be a valid URL." }),
      z.literal(''),
    ])
    .default(''), // Ensures `""` if nothing is passed
});

type FormSchemaType = z.infer<typeof FormSchema>;

const AboutMeForm: React.FC<IAboutMeFormProps> = ({ AboutMe }) => {
  const [uploaderKey, setUploaderKey] = useState(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(AboutMe.cv || null);
  const { edgestore } = useEdgeStore();
  const [changedSlide, setChangedSlide] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animation, setAnimation] = useState(true);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  function uploadFn({
    file,
    signal,
  }: {
    file: File;
    signal: AbortSignal;
    onProgressChange: (progress: number) => void;
  }): Promise<{ url: string }> {
    return edgestore.cvBucket.upload({ file }).then((res) => {
      setUploadedFileUrl(res.url);
      return res;
    });
  }

  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    try {
      console.log(values);
    } catch (error) {
      alert("Error during submit: " + error);
    }
  };

  const nextSlide = () => {
    const value = getValues("AboutMe");
    setChangedSlide(value?.trim().length! > 0);
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    const value = getValues("AboutMe");
    setChangedSlide(value?.trim().length! > 0);
    setCurrentSlide((prev) => prev - 1);
  };

  return (
    <>
      <form
        id={style.innerContainer}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div id={style.leftArrowContainer}>
          {currentSlide !== 0 && (
            <motion.div
              title="Slide Back"
              onClick={prevSlide}
              id={style.iconHolder}
            >
              <div id={style.iconStyle}>
                <MdOutlineKeyboardArrowLeft />
              </div>
            </motion.div>
          )}
        </div>

        <div id={style.mainBodyContainer}>
          {currentSlide === 0 && (
            <>
              <h2 id={style.title}><b>Describe yourself briefly:</b></h2>
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
                inputLength={525}
                placeholder=""
                prevSlide={getValues}
              />
            </>
          )}

          {currentSlide === 1 && (
            <>
              <h2 id={style.title}>Upload a CV file:</h2>
              <h5 id={style.subtitle}>You can provide a CV for public view...</h5>
              <br /><br />
              <div id={style.priorCVHolder}>
                {AboutMe.cv === "" && (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <br /><br /><br /><br /><br />
                    {uploadedFileUrl && (
                      <>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <p id={style.fileText}>
                            <b>
                              <a href={AboutMe.cv}>Your Cv.</a> Delete to upload a new copy,
                            </b>
                          </p>
                          <button
                            id={style.deleteContainer}
                            onClick={async (e) => {
                              e.preventDefault();
                              try {
                                await edgestore.cvBucket.delete({ url: uploadedFileUrl });
                                setUploadedFileUrl(null);
                                setUploaderKey((prev) => prev + 1);
                                toast.success("CV deleted.");
                              } catch (error) {
                                console.log(error);
                                alert("Error deleting file.");
                              }
                            }}
                          >
                            <RiDeleteBin3Line />
                          </button>
                        </div>
                        <br />
                      </>
                    )}
                    <p style={{textAlign:"center", color:"aliceblue"}}>Uploading a CV provides users with a detailed view of who you are and your previous job history and experience.</p>
                    <div id={style.visibleUpload}>
                      <UploaderProvider
                        uploadFn={uploadFn}
                        autoUpload
                        key={uploaderKey}
                      >
                        <Dropzone
                          dropzoneOptions={{
                            maxFiles: 1,
                            maxSize: 1024 * 1024 * 2,
                            accept: {
                              "application/pdf": [".pdf"],
                              "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
                            },
                          }}
                        />
                      </UploaderProvider>
                    </div>
                    <p style={{textAlign:"center", color:"aliceblue"}}>Thank You!</p>
                  </div>
                )}
              </div>
            </>
          )}

          {currentSlide === 2 && (
            <>
            <h2 id={style.title}>Upload transcripts:</h2>
            <h5 id={style.subtitle}>(Optional) You can also provide transcripts for public view...</h5>
            <br />
            <p style={{textAlign:"center", color:"aliceblue"}}>Transcripts are text or pdf files which are relevant notes to you.</p>
            <div id={style.visibleUpload}>
              <div className={style.uploadScrollArea}>
            <UploaderProvider uploadFn={uploadFn} autoUpload>
              <FileUploader
               maxFiles={5}
               maxSize={1024 * 1024 * 1} // 1 MB
               accept={{
               'application/pdf': [],
               'text/plain': ['.txt'],
               }}
              />
            </UploaderProvider>
            </div>
            </div>
            </>
          )}

          {currentSlide === 3 && (
            <>
             <h1>Hello World</h1>
            </>
          )}


          {currentSlide === 4 && (
            <SlideButtonSubmit
              type="submit"
              slide_text="Save your details"
              text="Save"
              icon={<AiFillLock />}
              width="250px"
              disabled={isSubmitting}
              animation={animation}
              setScene={() => null}
            />
          )}

          <div id={style.slideCountContainer}>
            {Array.from({ length: currentSlide }).map((_, index) => (
              <div key={index} id={style.incrementDiv}></div>
            ))}
          </div>
        </div>

        <div id={style.rightArrowContainer}>
          {currentSlide <= 3 && (
            <motion.div
              title="Skip / Continue"
              onClick={nextSlide}
              id={style.iconHolder}
            >
              <div id={style.iconStyle}>
                <MdOutlineKeyboardArrowRight />
              </div>
            </motion.div>
          )}
        </div>
      </form>
    </>
  );
};

export default AboutMeForm;
