import * as React from 'react';
import style from './aboutMeStyles.module.css';
import GenerateModal from '@/components/buttons/generateModal/generateModal';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

interface IAboutMeProps {
}

const FormSchema = z.object({
    AboutMe: z.string()
        .min(5, "Must be at least 5 characters.")
        .max(750, "Must be less than 750 characters."),
    Transcript: z.array(z.object({
        name: z.string().min(2, "Name is required").max(12, "Must be 12 or less characters."),
        url: z.string().url("Invalid URL format")
    })).min(1, "At least one link is required")
      .max(10, "You can provide up to 10 links."),
    Documents: z.array(z.object({
        name: z.string().min(2, "Name is required").max(12, "Must be 12 or less characters."),
        url: z.string().url("Invalid URL format")
    })).min(1, "At least one link is required"),
    WorkExperience: z.array(z.object({
        Buisness: z.string().min(5, "Name is required at 5 or more.").max(26, "Must be 26 or less characters."),
        JobRole: z.string().min(5, "Name is required at 5 or more.").max(26, "Must be 26 or less characters."),
        JoinedFrom: z.date({
         required_error: "Date is required",
         invalid_type_error: "Invalid date format"
        }),
        JoinedTo: z.date({
         required_error: "Date is required",
         invalid_type_error: "Invalid date format"
        })
    })).min(1, "At least one link is required"),
    Education: z.array(z.object({
        School: z.string().min(8, "Name is required at 15 or more.").max(36, "Must be 26 or less characters."),
        JoinedFrom: z.date({
         required_error: "Date is required",
         invalid_type_error: "Invalid date format"
        }),
        JoinedTo: z.date({
         required_error: "Date is required",
         invalid_type_error: "Invalid date format"
        })
    })).min(1, "At least one link is required"),
});
type FormSchemaType=z.infer<typeof FormSchema>;

const AboutMe: React.FunctionComponent<IAboutMeProps> = (props) => {
  const [documentData, setDocumentData] = React.useState(null);
  const {
    register,
    handleSubmit, 
    watch, 
    reset,
    formState : { errors, isSubmitting}
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema)
  })
  const onSubmit: SubmitHandler<FormSchemaType>=async(values)=>{
    try {
        //const { data } = await axios.post('/')
    } catch (error) {
        
    }
  }
  return<>
  <div id={style.about}>
  <div id={style.inner}>
  <div><h3><u>About me</u></h3><GenerateModal fields={'Edit Documents'} register={register} onSubmit={onSubmit} handleSubmit={handleSubmit} errors={errors}></GenerateModal></div>
  <br />
  <p style={{color: "rgba(247, 243, 243, 0.562);"}} id={style.descriptionText}><u>This is yet to be completed.</u></p>
  <br />
  <div id={style.documents}>
    <h3>Documents</h3>
    <br />
    <div id={style.documentSection}>
    <div id={style.transcriptSection}>
    <h6>Transcripts</h6>
    {
      documentData ? null :
      <div id={style.sectionText}>
        <div id={style.entry}><a href="">Transcript</a><p>Last Updated: 2024-08-13</p></div>
        <div id={style.entry}><a href="">Transcript</a><p>Last Updated: 2024-08-13</p></div>
      </div>
    }
    </div>
    <div id={style.transcriptSection}>
      <h6>Professional</h6>
      <div id={style.sectionText}>
       <div id={style.entry}><a href="">Resumé</a><p>Last Updated: 2024-08-13</p></div>
      </div>
    </div>
    <div>
    </div>
    </div>
    <br />
    <h3>Work Experience</h3>
    <br />
    <h5>Buisness</h5>
    <h6>Job role</h6>
    <p style={{fontSize:".8rem"}}>May 2019 - Aug 2024</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, sunt similique omnis pariatur minima laborum corrupti, nostrum perspiciatis aliquid eaque id recusandae facere libero est maxime atque, fugit dolorum dignissimos.
    Obcaecati, quisquam tempore! Provident, excepturi, incidunt distinctio error cupiditate sint, iure eaque non veritatis obcaecati ullam! Commodi quo, illo architecto quia dolor iusto officiis libero facere quis soluta deleniti ad?
    Autem ipsa quidem assumenda voluptates dolorum, dicta magnam. Vero recusandae quod nostrum quasi. Tenetur veniam, aliquid deserunt hic mollitia temporibus blanditiis sequi consectetur ipsam amet, sit aliquam numquam vero nobis.</p>
    <br />
    <h3>Education</h3>
    <br />
    <h5>University of Broomfield</h5>
    <p style={{fontSize:".8rem"}}>May 2019 - Aug 2024</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum eveniet alias cumque numquam repellat autem in explicabo blanditiis ea asperiores. Ea quis non soluta exercitationem qui consectetur delectus suscipit tenetur.</p>
  </div>
  </div>
</div>
</> ;
};

export default AboutMe;
