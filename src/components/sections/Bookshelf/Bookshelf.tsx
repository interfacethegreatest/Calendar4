import * as React from 'react';
import style from './aboutMeStyles.module.css';
import GenerateModal from '@/components/buttons/generateModal/generateModal';
import { useEffect, useState } from 'react';
import Tilt from 'react-parallax-tilt';
import { SyncLoader } from 'react-spinners';
import { RiDeleteBin3Line } from 'react-icons/ri';
import { RxCross1 } from "react-icons/rx";     
import { IoIosStar, IoMdCheckmark } from "react-icons/io"; 
import { MdOutlineRemove } from "react-icons/md"; 
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import SlideButtonSubmit from '@/components/buttons/auth/slideButtonSubmit';
import { AiFillLock } from 'react-icons/ai';
import { get } from 'http';
import user from '@/pages/user/[userId]';

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
  const { data: session } = useSession();
  const { serverSideProps, getServerSideProps, userId, setShowContentProjects } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [bookData, setBookData] = useState<Book[] | null>(null);
  const [completedBooks, setCompletedBooks] = useState<(boolean | null)[]>([]);
  const handleDeleteBook = async (bookNumber: number, session, userId: string) => {
  try {
    // Call your API route – change the URL to match your actual endpoint
    await axios.post('/api/auth/removeBook', { bookNumber, session, userId });

    // Optimistically update UI
    getServerSideProps(true)

    toast.success('Book deleted from your shelf');
  } catch (error) {
    console.error('Error deleting book:', error);
    toast.error('Failed to delete book');
  }
};

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
                    <div className={style.bookCardButtonWrapper}>
                      <form
                        onSubmit={(e) => {
                          console.log(index)
                          e.preventDefault();          // prevent page reload
                          handleDeleteBook(index, session, userId);  // call the handler
                        }}
                      >
                        <SlideButtonSubmit
                          type="submit"                     // important!
                          slide_text="Delete your book"
                          text="Delete"
                          icon={<AiFillLock />}
                          width="250px"
                          disabled={null}
                          setScene={() => null}
                        />
                      </form>
                    </div>
                    </div>
                    <div id={style.bookImageContainer}>
                      <img
                        src={book.imageUrl}  // change to your image
                        alt="Book"
                        className={style.bookImage}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <h1 id={style.bookTitle}>{book.bookTitle}</h1>
                      <p id={style.bookDescription}>By {book.bookAuthor}</p>
                      

                      {/* ⭐ Rating stars */}
                      <div style={{ whiteSpace: "nowrap", marginTop:"4%", marginLeft: "10px", marginBottom: "5%", display:"flex"}}>
                        {Array.from({ length: book.rating }, (_, i) => (
                          <IoIosStar size={15}/>
                        ))}
                      </div>
                      <div id={style.bookDescriptionContainer}>
                        <p id={style.bookDesc}>{book.bookDescription}</p>
                      </div>
                    </div>
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
