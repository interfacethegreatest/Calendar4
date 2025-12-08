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
  const [blogData, setBlogData] = useState<any>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // NEW: record which index was clicked
  const [exitAnimation, setExitAnimation] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // hide the list container after its exit animation completes
  const [hideContainer, setHideContainer] = useState(false);

  // when true, run exit animation on the selected view (Back -> animate out)
  const [exitSelected, setExitSelected] = useState(false);

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
          const blogs = data?.user?.blogs || [];
          setBlogData(blogs);
          console.log(blogs)
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // When list finishes exiting, remove it from the DOM so the selected view shows
  const handleListTransitionEnd = (ev: React.TransitionEvent<HTMLDivElement>) => {
    if (!exitAnimation) return;
    if (ev.propertyName === 'transform' || ev.propertyName === 'opacity') {
      setHideContainer(true);
    }
  };

  // When selected container finishes exiting, restore the list and reset states
  const handleSelectedTransitionEnd = (ev: React.TransitionEvent<HTMLDivElement>) => {
    if (!exitSelected) return;
    if (ev.propertyName === 'transform' || ev.propertyName === 'opacity') {
      // Reset states so the list re-appears normally
      setHideContainer(false);      // show the list container again
      setExitAnimation(false);      // ensure list is not in exit state
      setSelectedIndex(null);       // clear selection
      setExitSelected(false);       // reset selected exit flag
    }
  };

  const handleReadMoreClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setHoveredCard(null);
    setSelectedIndex(index);
    setExitAnimation(true); // start list exit animation
  };

  const handleBackToBlogClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setExitSelected(true); // start selected view exit animation
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
                <b>Blog</b>
              </h2>

              <div id={style.editBar}>
                <GenerateModal fields={'Edit Documents'} setShowContent={setShowContentBlog} />
              </div>
              <br />

              {/* BLOG LIST: only render when hideContainer is false */}
              {!hideContainer && (
                <div
                  id={style.blogCardContainer}
                  className={exitAnimation ? style.exit : ''}
                  onTransitionEnd={handleListTransitionEnd}
                >
                  {blogData && blogData.length > 0 ? (
                    blogData.map((blog: any, index: number) => (
                      <div
                        key={index}
                        className={style.blogCard}
                        onMouseEnter={() => setHoveredCard(index)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div id={style.titleContainer}>
                          <h3 className={style.blogTitle}>{blog.blogTitle}</h3>
                          <h5 id={style.blogDate}>{formatDate(blog.createdAt)}</h5>
                        </div>

                        <p className={style.blogContent}>{blog.blogDescription}</p>

                        {hoveredCard === index && (
                          <a
                            className={style.readMore}
                            href="#"
                            onClick={(e) => handleReadMoreClick(e, index)}
                          >
                            Read more →
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className={style.noBlogs}>No blogs available.</p>
                  )}
                </div>
              )}

              {/* Selected / expanded view */}
              {selectedIndex !== null && (
                <div
                  className={`${style.selectedContainer} ${exitSelected ? style.selectedExit : ''}`}
                  onTransitionEnd={handleSelectedTransitionEnd}
                >
                  <a href="#" className={style.backLink} onClick={handleBackToBlogClick}>
                    ← Back to blog
                  </a>

                  <h1>{blogData?.[selectedIndex]?.blogTitle}</h1>
                  <p>{blogData?.[selectedIndex]?.blogDescription}</p>
                </div>
              )}
            </>
          )}
        </div>
      </Tilt>

      <div id={style.backing}></div>
    </div>
  );
};

export default Blog;
