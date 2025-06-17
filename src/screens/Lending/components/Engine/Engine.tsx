import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useWillChange,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { useWindowSize } from 'usehooks-ts';
import engine from '@/assets/images/engine.svg';
import mobileEngine from '@/assets/images/mobileEngine.svg';
import { useBrowser } from '@/hooks/useBrowser';
import { Background } from './components/Background';

interface IEngineProps {
  id: string;
}

export const Engine = ({ id }: IEngineProps) => {
  const { isSafari } = useBrowser();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const [scrollRange, setScrollRange] = useState(0);
  const [viewportW, setViewportW] = useState(0);
  const { width } = useWindowSize();
  const isMobile = width <= 992;
  const willChange = useWillChange();
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);
  const inView = useInView(titleRef, {
    margin: '0px 0px -30% 0px',
    once: false,
  });

  useEffect(() => {
    if (!rootRef.current) {
      rootRef.current = document.getElementById('viewport');
    }

    setScrollRange(scrollRef.current?.scrollWidth || 0);
  }, []);

  useEffect(() => {
    const ref = ghostRef.current;
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setViewportW(entry.contentRect.width);
      }
    });

    if (ref) {
      resizeObserver.observe(ref);

      return () => {
        if (ref) resizeObserver.unobserve(ref);

        resizeObserver.disconnect();
      };
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ghostRef,
    container: rootRef,
    layoutEffect: false,
  });

  const transformX = useTransform(
    scrollYProgress,
    [0.1, 0.85],
    [0, -scrollRange + (isMobile ? viewportW + 40 : viewportW)]
  );

  return (
    <>
      <section
        style={{ height: scrollRange }}
        ref={ghostRef}
        className="relative"
        id={id}
      >
        <div className="sticky top-0 max-992px:py-[40px] py-[110px] pb-0">
          <div className="absolute left-0 right-0 bottom-0 flex justify-center items-end h-[6623px] translate-y-[750px] overflow-hidden pointer-events-none">
            <div className="max-w-none w-[7697px] object-cover">
              <Background key="background" />
            </div>
          </div>
          <motion.h2
            ref={titleRef}
            initial={{ opacity: 0, x: 0, y: isMobile ? 90 : 0 }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{
              delay: 0.1,
              duration: 0.5,
              ease: 'easeOut',
            }}
            style={{ willChange }}
            className="max-w-[666p] max-992px:leading-[35px] leading-[62px] w-full max-992px:text-[32px] text-[57px] font-radio text-[#fff] text-center mb-[26px]"
          >
            Crypto App engine
          </motion.h2>
          <div className="relative max-992px:px-[40px] max-w-[666px] font-radio text-[18px] text-[#C9C9E2] mx-auto mb-[46px] text-center">
            <motion.p
              ref={titleRef}
              initial={{
                opacity: 0,
                x: isMobile ? 0 : -90,
                y: isMobile ? 90 : 0,
              }}
              animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{
                delay: 0.2,
                duration: 0.5,
                ease: 'easeOut',
              }}
              style={{ willChange }}
              className="max-992px:text-[14px]"
            >
              Learn the inner workings of our high-performance engine that
              delivers precise solutions and extensive strategies.
            </motion.p>

            {!isSafari ? (
              <div className="absolute max-992px:w-full w-[791px] h-[757px] bg-[#B0B0EA] -translate-x-[402px] -translate-y-[88px] blur-[225px] z-[-1]" />
            ) : (
              <div className="absolute w-full h-[733px] bg-[#B0B0EA] translate-x-[-302px] translate-y-[88px] blur-[225px]"></div>
            )}
          </div>
          <div className="overflow-hidden">
            <motion.div
              ref={scrollRef}
              style={{ x: transformX, willChange }}
              className="cases_wrapper relative overflow-x-visible"
            >
              {!isMobile && (
                <img
                  src={engine}
                  alt=""
                  className="max-992px:hidden max-w-none h-full max-h-[651px] ml-[37vw]"
                  onLoad={() => {
                    setScrollRange(scrollRef.current?.scrollWidth || 0);
                  }}
                />
              )}
              {isMobile && (
                <img
                  src={mobileEngine}
                  alt=""
                  className="hidden max-992px:block max-w-none h-full max-h-[661px] ml-[17%]"
                  onLoad={() => {
                    setScrollRange(scrollRef.current?.scrollWidth || 0);
                  }}
                />
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};
