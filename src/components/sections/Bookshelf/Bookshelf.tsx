import * as React from 'react';
import style from './aboutMeStyles.module.css';
import GenerateModal from '@/components/buttons/generateModal/generateModal';
import { useEffect, useState } from 'react';
import Tilt from 'react-parallax-tilt';
import { SyncLoader } from 'react-spinners';
import { RiDeleteBin3Line } from 'react-icons/ri';
import { RxCross1 } from "react-icons/rx";     
import { IoMdCheckmark } from "react-icons/io"; 
import { MdOutlineRemove } from "react-icons/md"; 
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface IProjectsProps {
  setShowContentProjects: (v: boolean) => void;
  serverSideProps: boolean;
  getServerSideProps: (v: boolean) => void;
  userId: string | string[] | undefined;
}

interface Book {
  _id: string;
  bookTitle: string;
  bookAuthor: string;
  rating: number;
  imageUrl: string;
  bookDescription: string;
  createdAt: string;
}

const Projects: React.FunctionComponent<IProjectsProps> = (props) => {
  const { serverSideProps, getServerSideProps, userId, setShowContentProjects } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [bookData, setBookData] = useState<Book[] | null>(null);
  const [completedBooks, setCompletedBooks] = useState<(boolean | null)[]>([]);

  useEffect(() => {
    const loadBackend = async () => {
      if (serverSideProps && userId) {
        setLoading(true);
        try {
          const response = await fetch(`/api/auth/getUserData?userId=${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch data.');
          }
          
          const data = await response.json();
          const books: Book[] = data?.user?.books || [];
          setBookData(books);

          // create a parallel array of completion flags
          setCompletedBooks(books.map(() => null)); // or false if you want default "not completed"
  
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          getServerSideProps(false);
          setTimeout(() => setLoading(false), 500);
        }
      }
    };
  
    loadBackend();
  }, [serverSideProps, userId, getServerSideProps]);

  const toggleCompleted = (index: number) => {
    setCompletedBooks(prev => {
      const copy = [...prev];
      copy[index] = !copy[index]; // null → true, true → false, false → true
      return copy;
    });
  };

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
                <b>Bookshelf</b>
              </h2>

              <div id={style.editBar}>
                <GenerateModal fields={'Edit Documents'} setShowContent={setShowContentProjects} />
              </div>

              <br />

              <div id={style.mainContainer}>
                {/* If no books, show message */}
                {!bookData || bookData.length === 0 ? (
                  <p className={style.emptyMessage}>
                    You don&apos;t have any books on your shelf yet.
                  </p>
                ) : (
                  bookData.map((book, index) => (
                    <div key={book._id ?? index} id={style.bookCard}>
                      <div className={style.bookCardBacking}>
                      </div>
                      <div id={style.bookImageContainer}></div>
                      <h1>The Great Gatsby</h1>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </Tilt>

      <div id={style.backing}></div>
    </div>
  );
};

export default Projects;
