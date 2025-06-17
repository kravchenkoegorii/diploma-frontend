import { AerdromeItem } from './components/AerodromeItem';
import { AerodromeIcon1 } from '../../../../assets/icons/AerodromeIcon1';
import { AerodromeIcon2 } from '../../../../assets/icons/AerodromeIcon2';
import { AerodromeIcon3 } from '../../../../assets/icons/AerodromeIcon3';
import { motion, useInView, useWillChange } from 'framer-motion';
import { useWindowSize } from 'usehooks-ts';
import { useRef } from 'react';

interface IAerodromeProps {
  id: string;
}

export const WhyDroms = ({ id }: IAerodromeProps) => {
  const { width } = useWindowSize();
  const isMobile = width <= 992;
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const inView = useInView(titleRef, {
    margin: '0px 0px -50% 0px',
    once: false,
  });

  const willChange = useWillChange();

  return (
    <div
      className="font-radio max-992px:px-9 px-[165px] max-992px:py-[20px] py-[110px] text-white max-w-[1440px] mx-auto relative z-[1]"
      id={id}
    >
      <div className="max-w-[666px] mx-auto mb-[60px]">
        <motion.h1
          ref={titleRef}
          initial={{ opacity: 0, x: isMobile ? 0 : 90, y: isMobile ? 90 : 0 }}
          animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{
            delay: 0.2,
            duration: 0.5,
            ease: 'easeOut',
          }}
          style={{ willChange }}
          className="max-992px:text-[32px] max-992px:leading-[35px] leading-[62px] text-[57px] text-center mb-[26px]"
        >
          Why Droms
        </motion.h1>
        <motion.h6
          initial={{ opacity: 0, x: isMobile ? 0 : -90, y: isMobile ? 90 : 0 }}
          animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{
            delay: 0.3,
            duration: 0.5,
            ease: 'easeOut',
          }}
          style={{ willChange }}
          className="text-[#C9C9E2] max-992px:text-[14px] text-[18px] text-center"
        >
          Droms are the innovative driving force of the ecosystem.
          <br className="max-992px:hidden" /> Dominating volume and activity.
        </motion.h6>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex justify-center">
          <AerdromeItem
            image={<AerodromeIcon1 />}
            title="Reliable"
            description="The platform uses Velodrome V2 architecture. Only proven technologies to keep your data safe."
          />
        </div>
        <div
          className="w-[3px] h-[54px] max-992px:my-[40px] my-[60px]"
          style={{
            background:
              'linear-gradient(to bottom, transparent, #FCE73F, transparent)',
          }}
        ></div>
        <div className="flex justify-center">
          <AerdromeItem
            image={<AerodromeIcon2 />}
            title="High values"
            description="The average APY on the platform is 224.88%, significantly higher than the market average. "
          />
        </div>
        <div
          className="w-[3px] h-[54px] max-992px:my-[40px] my-[60px]"
          style={{
            background:
              'linear-gradient(to bottom, transparent, #FCE73F, transparent)',
          }}
        ></div>
        <div className="flex justify-center">
          <AerdromeItem
            image={<AerodromeIcon3 />}
            title="Process automation"
            description="Optimize your trading with our powerful algorithms, delivering maximum performance with minimal effort."
          />
        </div>
      </div>
    </div>
  );
};
