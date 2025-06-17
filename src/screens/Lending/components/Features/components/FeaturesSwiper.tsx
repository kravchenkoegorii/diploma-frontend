import {
  motion,
  transform,
  useInView,
  useMotionValueEvent,
  useScroll,
  useWillChange,
} from 'framer-motion';
import { useRef, useState } from 'react';
import { EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { useWindowSize } from 'usehooks-ts';
import { FeaturesIcon1 } from '../../../../../assets/icons/FeaturesIcon1';
import { FeaturesIcon2 } from '../../../../../assets/icons/FeaturesIcon2';
import { FeaturesIcon3 } from '../../../../../assets/icons/FeaturesIcon3';
import { FeaturesItem } from './FeaturesItem/FeaturesItem';
import clsx from 'clsx';

export const FeaturesSwiper = () => {
  const { width } = useWindowSize();
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperRef | null>(null);
  const swiperContainerRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLHeadingElement | null>(null);

  const isMobile = width <= 992;
  const featuresInView = useInView(featuresRef, {
    margin: '0px 0px -30% 0px',
    once: false,
  });

  const swiperInView = useInView(swiperContainerRef, {
    margin: '0px 0px -10% 0px',
    once: false,
  });

  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const willChange = useWillChange();

  useMotionValueEvent(scrollYProgress, 'change', latest => {
    const newActiveIndex = Math.round(
      transform(latest, !isMobile ? [0, 0.3, 0.8] : [0, 0.5, 1], [0, 1, 2])
    );
    setActiveIndex(newActiveIndex);
    swiperRef.current?.swiper.slideTo(newActiveIndex);
  });

  return (
    <>
      <div
        className={clsx(isMobile ? 'h-[1080px]' : 'h-[2400px]')}
        ref={targetRef}
      >
        <div className="sticky top-[25%]">
          <motion.h1
            ref={featuresRef}
            initial={{ opacity: 0, x: isMobile ? 0 : 90, y: isMobile ? 90 : 0 }}
            animate={featuresInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{
              delay: 0.4,
              duration: 0.5,
              ease: 'easeOut',
            }}
            style={{ willChange }}
            className="max-992px:text-[32px] max-992px:leading-[35.2px] leading-[62px] text-[57px] font-radio text-[#fff] text-center mb-[26px]"
          >
            Features
          </motion.h1>
          <motion.div
            initial={{
              opacity: 0,
              x: isMobile ? 0 : -90,
              y: isMobile ? 90 : 0,
            }}
            animate={featuresInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{
              delay: 0.5,
              duration: 0.5,
              ease: 'easeOut',
            }}
            style={{ willChange }}
            className="max-992px:text-[14px] leading-[19px] max-w-[666px] font-radio text-[18px] text-[#C9C9E2] mx-auto mb-[60px] text-center"
          >
            Ask, explore, approve, reflect. <br /> Just what you need to
            implement your best strategies.
          </motion.div>
          <motion.div
            ref={swiperContainerRef}
            initial={{ opacity: 0, x: isMobile ? 0 : 90, y: isMobile ? 90 : 0 }}
            animate={swiperInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{
              delay: 0.5,
              duration: 0.5,
              ease: 'easeOut',
            }}
            style={{ willChange }}
            className="h-[370px] mb-[130px]"
          >
            <div className="w-full h-[370px] font-radio relative">
              <Swiper
                ref={swiperRef}
                spaceBetween={0}
                speed={500}
                centeredSlides={true}
                initialSlide={activeIndex}
                onSlideChange={swiper => setActiveIndex(swiper.realIndex)}
                effect={'coverflow'}
                grabCursor={false}
                allowTouchMove={false}
                centerInsufficientSlides={true}
                slidesPerView={width > 992 ? 3 : 'auto'}
                coverflowEffect={{
                  rotate: 50,
                  stretch: 23,
                  depth: 100,
                  modifier: 1,
                  slideShadows: false,
                }}
                modules={[EffectCoverflow]}
              >
                <SwiperSlide
                  style={{
                    perspective: '800px',
                    justifyContent: 'center',
                  }}
                  className="!flex justify-center features-slide"
                >
                  <FeaturesItem
                    title="Non-stop market monitoring"
                    subtitle="Track crypto dynamics in real-time and react to changes instantly."
                    image={<FeaturesIcon1 />}
                    marker="Personal advisor"
                    index={0}
                    activeIndex={activeIndex}
                  />
                </SwiperSlide>
                <SwiperSlide
                  style={{
                    perspective: '800px',
                    justifyContent: 'center',
                  }}
                  className="!flex justify-center"
                >
                  <FeaturesItem
                    title="Extensive market analysis"
                    subtitle="Use in-depth analysis to assess opportunities and make informed decisions."
                    image={<FeaturesIcon2 />}
                    marker="Powerful engine"
                    index={1}
                    activeIndex={activeIndex}
                  />
                </SwiperSlide>
                <SwiperSlide
                  style={{
                    perspective: '800px',
                    justifyContent: 'center',
                  }}
                  className="!flex justify-center"
                >
                  <FeaturesItem
                    title="Convenient trading"
                    subtitle="Trade quickly and efficiently with minimal effort and maximum comfort."
                    image={<FeaturesIcon3 />}
                    marker="Trading platform"
                    index={2}
                    activeIndex={activeIndex}
                  />
                </SwiperSlide>
              </Swiper>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
