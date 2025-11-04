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
import { UploaderProvider } from "@/components/upload/uploader-provider";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import Dropzone from "react-dropzone";

export const FormSchema = z.object({
  BookTitle: z.string().min(2, { message: "Book Title requires 2 or more characters." }).max(30, { message: "Too many characters. ( 30max )" }),
  BookAuthor: z.string().min(2, { message: "Book Author requires 2 or more characters." }).max(25, { message: "Too many characters. ( 30max )" }),
  Rating: z.number().min(0).max(5).optional(),
  ImageUrl: z.union([z.string().url({ message: "Image must be a valid URL." }), z.literal("")]).default(""),
});

type FormSchemaType = z.infer<typeof FormSchema>;

interface BookshelfFormProps {
  closeWindow: Function;
  getServerSideProps: Function;
}

const BookshelfForm: React.FC<BookshelfFormProps> = ({ closeWindow }) => {
  const { edgestore } = useEdgeStore();
  const [uploaderKey, setUploaderKey] = useState(0);
  const [animation, setAnimation] = useState(true);
  const [hovered, setHovered] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: { Rating: 0, ImageUrl: "" },
  });

  // IMPORTANT: correct signature; don't rely on outer imageFile
  // (With autoUpload=false this won't run, but keeping the signature correct avoids surprises.)
  const uploadFn = async (file: File) => {
    const res = await edgestore.myPublicImages.upload({
      file,
      onProgressChange: (progress) => console.log("Image Upload Progress:", progress),
    });
    // If you ever flip autoUpload to true, this will populate the form:
    setValue("ImageUrl", res.url, { shouldDirty: true, shouldTouch: true });
    return { url: res.url };
  };

  const onSubmitHandler: SubmitHandler<FormSchemaType> = async (values) => {
    try {
      let uploadedImageUrl: string | null = null;

      // Defer upload until submit
      if (imageFile) {
        const res = await edgestore.myPublicImages.upload({
          file: imageFile,
          onProgressChange: (progress) => console.log("Image Upload Progress:", progress),
        });
        uploadedImageUrl = res.url;
        setValue("ImageUrl", uploadedImageUrl); // sync RHF state
      }

      const payload = {
        ...values,
        ...(uploadedImageUrl ? { ImageUrl: uploadedImageUrl } : {}),
      };

      alert("Form submitted: " + JSON.stringify(payload));
      // await axios.post('/api/auth/uploadProjects', payload);
      closeWindow();
    } catch (error) {
      alert("Error during submit: " + (error as Error)?.message);
      console.error(error);
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
          height={null}
          topLocation={null}
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
          height={null}
          topLocation={null}
          inputLength={30}
        />
      </div>

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
            onFilesSelected={(files: any[]) => {
              setImageFile(files[0] ?? null);
            }}
          />
        </UploaderProvider>
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
