import * as React from 'react';
import style from './aboutMeStyles.module.css';
import GenerateModal from '@/components/buttons/generateModal/generateModal';
import { useEffect, useState } from 'react';
import Tilt from 'react-parallax-tilt';
import { SyncLoader } from 'react-spinners';
import { useSession } from 'next-auth/react';
import BlogForm from '@/components/forms/BlogForm/BlogForm';


interface IBlogProps {
  setShowContentBlog: (v: boolean) => void;
  serverSideProps: boolean;
  getServerSideProps: (v: boolean) => void;
  userId: string | string[] | undefined;
}


const Blog: React.FunctionComponent<IBlogProps> = (props) => {
  const { data: session } = useSession();
  const { serverSideProps, getServerSideProps, userId, setShowContentBlog } = props;
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div id={style.about}>
      <div id={style.backing2}></div>

      <Tilt scale={1} tiltMaxAngleX={1} tiltMaxAngleY={1} style={{ display: 'block', width: '100%' }}>
        <div id={style.main}>
          {loading ? (

            <div id={style.spinnerCentre}>
              <div id={style.spinner}>
                <SyncLoader size={5} color="#f0f8ff" />
              </div>
            </div>
          ) : (
            <>
              <h2 id={style.mainTitle}>
                <b>Blog</b>
              </h2>

              <div id={style.editBar}>
                <GenerateModal fields={'Edit Documents'} setShowContent={setShowContentBlog} />
              </div>
              <br /> 
            </>
          )}
        </div>
      </Tilt>

      <div id={style.backing}></div>
    </div>
  );
};

export default Blog;
