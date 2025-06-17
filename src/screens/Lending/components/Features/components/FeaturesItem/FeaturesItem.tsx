import { ReactNode } from 'react';
import { noise } from '../../../../../../assets/images';

interface ISlideProps {
  index: number;
  activeIndex: number;
  title: string;
  subtitle: string;
  image: ReactNode;
  marker: string;
}

export const FeaturesItem = ({
  index,
  activeIndex,
  title,
  subtitle,
  image,
  marker,
}: ISlideProps) => {
  return (
    <div
      className={`h-[370px] max-992px:w-[304px] max-w-[346px] overflow-hidden ${
        activeIndex !== index ? 'opacity-50' : 'opacity-100'
      }`}
      style={{
        transformStyle: 'preserve-3d',
        scale: activeIndex === index ? '1' : '0.9',
        transition: 'transform .3s, scale 1s, filter 0.5s, opacity 0.5s',
      }}
    >
      <img src={noise} alt="" className="opacity-50 absolute h-full" />
      <div className="absolute top-[-15%] right-[-10%]">{image}</div>
      <div className="z-index-999 opacity-100 p-[40px] h-full flex flex-col items-center justify-end text-white">
        <div className="py-[9px] px-[16px] absolute top-[40px] left-[40px] bg-white bg-opacity-[0.16] text-[#fff] text-[12px] rounded-[33px]">
          {marker}
        </div>

        <div className="text-[28px] mb-[20px] leading-[30px] text-[#fff]">
          {title}
        </div>
        <span className="text-[14px] text-[#fff]">{subtitle}</span>
      </div>
    </div>
  );
};
