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
import { IoIosStar } from "react-icons/io";
import { useEdgeStore } from "@/lib/edgestore";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { UploaderProvider } from "@/components/upload/uploader-provider";
import axios from "axios";
import { toast } from "react-toastify";

export const FormSchema = z.object({
  BookTitle: z
    .string()
    .min(2, { message: "Book Title requires 2 or more characters." })
    .max(30, { message: "Too many characters. (30 max)" }),
  BookAuthor: z
    .string()
    .min(2, { message: "Book Author requires 2 or more characters." })
    .max(25, { message: "Too many characters. (25 max)" }),
  Rating: z.number().min(0).max(5).optional(),
  ImageUrl: z
    .union([z.string().url({ message: "Image must be a valid URL." }), z.literal("")])
    .default(""),
  BookDescription: z
    .string()
    .min(2, { message: "Book Description requires 2 or more characters." })
    .max(50, { message: "Too many characters. (50 max)" }),
});

type FormSchemaType = z.infer<typeof FormSchema>;

interface BookshelfFormProps {
  closeWindow: Function;
  getServerSideProps: Function;
}

const BookshelfForm: React.FC<BookshelfFormProps> = ({ closeWindow, getServerSideProps }) => {
  const { edgestore } = useEdgeStore();
  const [animation, setAnimation] = useState(true);
  const [hovered, setHovered] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: { Rating: 0, ImageUrl: "" },
  });

  /** 🧩 File selection — stores the file locally (no upload yet) */
  const handleFileSelected = (files: File[]) => {
    setImageFile(files[0] ?? null);
  };

  /** 🧠 Submit handler with deferred upload */
  const onSubmitHandler: SubmitHandler<FormSchemaType> = async (values) => {
    console.log(imageFile)
    try {
      // Upload image only during form submission
      if (imageFile) {
        const res = await edgestore.myPublicImages.upload({
          file: imageFile,
          onProgressChange: (progress) => {
            console.log("Image Upload Progress:", progress);
          },
        });
        setUploadedFileUrl(res.url);
        setValue("ImageUrl", res.url);
      }

      // Get final values including uploaded URL
      const finalValues = getValues();
      console.log("Final form values:", finalValues);

      // Example POST to your API endpoint
      const { data } = await axios.post("/api/auth/uploadBook", {
        values: finalValues,
      });

      toast.success(data.message || "Book saved successfully!");
      getServerSideProps();
      closeWindow();
    } catch (error) {
      console.error(error);
      toast.error("Error during submit.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <h5 id={style.additionalTitle}>Please provide book details below:</h5>

      <div id={style.projectTitleContainer}>
        <ModalInput
          name="BookTitle"
          label="Book Title"
          type="text"
          icon={<CiLock />}
          placeholder="Enter your book's title"
          register={register}
          error={errors?.BookTitle?.message}
          disabled={isSubmitting}
          inputLength={30}
        />
      </div>

      <div id={style.projectTitleContainer}>
        <ModalInput
          name="BookAuthor"
          label="Book Author"
          type="text"
          icon={<CiLock />}
          placeholder="Enter your book's author"
          register={register}
          error={errors?.BookAuthor?.message}
          disabled={isSubmitting}
          inputLength={30}
        />
      </div>

      <div id={style.projectTitleContainer}>
        <ModalInput
          name="BookDescription"
          label="Book Description"
          type="text"
          icon={<CiLock />}
          placeholder="Enter your book's description."
          register={register}
          error={errors?.BookDescription?.message}
          disabled={isSubmitting}
          height={45}
          inputLength={50}
        />
      </div>

      {/* 🖼️ Image uploader (deferred upload) */}
      <div id={style.visibleUpload}>
        <UploaderProvider uploadFn={() => Promise.resolve({ url: "" })} autoUpload={false}>
          <SingleImageDropzone
  height={200}
  width={200}
  dropzoneOptions={{
    maxFiles: 1,
    maxSize: 1024 * 1024 * 1,
    accept: { "image/*": [] },
  }}
  onFilesSelected={(files) => {
    setImageFile(files[0] ?? null);   // ✅ store a single File
  }}
/>
        </UploaderProvider>
      </div>

      {/* ⭐ Rating */}
      <div id={style.projectRatingContainer} onMouseLeave={() => setHovered(0)}>
        <h6 id={style.ratingTitle}>Rating :</h6>
        <Controller
          control={control}
          name="Rating"
          render={({ field }) => {
            const rating = field.value ?? 0;
            return (
              <div className={style.stars} role="radiogroup" aria-label="Book rating">
                {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => {
                  const filled = (hovered || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      className={`${style.star} ${filled ? style.filled : ""}`}
                      aria-label={`${star} star${star > 1 ? "s" : ""}`}
                      aria-checked={rating === star}
                      role="radio"
                      onMouseEnter={() => setHovered(star)}
                      onClick={() => field.onChange(star)}
                    >
                      <IoIosStar size={25} />
                    </button>
                  );
                })}
              </div>
            );
          }}
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

export default BookshelfForm;
