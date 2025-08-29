import SlideButtonSubmit from "@/components/buttons/auth/slideButtonSubmit";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiFillLock } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import z from "zod";
import style from './style.module.css';
import { CiLock } from "react-icons/ci";
import ModalInput from "@/components/input/ModalInput/ModalInput";

export const FormSchema = z.object({
  ProjectTitle: z
    .string()
    .min(5, { message: "Project title is required." }) // cannot be empty
    .max(45, { message: "Too many characters." }),
  ProjectDescription: z
  .string()
  .min(5, {message: "Longer project description is required."})
  .max(100, {message: "Too many characters."})
});


type FormSchemaType = z.infer<typeof FormSchema>;

interface ProjectsFormProps {
  onSubmit?: (values: FormSchemaType) => void;
}

const ProjectsForm: React.FC<ProjectsFormProps> = ({ onSubmit }) => {
  const [animation, setAnimation] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmitHandler: SubmitHandler<FormSchemaType> = async (values) => {
    try {
      alert("Form submitted: " + JSON.stringify(values));
      console.log("Form submitted:", values);
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
      onClick={() => setIsOpen((prev) => !prev)} // toggle isOpen
      >
      <AiOutlinePlus className={isOpen ? style.rotate : ""} id={style.buttonCross} size={28}/>
     </div>
     <h5 id={style.additionalTitle}>Please provide project details below:</h5>
     {/* Conditionally rendered div */}
     {isOpen && (
      <div id={style.additionalContent}>
      <div id={style.projectTitleContainer} className="">
       <ModalInput
        name="ProjectTitle" // match your Zod schema field
        label="Project Title"
        type="text"
        icon={<CiLock />}
        placeholder="Enter your project title"
        register={register}
        error={errors?.ProjectTitle?.message} // use the schema error
        disabled={isSubmitting}
        height={null}
        topLocation={null}
        inputLength={45} // max length matches your schema
       />
      </div>
      <br />
      <div id={style.projectDescriptionContainer}>
       <ModalInput
        name="ProjectDescription" // match your Zod schema field
        label="Project description"
        type="text"
        icon={<CiLock />}
        placeholder="Enter your project title"
        register={register}
        error={errors?.ProjectDescription?.message} // use the schema error
        disabled={isSubmitting}
        height={75}
        topLocation={null}
        inputLength={100} // max length matches your schema
       />
      </div>
      {/* You can add form fields, inputs, buttons, etc. here */}
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
