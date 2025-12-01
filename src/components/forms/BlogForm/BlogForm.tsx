'use client';

import SlideButtonSubmit from "@/components/buttons/auth/slideButtonSubmit";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AiFillLock } from "react-icons/ai";
import z from "zod";
import style from "./style.module.css";
import { CiLock } from "react-icons/ci";
import ModalInput from "@/components/input/ModalInput/ModalInput";
import { toast } from "react-toastify";
import axios from "axios";

export const FormSchema = z.object({
  BlogTitle: z
    .string()
    .min(2, { message: "Book Title requires 2 or more characters." })
    .max(30, { message: "Too many characters. (30 max)" }),
  BlogDescription: z
    .string()
    .min(2, { message: "Book Description requires 2 or more characters." })
    .max(50, { message: "Too many characters. (50 max)" }),
});

type FormSchemaType = z.infer<typeof FormSchema>;

interface BlogFormProps {
  closeWindow: Function;
  getServerSideProps: Function;
}

const BlogForm: React.FC<BlogFormProps> = ({ closeWindow, getServerSideProps }) => {
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
  });

  /** 🧠 Submit handler with deferred upload */
  const onSubmitHandler: SubmitHandler<FormSchemaType> = async (values) => {
    try {
      // Get final values including uploaded URL
      const finalValues = getValues();
      console.log("Final form values:", finalValues);

      // Example POST to your API endpoint
      const { data } = await axios.post("/api/auth/uploadBlog", {
        values: finalValues,
      });

      toast.success(data.message || "Blog saved successfully!");
      getServerSideProps(true);
      closeWindow();
    } catch (error) {
      console.error(error);
      toast.error("Error during submit.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <h5 id={style.additionalTitle}>Please provide blog details below:</h5>

      <div id={style.projectTitleContainer}>
        <ModalInput
          name="BlogTitle"
          label="Blog Title"
          type="text"
          icon={<CiLock />}
          placeholder="Enter your book's title"
          register={register}
          error={errors?.BlogTitle?.message}
          disabled={isSubmitting}
          inputLength={30}
        />
      </div>

      <div id={style.projectTitleContainer}>
        <ModalInput
          name="BlogDescription"
          label="Blog Description"
          type="text"
          icon={<CiLock />}
          placeholder="Enter your book's description."
          register={register}
          error={errors?.BlogDescription?.message}
          disabled={isSubmitting}
          height={300}
          inputLength={500}
        />
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
    </form>
  );
};

export default BlogForm;
