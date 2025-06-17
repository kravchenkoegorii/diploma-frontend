import { Drawer } from '@mui/material';
import { useLinkAccount, useLogin, usePrivy } from '@privy-io/react-auth';
import clsx from 'clsx';
import { motion, useWillChange } from 'framer-motion';
import { FC, useState } from 'react';
import { IoMdClose, IoMdMenu } from 'react-icons/io';
import { Link, useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';
import { PLAIN_ROUTES, ROUTES } from '../../../../constants/routes';
import { Logo } from '../../../../screens/Lending/components/Logo/Logo';
import { useUserStore } from '../../../../stores/user';
import UserMenu from './components/Dropdown';
import { STAGE, STAGES } from '@/constants';
import { CopyButton } from '@/components/CopyButton';
import { formatAddress } from '@/utilities/formatAddress';
import { X } from '@/assets/icons/X';
import { userService } from '@/services/userService';
import { isCreatedWithTelegram, isCreatedWithTwitter } from '@/utilities/privy';
import { useDisconnect } from 'wagmi';
import { ConfirmUnlinkModal } from './components/ConfirmUnlinkModal';
import { SocialsEnum } from '@/types/socials';
import { Telegram } from '@/assets/icons/Telegram';
import { CgSpinnerAlt } from 'react-icons/cg';

interface IHeaderProps {
  isScrolled: boolean;
}

const chatRoute =
  STAGE === STAGES.PRODUCTION ? PLAIN_ROUTES.HOME : PLAIN_ROUTES.CHAT;
const dashboardRoute = PLAIN_ROUTES.TERMINAL;
const faqRoute = PLAIN_ROUTES.FAQ;

export const Header: FC<IHeaderProps> = ({ isScrolled }) => {
  const { login } = useLogin();
  const { linkTwitter, linkTelegram } = useLinkAccount({
    onSuccess: async () => {
      await userService.registerUser();
    },
  });
  const { user, logout, unlinkTwitter, unlinkTelegram } = usePrivy();
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => setIsOpen(!isOpen);
  const willChange = useWillChange();
  const location = useLocation();
  const pathname = location.pathname;
  const [userData] = useUserStore(useShallow(s => [s.userData]));
  const defaultWallet =
    userData?.wallets?.find(wallet => wallet.isDefault) ||
    userData?.wallets?.[0];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isTwitterUnlinkDisabled = isCreatedWithTwitter(user);
  const isTelegramUnlinkDisabled = isCreatedWithTelegram(user);
  const { disconnectAsync } = useDisconnect();
  const [socialToUnlink, setSocialToUnlink] = useState<SocialsEnum | null>(
    null
  );

  const handleCloseWithDelay = () => {
    setTimeout(() => setIsOpen(false), 500);
  };

  const handleSetSocialToUnlink = (social: SocialsEnum | null) =>
    setSocialToUnlink(social);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    userService.logOut();
    await disconnectAsync();
  };

  const handleLinkSocial = (social: SocialsEnum) => {
    if (!user) return;

    switch (social) {
      case SocialsEnum.TWITTER:
        if (!user.twitter) {
          linkTwitter();
        } else {
          if (!isTwitterUnlinkDisabled) handleSetSocialToUnlink(social);
        }

        break;
      case SocialsEnum.TELEGRAMM:
        if (!user.telegram) {
          linkTelegram();
        } else {
          if (!isTelegramUnlinkDisabled) handleSetSocialToUnlink(social);
        }

        break;

      default:
        break;
    }
  };

  const handleDisconnectSocial = async (social: SocialsEnum) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      switch (social) {
        case SocialsEnum.TWITTER:
          await unlinkTwitter(user.twitter ? user.twitter.subject : '');
          break;

        case SocialsEnum.TELEGRAMM:
          await unlinkTelegram(
            user.telegram ? user.telegram.telegramUserId : ''
          );
          break;

        default:
          break;
      }
      await userService.registerUser();
    } finally {
      setIsSubmitting(false);
      setSocialToUnlink(null);
    }
  };

  return (
    <>
      {!!socialToUnlink && (
        <ConfirmUnlinkModal
          isOpened={!!socialToUnlink}
          onClose={() => setSocialToUnlink(null)}
          socialLinkName={socialToUnlink}
          onConfirm={handleDisconnectSocial}
          isLoading={isSubmitting}
        />
      )}
      <motion.header
        initial={{ justifyContent: 'space-between' }}
        animate={
          isScrolled
            ? { justifyContent: 'center' }
            : { justifyContent: 'space-between' }
        }
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={clsx(
          'flex px-7 w-full items-center text-white max-992px:mb-0 max-992px:rounded-[16px] max-1200px:py-[24px] bg-[#1717179b]/30 border-[0.5px] border-white/10 max-1200px:rounded-[46px] rounded-[23px] transition-all duration-300 relative',
          isScrolled
            ? 'py-2 max-992px:py-2 backdrop-blur-0 border-none bg-transparent'
            : 'py-3 max-992px:py-6'
        )}
      >
        <div className="max-992px:hidden">
          <Logo height={23} width={14} text={20} isHover />
        </div>

        <motion.div
          initial={{ opacity: 1 }}
          animate={isScrolled ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={clsx(
            'hidden max-992px:flex items-center gap-[5px]',
            isScrolled && 'max-992px:hidden'
          )}
        >
          <Logo
            text={20}
            width={15}
            height={15}
            hidden={false}
            isHover={true}
          />
        </motion.div>

        <nav className="max-992px:hidden absolute left-[47%] -translate-x-1/2">
          <ul className="[&_a]:uppercase font-normal text-base text-white/40 leading-[14.4px] flex gap-[70px] font-RadioGrotesk">
            <Link
              to={ROUTES.CHAT}
              className={clsx(
                'cursor-pointer hover:scale-[1.06] transition duration-300',
                pathname.includes(chatRoute) && 'text-white'
              )}
            >
              Agent
            </Link>
            <Link
              to={ROUTES.TERMINAL}
              className={clsx(
                'cursor-pointer hover:scale-[1.06] transition duration-300',
                pathname.includes(dashboardRoute) && 'text-white'
              )}
            >
              Terminal
            </Link>
            <Link
              to={ROUTES.FAQ}
              className={clsx(
                'cursor-pointer hover:scale-[1.06] transition duration-300',
                pathname.includes(faqRoute) && 'text-white'
              )}
            >
              FAQ
            </Link>
          </ul>
        </nav>

        <button className="hidden max-992px:block" onClick={toggleDrawer}>
          <IoMdMenu className="text-[24px] text-[#C9C9E2]" />
        </button>

        <div className="max-992px:hidden">
          <UserMenu
            address={defaultWallet?.address}
            onLogin={login}
            onClickSosial={handleLinkSocial}
            handleLogout={handleLogout}
          />
        </div>

        {/* 
        Burger menu region
        */}
        <Drawer
          open={isOpen}
          onClose={() => setIsOpen(false)}
          disableEnforceFocus
          anchor="right"
        >
          <div className="relative flex flex-col gap-2 scrollbar-hidden pb-[48px] w-screen max-h-full overflow-y-auto h-full max-w-[320px] bg-[#242426] overflow-hidden border-l border-white/10 text-[#fff]">
            <div className="relative z-[1] flex flex-col justify-between h-full gap-2">
              <div className="px-[44px] pt-[44px]">
                <div className="flex mb-[50px] items-center">
                  <button onClick={() => setIsOpen(false)}>
                    <Logo text={20} width={14.7} height={23} isHover={true} />
                  </button>
                  <button className="ml-auto" onClick={() => setIsOpen(false)}>
                    <IoMdClose className="w-6 h-6 text-[#C9C9E2]" />
                  </button>
                </div>

                <Link to={ROUTES.CHAT}>
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring' }}
                    className={clsx(
                      'flex justify-start items-center gap-2 font-[400] text-[#C9C9E2]/50 leading-[16.2px] text-[18px] uppercase py-6 border-b border-white/10',
                      pathname.includes(chatRoute) && 'text-white'
                    )}
                    onClick={handleCloseWithDelay}
                    style={{ willChange }}
                  >
                    <motion.span whileTap={{ scale: 0.7 }}>Agent</motion.span>
                  </motion.div>
                </Link>
                <Link to={ROUTES.TERMINAL}>
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    style={{
                      willChange,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1) ',
                    }}
                    className={clsx('py-6 mobileDashboard w-full')}
                    onClick={handleCloseWithDelay}
                  >
                    <motion.div
                      whileTap={{ scale: 0.7 }}
                      className={clsx(
                        'flex justify-start items-center gap-2 font-[400] text-[#C9C9E2]/50 leading-[16.2px] text-[18px] uppercase',
                        pathname.includes(dashboardRoute) && 'text-white'
                      )}
                    >
                      Terminal
                    </motion.div>
                  </motion.div>
                </Link>
                <Link to={ROUTES.FAQ}>
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', delay: 0.3 }}
                    className={clsx(
                      'flex justify-start items-center gap-2 font-[400] text-[#C9C9E2]/50 leading-[16.2px] text-[18px] uppercase py-6 border-b border-white/10',
                      pathname.includes(faqRoute) && 'text-white'
                    )}
                    onClick={handleCloseWithDelay}
                    style={{ willChange }}
                  >
                    <motion.span whileTap={{ scale: 0.7 }}>FAQ</motion.span>
                  </motion.div>
                </Link>
              </div>
              <div>
                <div
                  className={clsx(
                    'px-[44px] border-t border-white/10',
                    user ? 'py-[36px]' : 'py-5'
                  )}
                >
                  {user && (
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: 'spring', delay: 0.3 }}
                      style={{ willChange }}
                    >
                      <CopyButton value={defaultWallet?.address || ''}>
                        <span className="text-[14px]">
                          {defaultWallet?.address ? (
                            formatAddress(defaultWallet?.address || '')
                          ) : (
                            <CgSpinnerAlt className="animate-spin" />
                          )}
                        </span>
                      </CopyButton>
                    </motion.div>
                  )}
                </div>

                <div className="px-[44px] flex flex-col gap-4">
                  {user && (
                    <>
                      <motion.button
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: 'spring', delay: 0.3 }}
                        style={{ willChange }}
                        disabled={isTwitterUnlinkDisabled}
                        onClick={() => handleLinkSocial(SocialsEnum.TWITTER)}
                        className="sidebar-twitter rounded-[10px] py-4 w-full flex items-center justify-center bg-[#fff] bg-opacity-[6%] font-radio font-[400] gap-[6px] text-[#C9C9E2]"
                      >
                        {!user?.twitter ? (
                          <span className="flex gap-1 items-center">
                            Connect
                            <X width={20} height={20} />
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <X width={20} height={20} />
                            {user.twitter.username}
                          </span>
                        )}
                      </motion.button>

                      <motion.button
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: 'spring', delay: 0.3 }}
                        style={{ willChange }}
                        disabled={isTelegramUnlinkDisabled}
                        onClick={() => handleLinkSocial(SocialsEnum.TELEGRAMM)}
                        className="sidebar-twitter rounded-[10px] py-4 w-full flex items-center justify-center bg-[#fff] bg-opacity-[6%] font-radio font-[400] gap-[6px] text-[#C9C9E2]"
                      >
                        {!user?.telegram ? (
                          <span className="flex gap-1 items-center">
                            Connect
                            <Telegram width={20} height={20} />
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Telegram width={20} height={20} />
                            {user.telegram.username}
                          </span>
                        )}
                      </motion.button>
                    </>
                  )}

                  <motion.button
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', delay: 0.3 }}
                    style={{ willChange }}
                    onClick={!user ? login : handleLogout}
                    className={clsx(
                      'p-3 mb-3 border-solid border-[.5px] font-radio border-white/10 text-center rounded-[10px]',
                      user ? 'text-[#E53C50]' : 'text-[#edca02]'
                    )}
                  >
                    {!user ? 'Log in' : 'Log out'}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      </motion.header>
    </>
  );
};
