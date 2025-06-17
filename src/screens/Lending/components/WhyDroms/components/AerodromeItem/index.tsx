import { ReactNode, useRef } from 'react';
import { aerodromeImage } from '../../../../../../assets/images';
import { motion, useInView, useWillChange } from 'framer-motion';
import { useWindowSize } from 'usehooks-ts';

interface IAerodromeItemProps {
  title: string;
  image: ReactNode;
  description: string;
}

export const AerdromeItem = ({
  title,
  image,
  description,
}: IAerodromeItemProps) => {
  const { width } = useWindowSize();
  const isMobile = width <= 992;

  const itemRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(itemRef, {
    margin: '0px 0px -10% 0px',
    once: false,
  });

  const textInView = useInView(textRef, {
    margin: '0px 0px -10% 0px',
    once: false,
  });

  const willChange = useWillChange();

  return (
    <div className="flex max-992px:flex-col gap-[60px] items-center justify-center relative">
      <motion.div
        ref={itemRef}
        initial={{ opacity: isMobile ? 1 : 0, x: isMobile ? 0 : -90, y: 0 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{
          delay: 0.3,
          duration: 0.5,
          ease: 'easeOut',
        }}
        style={{ willChange }}
        className="max-992px:w-[160px] max-992px:h-[160px] w-[240px] h-[240px] rounded-[23px] backdrop-blur-[150px] bg-gradient-radial from-[rgba(255,255,255,0.16)] to-[rgba(23,23,23,0.16)] flex items-center justify-center "
      >
        <img
          src={aerodromeImage}
          alt=""
          className="opacity-50 absolute h-full w-full"
        />
        <div>{image}</div>
      </motion.div>
      <motion.div
        ref={textRef}
        initial={{ opacity: 0, x: isMobile ? 0 : 90, y: isMobile ? 90 : 0 }}
        animate={textInView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{
          delay: 0.2,
          duration: 0.5,
          ease: 'easeOut',
        }}
        style={{ willChange }}
        className="hidden max-992px:block"
      >
        <div className="text-[24px] mb-[20px] text-center">{title}</div>
        <div className="text-[#DDDDDD] text-[14px] text-center">
          {description}
        </div>
      </motion.div>
      <motion.div
        ref={itemRef}
        initial={{ opacity: 0, x: isMobile ? 0 : 90, y: isMobile ? 90 : 0 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{
          delay: 0.7,
          duration: 0.5,
          ease: 'easeOut',
        }}
        style={{ willChange }}
        className="max-992px:hidden absolute right-[-115%]"
      >
        <div className="text-[28px] leading-[30px] mb-[20px]">{title}</div>
        <div className="text-[#DDDDDD] text-[14px] max-w-[216px]">
          {description}
        </div>
      </motion.div>
    </div>
  );
};
