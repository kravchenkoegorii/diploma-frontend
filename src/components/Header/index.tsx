// import { usePrivy } from "@privy-io/react-auth";
import { Drawer } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import {
  MdChevronRight,
  MdHelp,
  MdPages,
  MdRocketLaunch,
  MdRoute,
} from 'react-icons/md';
import { Logo } from '../../screens/Lending/components/Logo/Logo';
import { motion, useWillChange } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { BlogBlackArrow } from '../../assets/icons/BlogBlackArrow';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes.ts';

interface IHeaderProps {
  handleScroll: (e: MouseEvent, targetId: string) => void;
}

export const Header = ({ handleScroll }: IHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // const { ready, user, authenticated, logout } = usePrivy();
  const toggleDrawer = () => setIsOpen(!isOpen);
  const lenis = useLenis();

  const handleScrollToTop = (e: MouseEvent) => {
    e.stopPropagation();
    lenis?.scrollTo('top');
  };

  const willChange = useWillChange();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-10 flex justify-between max-992px:py-5 max-992px:pb-0 py-3 items-center mx-auto max-992px:pl-4 max-992px:pr-9 px-[30px]">
        <div className="relative max-992px:hidden flex items-center justify-between px-[28px] min-h-[56px] rounded-[23px]">
          <div className="absolute inset-0 rounded-[inherit] z-[0]  backdrop-blur-[35px]" />
          <div className="absolute inset-0 rounded-[inherit] z-[0] bg-[#5050504D] backdrop-saturate-[12] backdrop-contrast-[.25] mask-header backdrop-blur-[35px]" />
          <div className="relative z-[1]" onClick={handleScrollToTop}>
            <Logo text={20} width={14.7} height={23} isHover={true} />
          </div>
          <nav className="relative z-[1] max-992px:hidden ml-[160px] flex items-center gap-[70px]">
            <a
              onClick={e => handleScroll(e, '#features')}
              className="hover:scale-[1.1] cursor-pointer transition-width ease-in-out duration-300 text-[16px] text-[#fff] font-normal leading-[14.4px] uppercase"
            >
              Features
            </a>
            <a
              onClick={e => handleScroll(e, '#why-aerodrome')}
              className="hover:scale-[1.1] cursor-pointer transition-width ease-in-out duration-300 text-[16px] text-[#fff] font-normal leading-[14.4px] uppercase"
            >
              Why DROMS
            </a>
            <a
              onClick={e => handleScroll(e, '#engine')}
              className="hover:scale-[1.1] cursor-pointer transition-width ease-in-out duration-300 text-[16px] text-[#fff] font-normal leading-[14.4px] uppercase"
            >
              Engine
            </a>
            <a
              onClick={e => handleScroll(e, '#blog')}
              className="hover:scale-[1.1] cursor-pointer transition-width ease-in-out duration-300 text-[16px] text-[#fff] font-normal leading-[14.4px] uppercase"
            >
              Blog
            </a>
          </nav>
        </div>
        <div
          className="hidden max-992px:flex items-center min-h-[46px] pl-[11px] pr-[27px] rounded-[23px] bg-customGray backdrop-blur-[70px]"
          onClick={toggleDrawer}
        >
          <button>
            <MdChevronRight color="white" className="w-6 h-6 rotate-90" />
          </button>
          <button onClick={handleScrollToTop}>
            <Logo
              text={20}
              width={20}
              height={20}
              hidden={true}
              isHover={true}
            />
          </button>
        </div>

        <Link
          to={ROUTES.CHAT}
          className="flex relative max-992px:mr-0 mr-[30px] hover:opacity-70 transition duration-300"
        >
          <div className="bg-[#fff] font-[400] bg-opacity-80 backdrop-blur-sm max-992px:text-[12px] text-[16px] uppercase max-992px:py-[14px] py-4 max-992px:px-6 px-[27px] rounded-[27px]">
            Launch App
          </div>
          <div className="absolute max-992px:right-[-29px] right-[-35px] max-992px:top-[3px] bg-[#FFEC3C] rounded-[50%] max-992px:w-[41px] w-[50px] max-992px:h-[41px] h-[50px] flex items-center justify-center cursor-pointer ">
            <BlogBlackArrow width={27} height={27} />
          </div>
        </Link>
      </header>
      <Drawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        disableEnforceFocus
      >
        <div className="relative flex flex-col gap-2 px-[44px] pt-[44px] w-screen h-full max-w-[320px] bg-[#222224] overflow-hidden border-r border-white/10 ">
          <div className="relative z-[1] flex flex-col gap-2">
            <div className="flex mb-[50px]">
              <button onClick={() => setIsOpen(false)}>
                <Logo text={20} width={14.7} height={23} isHover={true} />
              </button>
              <button className="ml-auto" onClick={() => setIsOpen(false)}>
                <IoMdClose className="text-[#C9C9E2] w-6 h-6" />
              </button>
            </div>
            <motion.a
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring' }}
              href="#features"
              className="flex justify-start items-center gap-2 font- text-[18px] text-[#787885] uppercase max-992px:py-[14px] py-6 border-b border-white/10"
              onClick={() => setIsOpen(false)}
              style={{ willChange }}
            >
              <MdRocketLaunch color="#787885" />
              Features
            </motion.a>
            <motion.a
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', delay: 0.1 }}
              href="#why-aerodrome"
              className="flex justify-start items-center gap-2 font- text-[18px] text-[#787885] uppercase max-992px:py-[14px] py-6 border-b border-white/10"
              onClick={() => setIsOpen(false)}
              style={{ willChange }}
            >
              <MdHelp color="#787885" />
              Why DROMS
            </motion.a>
            <motion.a
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', delay: 0.2 }}
              href="#engine"
              className="flex justify-start items-center gap-2 font- text-[18px] text-[#787885] uppercase max-992px:py-[14px] py-6 border-b border-white/10"
              onClick={() => setIsOpen(false)}
              style={{ willChange }}
            >
              <MdRoute color="#787885" />
              Engine
            </motion.a>
            <motion.a
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', delay: 0.3 }}
              href="#blog"
              className="flex justify-start items-center gap-2 font- text-[18px] text-[#787885] uppercase max-992px:py-[14px] py-6 border-b border-white/10"
              onClick={() => setIsOpen(false)}
              style={{ willChange }}
            >
              <MdPages color="#787885" />
              Blog
            </motion.a>
          </div>
        </div>
      </Drawer>
    </>
  );
};
