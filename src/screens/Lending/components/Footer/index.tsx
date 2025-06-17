import { ROUTES } from '@/constants/routes';
import { useLenis } from 'lenis/react';
import { IoMdArrowUp } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { Logo } from '../Logo/Logo';

export const Footer = () => {
  const lenis = useLenis();

  const handleScrollToTop = () => {
    lenis?.scrollTo('top');
  };

  return (
    <footer className="flex max-992px:flex-col justify-between bg-[#171717] max-992px:mx-[-6px] mx-[30px] rounded-[23px] max-992px:mt-[36px] mt-[110px] max-992px:px-4 max-992px:pb-4 pt-[40px] px-[40px] pb-[21px] relative">
      <div className="max-992px:hidden flex gap-[80px] uppercase text-white">
        <div className="flex gap-[71px]">
          <div className="flex flex-col gap-[35px]">
            <a
              className="hover:scale-[1.1] transition-width ease-in-out duration-300"
              href="#features"
            >
              Features
            </a>
            <a
              className="hover:scale-[1.1] transition-width ease-in-out duration-300"
              href="#why-aerodrome"
            >
              Why DROMS
            </a>
            <a
              className="hover:scale-[1.1] transition-width ease-in-out duration-300"
              href="#engine"
            >
              Engine
            </a>
            <a
              className="hover:scale-[1.1] transition-width ease-in-out duration-300"
              href="#blog"
            >
              Blog
            </a>
          </div>
          <div className="flex flex-col gap-[35px]">
            <Link
              className="hover:scale-[1.1] transition-width ease-in-out duration-300"
              to={ROUTES.PP}
              target="_blank"
            >
              privacy policy
            </Link>
            <Link
              className="hover:scale-[1.1] transition-width ease-in-out duration-300"
              to={ROUTES.TOS}
              target="_blank"
            >
              terms and conditions
            </Link>
          </div>
        </div>
        <button
          onClick={handleScrollToTop}
          className="hover:opacity-50 transition duration-300 max-992px:hidden p-2 border-[1px] border-gray-400 mt-auto rounded-[50%]"
        >
          <IoMdArrowUp className="text-white text-[30px]" />
        </button>
      </div>

      <div className="hidden max-992px:flex flex-col gap-[31px]">
        <div className="w-[200px] pl-4">
          <Logo width={30} height={30} text={30} isHover={false} />
        </div>
        <div className="flex justify-between uppercase text-white px-4">
          <div className="flex flex-col gap-[35px]">
            <a href="#features">Features</a>
            <a href="#why-aerodrome">Why Droms</a>
            <a href="#engine">Engine</a>
            <a href="#blog">Blog</a>
          </div>
          <div className="flex flex-col gap-[35px] text-right">
            <Link to={ROUTES.PP} target="_blank">
              Privacy policy
            </Link>
            <Link to={ROUTES.TOS} target="_blank">
              Terms and conditions
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-[10px]">
          <button
            onClick={handleScrollToTop}
            className="flex justify-center items-center p-2 border-[1px] border-gray-400 lg:mt-auto rounded-full h-[63px] lg:h-auto min-w-[63px] lg:min-w-0"
          >
            <IoMdArrowUp className="text-white text-[30px]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
