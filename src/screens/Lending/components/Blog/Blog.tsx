import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { useRef, useState } from 'react';
import { Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { BlogItem } from './components/BlogItem/BlogItem';
import {
  motion,
  transform,
  useInView,
  useMotionValueEvent,
  useScroll,
  useWillChange,
} from 'framer-motion';
import { useWindowSize } from 'usehooks-ts';

const blogs = [].reverse();

interface IBlogProps {
  id: string;
}

export const Blog = ({ id }: IBlogProps) => {
  const { width } = useWindowSize();
  const isMobile = width <= 992;
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const blogRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(titleRef, {
    margin: '10% 0px 30% 0px',
    once: false,
  });

  const blogInView = useInView(blogRef, {
    margin: '0px 0px 30% 0px',
    once: false,
  });

  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = blogs.length;

  const swiperRef = useRef<SwiperRef | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  useMotionValueEvent(scrollYProgress, 'change', latest => {
    const slides = isMobile ? totalSlides : totalSlides - 2;
    const scrollKeyPoints = Array(slides)
      .fill(0)
      .map((_, i) => i / slides);
    const slidesKeyPoints = Array(slides)
      .fill(0)
      .map((_, i) => i);

    const newCurrentSlide = Math.round(
      transform(latest, scrollKeyPoints, slidesKeyPoints)
    );

    setCurrentSlide(newCurrentSlide + 1);
    swiperRef.current?.swiper.slideTo(newCurrentSlide);
  });

  const willChange = useWillChange();

  return (
    <div
      style={{
        height: `${(isMobile ? blogs.length : blogs.length - 2) * 75}vh`,
      }}
      ref={targetRef}
    >
      <div className="sticky top-[10%]">
        <div id={id} className="font-radio mt-[40px] max-992px:px-4 px-[70px]">
          <motion.h1
            ref={titleRef}
            initial={{ opacity: 0, x: 0, y: 90 }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{
              delay: 0.2,
              duration: 0.5,
              ease: 'easeOut',
            }}
            style={{ willChange }}
            className="max-992px:text-[32px] max-992px:leading-[35px] leading-[62px] text-[57px] text-[#171717] text-center mb-[26px]"
          >
            Blog
          </motion.h1>
          <motion.h2
            ref={titleRef}
            initial={{ opacity: 0, x: 0, y: 90 }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{
              delay: 0.4,
              duration: 0.5,
              ease: 'easeOut',
            }}
            style={{ willChange }}
            className="max-992px:text-[14px] text-[18px] text-center max-w-[666px] mx-auto max-992px:mb-[40px] mb-[60px]"
          >
            Take off with our articles and relevant updates on Medium.
          </motion.h2>
          <motion.div
            ref={blogRef}
            initial={{ opacity: 0, x: 0, y: 90 }}
            animate={blogInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{
              delay: 0.2,
              duration: 0.5,
              ease: 'easeOut',
            }}
            style={{ willChange }}
          >
            <Swiper
              ref={swiperRef}
              spaceBetween={10}
              centeredSlides={isMobile ? true : false}
              slidesPerView={isMobile ? 1 : 3}
              onSlideChange={swiper => setCurrentSlide(swiper.realIndex + 1)}
              dir="rtl"
              className="max-992px:mb-[40px] mb-[84px] max-w-[1260px]"
              pagination={{
                el: '.blog-pagination',
                type: 'progressbar',
              }}
              modules={[Pagination]}
              wrapperClass="blog-swiper"
            >
              {blogs?.map(({ title, image, link }) => (
                <SwiperSlide key={title}>
                  <BlogItem title={title} image={image} link={link} />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>

          <motion.div
            ref={blogRef}
            initial={{ opacity: 0, x: 0, y: 90 }}
            animate={blogInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{
              delay: 0.5,
              duration: 0.5,
              ease: 'easeOut',
            }}
            style={{ willChange }}
            className="flex max-992px:gap-[47px] justify-between items-center max-w-[1260px] mx-auto"
          >
            <div className="w-[411px] h-[2px] relative flex items-center justify-between font-radio max-992px:pl-0 pl-[30px]">
              <div className="text-[18px] font-bold relative">
                <span className="absolute top-[-67%] left-[0%] min-w-[65px] text-left max-992px:text-[12px] text-[14px] font-[400]">
                  dec 2024
                </span>
                {totalSlides < 10 && '0'}
                {isMobile ? totalSlides : totalSlides - 2}
              </div>
              <div className="flex-1 mx-4 h-[2px] bg-[#BCBCBC] relative">
                <div
                  className="pagination absolute top-[-25%] right-0 w-full h-[4px] bg-white rotate-[180deg] transition-width ease-in-out duration-300"
                  style={{
                    backgroundColor: 'black',
                    width: `${
                      (currentSlide /
                        (isMobile ? totalSlides : totalSlides - 2)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="text-[18px] font-[600] relative">
                <span className="absolute top-[-67%] left-[-180%] min-w-[55px] text-right max-992px:text-[12px] text-[14px] font-[400]">
                  jun 2024
                </span>
                {currentSlide < 10 && '0'}
                {Math.max(0, currentSlide)}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
