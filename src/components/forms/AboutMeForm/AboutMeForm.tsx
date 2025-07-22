'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { SubmitHandler, useForm, useFieldArray } from 'react-hook-form';
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
import { GrMoney } from "react-icons/gr";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

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
    .default(''),

  workExperience: z
    .array(
      z.object({
        businessName: z.string().max(30, { message: "Business name too long" }).default(''),
        jobTitle: z.string().max(30, { message: "Job title too long" }).default(''),
        startDate: z
          .string()
          .refine((val) => !val || !isNaN(new Date(val).getTime()), {
            message: "Start date must be a valid date.",
          })
          .transform((val) => (val ? new Date(val) : null)),
        endDate: z
          .string()
          .refine((val) => !val || !isNaN(new Date(val).getTime()), {
            message: "End date must be a valid date.",
          })
          .transform((val) => (val ? new Date(val) : null)),
        jobDescription: z.string().max(1000, { message: "Job description too long" }).default(''),
      }).refine(
        (data) =>
          !data.startDate ||
          !data.endDate ||
          new Date(data.startDate) <= new Date(data.endDate),
        {
          message: "Start date must be before end date.",
          path: ["endDate"],
        }
      )
    )
    .min(1, { message: "At least one work experience is required." })
    .default([
      {
        businessName: '',
        jobTitle: '',
        startDate: '', // <-- use string, not null
        endDate: '',   // <-- use string, not null
        jobDescription: '',
      },
    ]),
});

type FormSchemaType = z.infer<typeof FormSchema>;

interface IAboutMeFormProps {
  AboutMe: {
    description: string;
    cv: string;
  };
}

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
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      AboutMe: AboutMe.description || '',
      CV: AboutMe.cv || '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperience",
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    try {
      console.log(values);
    } catch (error) {
      alert("Error during submit: " + error);
    }
  };

  function uploadFn({
    file,
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
    <form id={style.innerContainer} onSubmit={handleSubmit(onSubmit)}>
      <div id={style.leftArrowContainer}>
        {currentSlide !== 0 && (
          <motion.div title="Slide Back" onClick={prevSlide} id={style.iconHolder}>
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
            <h2 id={style.title}><b>Upload a CV file:</b></h2>
            <h5 id={style.subtitle}>You can provide a CV for public view...</h5>
            <div id={style.priorCVHolder}>
              {AboutMe.cv === "" && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <br /><br /><br /><br /><br /><br />
                  {uploadedFileUrl && (
                    <>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <p id={style.fileText}>
                          <b>
                            <a href={uploadedFileUrl} target="_blank">Your CV</a> — Delete to upload a new one.
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
                  <UploaderProvider uploadFn={uploadFn} autoUpload key={uploaderKey}>
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
              )}
            </div>
          </>
        )}

        {currentSlide === 2 && (
          <>
            <h2 id={style.title}>Upload transcripts:</h2>
            <h5 id={style.subtitle}>(Optional) You can also provide transcripts for public view...</h5>
            <p style={{ textAlign: "center", color: "aliceblue" }}>
              Transcripts are text or PDF files which are relevant notes to you.
            </p>
            <div id={style.visibleUpload}>
              <div className={style.uploadScrollArea}>
                <UploaderProvider uploadFn={uploadFn} autoUpload>
                  <FileUploader
                    maxFiles={5}
                    maxSize={1024 * 1024 * 1}
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
            <h2 id={style.title}>Work Experience:</h2>
            <h5 id={style.subtitle}>(Optional) Please provide past work experience:</h5>
            <br />
            <div id={style.extender} className={style.uploadScrollArea}>
              {fields.map((field, index) => (
                <div key={field.id} className={style.experienceItem}>
                  <ModalInput
                    name={`workExperience.${index}.businessName`}
                    label="Business"
                    type="text"
                    icon={<GrMoney />}
                    placeholder=""
                    register={register}
                    error={errors?.workExperience?.[index]?.businessName?.message}
                    disabled={isSubmitting}
                    height={null}
                    topLocation={null}
                    inputLength={30}
                  />
                  <br />
                  <ModalInput
                    name={`workExperience.${index}.jobTitle`}
                    label="Job Title"
                    type="text"
                    icon={<CiLock />}
                    placeholder=""
                    register={register}
                    error={errors?.workExperience?.[index]?.jobTitle?.message}
                    disabled={isSubmitting}
                    height={null}
                    topLocation={null}
                    inputLength={30}
                  />
                  <br />
                

                  <ModalInput
                    name={`workExperience.${index}.jobDescription`}
                    label="Job Description"
                    type="text"
                    icon={<CiLock />}
                    placeholder=""
                    register={register}
                    error={errors?.workExperience?.[index]?.jobDescription?.message}
                    disabled={isSubmitting}
                    height={90}
                    topLocation={null}
                    inputLength={1000}
                  />
                  <br />

                  <div className={style.datePickerRow}>
                <div style={{border:"1px solid rgb(106, 106, 106)", borderRadius:"6px", paddingLeft:"6px"}} id={style.datePickerInput}>
                  <label className={style.datePickerLabel}>Start Date :</label>
                  <input
                    type="month"
                    {...register(`workExperience.${index}.startDate`)}
                    className={style.datePickerInput}
                    placeholder="MM/YYYY"
                  />
                  {errors?.workExperience?.[index]?.startDate && (
                    <p className={style.error}>{errors.workExperience[index].startDate?.message?.toString()}</p>
                  )}
                </div>
                <br />

                <div style={{border:"1px solid rgb(106, 106, 106)", borderRadius:"6px", paddingLeft:"6px"}}>
                  <label className={style.datePickerLabel}>End Date</label>
                  <input
                    type="month"
                    {...register(`workExperience.${index}.endDate`)}
                    className={style.datePickerInput}
                    placeholder="MM/YYYY"
                  />
                  {errors?.workExperience?.[index]?.endDate && (
                    <p className={style.error}>{errors.workExperience[index].endDate?.message?.toString()}</p>
                  )}
                </div>
              </div>

                  <br />

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className={style.deleteExperienceBtn}
                  >
                    <RiDeleteBin3Line />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  append({
                    businessName: '',
                    jobTitle: '',
                    startDate: null,
                    endDate: null,
                    jobDescription: '',
                  })
                }
                className={style.addExperienceBtn}
              >
                + Add Experience
              </button>
            </div>
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
  );
};

export default AboutMeForm;
