import { Link, useLocation } from 'react-router-dom';
import { logo } from '../../../../assets/images';
import clsx from 'clsx';
import { chatRoutes } from '@/constants/routes';

interface ILogoProps extends React.HTMLProps<HTMLAnchorElement> {
  width: number;
  height: number;
  text: number;
  hidden?: boolean;
  isHover: boolean;
}

export const Logo = ({
  width,
  height,
  text,
  isHover,
  hidden,
  ...props
}: ILogoProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isChatRoute = chatRoutes.includes(window.location.host);

  return (
    <Link
      to={'/'}
      className={clsx(
        isHover && 'hover:opacity-50 cursor-pointer',
        !isHomePage && !isChatRoute && 'pointer-events-none',
        'cursor-pointer transition duration-300 flex gap-[15.14px] items-center'
      )}
      aria-disabled={!isHomePage && !isChatRoute}
      {...props}
    >
      <img
        src={logo}
        alt="Logo"
        width={width}
        height={height}
        style={{ minWidth: width }}
      />
      <span
        style={{
          fontSize: `${text}px`,
        }}
        className={clsx(
          'font-[inter] font-[400] text-[#fff] leading-[18px]',
          hidden && 'max-992px:hidden'
        )}
      >
        Crypto App
      </span>
    </Link>
  );
};
