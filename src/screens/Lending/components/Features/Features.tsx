import { motion, useInView, useWillChange } from 'framer-motion';
import { useRef } from 'react';
import { Counter } from './components/Counter/Counter';
import { FeaturesSwiper } from './components/FeaturesSwiper';

interface IFeaturesProps {
  id: string;
}

export const Features = ({ id }: IFeaturesProps) => {
  const counterRef = useRef<HTMLDivElement | null>(null);

  const inView = useInView(counterRef, {
    margin: '0px 0px -20% 0px',
    once: false,
  });
  const willChange = useWillChange();

  return (
    <div
      id={id}
      className="relative z-[1] max-992px:px-0 px-[150px] max-w-[1440px] mx-auto pb-10"
    >
      <motion.div
        ref={counterRef}
        initial={{ opacity: 0, y: 75 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
        style={{ willChange }}
        className=" max-992px:px-[37.5px]  font-radio  max-992px:pt-[30px] pt-[120px] max-992px:mb-[60px] mb-[110px]"
      >
        <h1 className="text-center font-radio text-[57px] mb-[26px] text-[#fff]">
          Droms in numbers
        </h1>

        {/* TODO: ADD NEW NUMBERS FOR COUNTERS */}

        <div className="flex max-992px:flex-col max-992px:items-center justify-between">
          <div className="mx-auto">
            <div className="max-374px:text-[47px] leading-[62px] text-center text-[56px] text-[#fff]">
              <Counter duration={3} target={207100000000} />
            </div>
            <div className="text-[18px] text-[#fff] text-center">Volume</div>
          </div>
          <div
            className="w-[3px] max-h-[84px] h-[115px] max-992px:rotate-[90deg] max-992px:mx-auto"
            style={{
              background:
                'linear-gradient(to bottom, transparent, #FCE73F, transparent)',
            }}
          ></div>
          <div className="mx-auto">
            <div className="max-374px:text-[47px] leading-[62px] text-center text-[56px] text-[#fff]">
              <Counter duration={3} target={622600} />
            </div>
            <div className="text-[18px] text-[#fff] text-center">Users</div>
          </div>
          <div
            className="w-[3px] max-h-[84px] h-[115px] max-992px:rotate-[90deg] max-992px:mx-auto"
            style={{
              background:
                'linear-gradient(to bottom, transparent, #FCE73F, transparent)',
            }}
          ></div>
          <div className="mx-auto">
            <div className="max-374px:text-[47px] leading-[62px] text-center text-[56px] text-[#fff]">
              <Counter duration={3} target={31900000} />
            </div>
            <div className="text-[18px] text-[#fff] text-center">
              Transactions
            </div>
          </div>
        </div>
      </motion.div>
      <FeaturesSwiper />
    </div>
  );
};
