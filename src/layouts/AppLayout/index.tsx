import { appStore, useAppStore } from '@/stores/app';
import { usePrivy } from '@privy-io/react-auth';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useWindowSize } from 'usehooks-ts';
import { useShallow } from 'zustand/shallow';
import { useChatsStore } from '../../stores/chats';
import { Header } from './component/Header';

export const AppLayout = () => {
  const { ready } = usePrivy();
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.classList.add('body-bg-black');

    return () => {
      document.documentElement.classList.remove('body-bg-black');
    };
  }, []);

  const [selectedChat] = useChatsStore(useShallow(s => [s.selectedChat]));
  const { width } = useWindowSize();
  const [isScrolled, setIsScrolled] = useAppStore(
    useShallow(s => [s.isScrolled, s.setIsScrolled])
  );

  useEffect(() => {
    if (width > 992) {
      return;
    }

    if (!ready || !selectedChat?.id) {
      return;
    }

    const handleScroll = () => {
      const element = document.querySelector('.chat-scroll-container > div');
      if (!element || window.innerWidth > 992) {
        return;
      }

      const { isScrolled } = appStore.getState();

      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const diff = scrollHeight - scrollTop - element.clientHeight;
      const isScrolledDown = isScrolled ? diff > 88 : diff > 150;

      setIsScrolled(isScrolledDown);
    };

    const element = document.querySelector('.chat-scroll-container > div');

    if (element) {
      element?.addEventListener('scroll', handleScroll);
    } else {
      const timeout = setTimeout(() => {
        const element = document.querySelector('.chat-scroll-container > div');
        element?.addEventListener('scroll', handleScroll);
      }, 3000);

      return () => {
        timeout && clearTimeout(timeout);
        const element = document.querySelector('.chat-scroll-container > div');
        element?.removeEventListener('scroll', handleScroll);
      };
    }

    return () => {
      const element = document.querySelector('.chat-scroll-container > div');
      element?.removeEventListener('scroll', handleScroll);
    };
  }, [width, ready, selectedChat?.id]);

  return (
    <div className="chat-body flex flex-col max-992px:gap-0 gap-4 min-h-[100dvh] min-992px:h-[100dvh] w-dvw font-radio min-992px:overflow-y-auto custom-scrollbar">
      <motion.div
        initial={{ height: 108, paddingTop: 20, paddingBottom: 16 }}
        key={pathname}
        animate={
          isScrolled
            ? { height: 46, paddingTop: 0, paddingBottom: 0 }
            : { height: 108, paddingTop: 20, paddingBottom: 16 }
        }
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="max-992px:z-[999] max-992px:fixed right-0 top-0 left-0 max-992px:px-4 px-[30px] max-992px:bg-[#1A1A1A] transition duration-300"
      >
        <Header isScrolled={isScrolled} />
      </motion.div>
      <Outlet />
    </div>
  );
};
