'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { SubmitHandler, useForm, useFieldArray } from 'react-hook-form';
import { array, z } from 'zod';
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
import { GoPlusCircle } from "react-icons/go";
import { Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { Files } from 'lucide-react';

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const FormSchema = z.object({
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

  Transcripts: z
    .array(
      z.string().url({ message: "Each transcript must be a valid URL." })
    )
    .max(5, { message: "You can upload up to 5 transcripts." })
    .optional()
    .default([]),

    workExperience: z
  .array(
    z.object({
      businessName: z.string().max(30).default(''),
      jobTitle: z.string().max(30).default(''),
      startDate: z.date().nullable(),
      endDate: z.date().nullable(),
      jobDescription: z.string().max(1000).default(''),
    }).refine(
      (data) =>
        data.startDate === null ||
        data.endDate === null ||
        data.startDate <= data.endDate,
      {
        message: "Start date must be before end date.",
        path: ["endDate"],
      }
    )
  ).default([
    {
      businessName: '',
      jobTitle: '',
      startDate: null,
      endDate: null,
      jobDescription: '',
    },
    ]),
  educationalBackground: z
    .array(
      z.object({
        startDate: z.date().nullable(),
        endDate: z.date().nullable(),
        educationalInstitudtion: z
          .string()
          .max(75, { message: "Educational institution name too long." })
          .default(''),
        qualificationTitle: z
          .string()
          .max(75, { message: "Qualification title too long." })
          .default(''),
      }).refine(
        (data) =>
          data.startDate === null ||
          data.endDate === null ||
          data.startDate <= data.endDate,
        {
          message: "Start date must be before end date.",
          path: ["endDate"],
        }
      )
    )
    /*.min(1, {
      message: "At least one instance of educational background is required.",
    })*/
    .default([
      {
        startDate: null,
        endDate: null,
        educationalInstitudtion: '',
        qualificationTitle: '',
      },
    ]),
});

type FormSchemaType = z.infer<typeof FormSchema>;

interface IAboutMeFormProps {
  AboutMe: {
    description: string;
    cv: string;
  };
  closeWindow:Function;
}

const AboutMeForm: React.FC<IAboutMeFormProps> = ({ AboutMe, closeWindow }) => {
  const [uploaderKey, setUploaderKey] = useState(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(AboutMe.cv || null);
  const { edgestore } = useEdgeStore();
  const [changedSlide, setChangedSlide] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animation, setAnimation] = useState(true);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [transcripts, setTranscripts] = React.useState<File[]>([]);
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


  const handleFilesSelected = (files: File[]) => {
    setCvFile(files[0]);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperience",
  });

  const {
    fields: educationalBackgroundFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "educationalBackground",
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
  try {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    // Upload CV if present
    const uploadCv = async () => {
      if (!cvFile) return;

      const res = await edgestore.cvBucket.upload({
        file: cvFile,
        onProgressChange: (progress) => {
          console.log('CV Upload Progress:', progress);
        },
      });

      setValue('CV', res.url); // Save uploaded CV URL
    };

    // Upload all valid transcript files
    const uploadTranscripts = async () => {
      if (!transcripts || transcripts.length === 0) return;

      const uploadedUrls: string[] = [];

      for (const file of transcripts) {
        if (!allowedTypes.includes(file.type)) {
          console.warn(`Skipping unsupported file: ${file.name}`);
          continue;
        }

        const res = await edgestore.cvBucket.upload({
          file,
          onProgressChange: (progress) => {
            console.log(`Transcript "${file.name}" upload progress:`, progress);
          },
        });

        uploadedUrls.push(res.url);
      }

      setValue('Transcripts', uploadedUrls); // Save uploaded URLs
    };

    // Perform uploads
    await uploadCv();
    await uploadTranscripts();

    // Get updated form values with uploaded URLs
    const updatedValues = getValues();
    console.log('Final form values:', updatedValues);

    alert('Submission complete!');
    closeWindow();
  } catch (error) {
    alert('Error during submit: ' + error);
    console.error(error);
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
    <div className={style["spacer-sm"]}></div>
    <h5 id={style.subtitle}>You can provide a CV for public view...</h5>
    <p style={{ textAlign: "center", color: "aliceblue" }}>
            A CV allows users to access your previous work history and gauge your understanding of topics (.pdf or .docx).
    </p>
    <div className={style["spacer-lg"]}></div>
    <div id={style.priorCVHolder}>
      {AboutMe.cv === "" && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className={style.spacer}></div>

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
              <div className={style.spacer}></div>
            </>
          )}

          <div className={style.spacer}></div>

          

          <div id={style.visibleUpload}>
            <UploaderProvider uploadFn={uploadFn} autoUpload key={uploaderKey}>
              <Dropzone          
                style={{ width: "100%" }}
                dropzoneOptions={{
                  maxFiles: 1,
                  maxSize: 1024 * 1024 * 2,
                  accept: {
                    "application/pdf": [".pdf"],
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
                  },
                }}
                onFilesSelected={(Files) =>{
                  setCvFile(Files[0] ?? null);
                }}
              />
            </UploaderProvider>
          </div>
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
                      "application/pdf": [".pdf"],
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
                    }}
                    onFilesSelected={(files) => {
                     setTranscripts(files); // store all selected files
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
            <div
              style={{
                border: '1px solid rgb(106, 106, 106)',
                borderRadius: '6px',
                paddingLeft: '6px',
              }}
              id={style.datePickerInput}
            >
              <label className={style.datePickerLabel}>Start Date:</label>
              <Controller
                control={control}
                name={`workExperience.${index}.startDate`}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    showFullMonthYearPicker
                    placeholderText="MM/YYYY"
                    className={style.datePickerInput}
                  />
                )}
              />
              {errors?.workExperience?.[index]?.startDate && (
                <p className={style.error}>
                  {errors.workExperience[index].startDate?.message?.toString()}
                </p>
              )}
            </div>
            <br />
            <div
              style={{
                border: '1px solid rgb(106, 106, 106)',
                borderRadius: '6px',
                paddingLeft: '6px',
              }}
            >
              <label className={style.datePickerLabel}>End Date:</label>
              <Controller
                control={control}
                name={`workExperience.${index}.endDate`}
                render={({ field }) => (
                  <DatePicker
                    id={style.showElement}
                    selected={field.value}
                    onChange={field.onChange}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    showFullMonthYearPicker
                    placeholderText="MM/YYYY"
                    className={style.datePickerInput}
                    portalId='root-portal'
                    
                  />
                )}
              />
              {errors?.workExperience?.[index]?.endDate && (
                <p className={style.error}>
                  {errors.workExperience[index].endDate?.message?.toString()}
                </p>
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
        style={{ display: 'flex', marginRight: '5px' }}
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
        <GoPlusCircle style={{ marginTop: '5px', marginRight: '5px' }} />
        Add Experience
      </button>
    </div>
  </>
)}


