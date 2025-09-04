import SlideButtonSubmit from "@/components/buttons/auth/slideButtonSubmit";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AiFillLock } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import z from "zod";
import style from './style.module.css';
import { CiLock } from "react-icons/ci";
import ModalInput from "@/components/input/ModalInput/ModalInput";
import TagInput from "@/components/input/TagInput/TagInput";
import DatePicker from 'react-datepicker';
import axios from "axios";
import { toast } from "react-toastify";

const DueAtSchema = z
  .preprocess(
    (val) => (val instanceof Date ? val : val ? new Date(val as any) : undefined),
    z.date().refine((d) => d.getTime() > Date.now(), { message: "Due date must be in the future." })
  )
  .optional();

export const FormSchema = z.object({
  ProjectTitle: z
    .string()
    .min(5, { message: "Project title is required." })
    .max(45, { message: "Too many characters." }),
  ProjectDescription: z
    .string()
    .min(5, { message: "Longer project description is required." })
    .max(200, { message: "Too many characters." }),
  Tags: z
    .array(
      z.string()
        .min(1, { message: "Tag cannot be empty." })
        .max(20, { message: "Tag too long." })
    )
    .default([]),
  // Optional, but validated as future if provided
  dueAt: DueAtSchema,
});

type FormSchemaType = z.infer<typeof FormSchema>;

interface ProjectsFormProps {
  onSubmit?: (values: FormSchemaType) => void;
  closeWindow: Function;
}

const ProjectsForm: React.FC<ProjectsFormProps> = ({ onSubmit, closeWindow }) => {
  const [animation, setAnimation] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control, // ✅ needed by Controller
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ProjectTitle: "",
      ProjectDescription: "",
      Tags: [],
      dueAt: undefined,
    },
  });

  useEffect(() => {
    setValue("Tags", tags, { shouldValidate: true, shouldDirty: true });
  }, [tags, setValue]);

  const onSubmitHandler: SubmitHandler<FormSchemaType> = async (values) => {
    try {
      setValue('Tags', tags);
      alert("Form submitted: " + JSON.stringify({
        ...values,
      }));
      const { data } = await axios.post('/api/auth/uploadProjects',{
        ...values,
      });
      
      console.log("Form submitted:", values);
      toast.success(data.message);
      closeWindow();
    } catch (error) {
      alert("Error during submit: " + error);
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div
        className="div"
        id={style.openButton}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <AiOutlinePlus className={isOpen ? style.rotate : ""} id={style.buttonCross} size={28} />
      </div>
      <h5 id={style.additionalTitle}>Please provide project details below:</h5>

      {/* Conditionally rendered div */}
      {isOpen && (
        <div id={style.additionalContent}>
          <div id={style.projectTitleContainer} className="">
            <ModalInput
              name="ProjectTitle"
              label="Project Title"
              type="text"
              icon={<CiLock />}
              placeholder="Enter your project title"
              register={register}
              error={errors?.ProjectTitle?.message}
              disabled={isSubmitting}
              height={null}
              topLocation={null}
              inputLength={45}
            />
          </div>
          <br />
          <div id={style.projectDescriptionContainer}>
            <ModalInput
              name="ProjectDescription"
              label="Project description"
              type="text"
              icon={<CiLock />}
              placeholder="Enter your project title"
              register={register}
              error={errors?.ProjectDescription?.message}
              disabled={isSubmitting}
              height={105}
              topLocation={null}
              inputLength={100}
            />
          </div>
          <br />
          <div id={style.tagGeneratorContainer}>
            <TagInput
              name={"Tags"}
              label={"Tags"}
              placeholder={""}
              tags={tags}
              setTags={setTags}
              error={errors?.Tags?.message}
              disabled={isSubmitting}
              height={null}
              topLocation={null}
              inputLength={20}
              prevSlide={undefined}
              type={""}
              icon={undefined}
            />
          </div>
          <br />
          {/* You can add form fields, inputs, buttons, etc. here */}
          <div
            id={style.dueDateContainer}
          >
            <label className={style.datePickerLabel}>Due Date:</label>
            <Controller
              control={control}
              name="dueAt"
              render={({ field }) => (
                <DatePicker
                  id={style.showElement}
                  selected={field.value ?? null}
                  onChange={field.onChange}
                  showTimeSelect
                  timeIntervals={15}
                  minDate={new Date()}
                  minTime={(() => {
                    const now = new Date();
                    const v = field.value as Date | undefined;
                    const isToday =
                      v &&
                      v.getFullYear() === now.getFullYear() &&
                      v.getMonth() === now.getMonth() &&
                      v.getDate() === now.getDate();
                    if (isToday) {
                      const copy = new Date(now);
                      const m = copy.getMinutes();
                      const add = 15 - (m % 15 || 15);
                      copy.setMinutes(m + add, 0, 0);
                      return copy; // block past times today
                    }
                    return new Date(0, 0, 0, 0, 0); // allow full-day times for future dates
                  })()}
                  maxTime={new Date(0, 0, 0, 23, 59)}
                  dateFormat="MMM d, yyyy h:mm aa"
                  placeholderText="Select due date & time"
                  className={style.datePickerInput}
                  portalId='root-portal'
                />
              )}
            />
            {errors?.dueAt && (
              <p className={style.error}>
                {errors.dueAt?.message?.toString()}
              </p>
            )}
          </div>
        </div>
      )}

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
    </form>
  );
};

export default ProjectsForm;
