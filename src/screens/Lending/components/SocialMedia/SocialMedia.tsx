import { Link } from 'react-router-dom';
import clsx from 'clsx';
import React from 'react';

interface ISocialMediaProps {
  className?: string;
  link: string;
  image: React.ReactNode;
}

export const SocialMedia = ({ className, link, image }: ISocialMediaProps) => {
  return (
    <Link
      to={link}
      target="_blank"
      className={clsx(
        'backdrop-blur-[26px] flex justify-center font-radio max-992px:px-[25px] max-374px:py-[14px] max-992px:text-[14px] max-992px:max-w-[120px] items-center py-[18px] px-[35px] uppercase max-992px:border border-[2px] border-[#FFFFFF80] rounded-[40px] text-[#fff] group',
        className
      )}
      rel="noopener noreferrer"
    >
      <div className="transition-transform duration-300 group-hover:scale-[1.2]">
        {image}
      </div>
    </Link>
  );
};