{currentSlide === 4 && (
  <>
    <h2 id={style.title}>Please provide your educational background:</h2>
    <h5 id={style.subtitle}>
      (Optional) Your educational background allows others to understand your studies.
    </h5>
    <p style={{ color: "aliceblue", textAlign: "center" }}>
      Please provide correct educational information.
    </p>
    <div id={style.extenderSecond} className={style.uploadScrollArea}>
      {educationalBackgroundFields.map((field, index) => (
        <div key={field.id} className={style.experienceItem}>
          <ModalInput
            name={`educationalBackground.${index}.educationalInstitudtion`}
            label="Institution"
            type="text"
            icon={<CiLock />}
            placeholder="University or School Name"
            register={register}
            error={
              errors?.educationalBackground?.[index]?.educationalInstitudtion?.message
            }
            disabled={isSubmitting}
            height={null}
            topLocation={null}
            inputLength={75}
          />
          <br />
          <br />
          <ModalInput
            name={`educationalBackground.${index}.qualificationTitle`}
            label="Qualification"
            type="text"
            icon={<CiLock />}
            placeholder="Degree or Certification"
            register={register}
            error={
              errors?.educationalBackground?.[index]?.qualificationTitle?.message
            }
            disabled={isSubmitting}
            height={null}
            topLocation={null}
            inputLength={75}
          />
          <br />
          <div className={style.datePickerRow}>
            <div className={style.datePickerField}>
              <label className={style.datePickerLabel}>Start Date:</label>
              <Controller
                control={control}
                name={`educationalBackground.${index}.startDate`}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    placeholderText="MM/YYYY"
                    className={style.datePickerInput}
                    portalId='root-portal'
                  />
                )}
              />
              {errors?.educationalBackground?.[index]?.startDate && (
                <p className={style.error}>
                  {errors.educationalBackground[index].startDate?.message?.toString()}
                </p>
              )}
            </div>

            <div className={style.datePickerField}>
              <label className={style.datePickerLabel}>End Date:</label>
              <Controller
                control={control}
                name={`educationalBackground.${index}.endDate`}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    placeholderText="MM/YYYY"
                    className={style.datePickerInput}
                    portalId='root-portal'
                  />
                )}
              />
              {errors?.educationalBackground?.[index]?.endDate && (
                <p className={style.error}>
                  {errors.educationalBackground[index].endDate?.message?.toString()}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => removeEducation(index)}
            className={style.deleteExperienceBtn}
          >
            <RiDeleteBin3Line />
          </button>
        </div>
      ))}

      <button
        style={{ display: 'flex', marginRight: '5px' }}
        type="button"
        onClick={() =>
          appendEducation({
            educationalInstitudtion: '',
            qualificationTitle: '',
            startDate: null,
            endDate: null,
          })
        }
        className={style.addExperienceBtn}
      >
        <GoPlusCircle style={{ marginTop: '5px', marginRight: '5px' }} />
        Add Education
      </button>
    </div>

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
  </>
)}

        <div id={style.slideCountContainer}>
          {Array.from({ length: currentSlide }).map((_, index) => (
            <div key={index} id={style.incrementDiv}></div>
          ))}
        </div>
      </div>

      <div id={style.rightArrowContainer}>
        {currentSlide <= 3 && (
          <>
          <motion.div
            title="Skip / Continue"
            onClick={nextSlide}
            id={style.iconHolder}
          >
            <div id={style.iconStyle}>
              <MdOutlineKeyboardArrowRight />
            </div>
          </motion.div>
          </>
        )}
      </div>
    </form>
  );
};

export default AboutMeForm;
