import { topBackground } from '../../../../assets/images';
import 'swiper/swiper-bundle.css';
import { useEffect, useRef, useState } from 'react';
import { NewsSlide } from '../NewsSlide/NewsSlide';
import { motion, useInView, useWillChange } from 'framer-motion';
import Marquee from 'react-fast-marquee';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import useSWR from 'swr';
import { aerodromeService } from '@/services/aerodromeService';
import { ILendingPool } from '@/types/aerodrome';
import { addresses } from '../../constants';

export const TopBlock = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const willChange = useWillChange();

  const inView = useInView(titleRef, {
    once: false,
  });

  const { data: topPoolsData, isLoading } = useSWR(
    addresses.length ? ['/api/aerodrome/pools', addresses] : null,
    ([, addresses]) =>
      aerodromeService.getPoolsByAddresses(addresses.map(address => address)),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const totalSlides = addresses.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === totalSlides ? 1 : prev + 1));
    }, 6680);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{ background: `url(${topBackground}) no-repeat center/cover` }}
      className="topBackground relative flex flex-col justify-between max-992px:gap-[43px] gap-[50px] z-[1] max-992px:h-[100%] min-h-screen overflow-hidden"
    >
      <div className="flex flex-col justify-between max-992px:max-h-[700px] h-screen">
        <div className="flex flex-col items-start justify-end max-992px:pt-0 pt-[11%] py-6 px-10 mx-auto">
          <motion.h1
            ref={titleRef}
            initial={{ opacity: 0, y: -75 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: 0.1,
              duration: 0.3,
              ease: 'easeOut',
            }}
            style={{ willChange }}
            className="max-992px:text-[37px] text-[57px] font-radio text-center text-[#fff] mx-auto max-992px:mt-[160px] mb-[26px] max-992px:leading-[40px] leading-[62px]"
          >
            Taking-off from DROMS <br /> now takes one-click
          </motion.h1>
          <motion.h6
            ref={titleRef}
            initial={{ opacity: 0, y: -75 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: 0.2,
              duration: 0.3,
              ease: 'easeOut',
            }}
            style={{ willChange }}
            className="max-992px:text-[14px] text-center max-w-[523px] text-[19px] font-inter text-[#fff] mx-auto mb-[23px] leading-[20px]"
          >
            Optimize your trading routine, enhance strategies, and execute
            transactions, all in one seamless chat.
          </motion.h6>
          <div className="m-auto flex max-992px:gap-4 gap-[21px]">
            <Link
              to={ROUTES.CHAT}
              className="hover:opacity-70 transition duration-300"
            >
              <motion.button
                initial={{ opacity: 0, y: -75 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: 0.3,
                  duration: 0.3,
                  ease: 'easeOut',
                }}
                style={{ willChange }}
                className="px-[35px] max-374px:px-[30px] max-992px:text-[13px] py-[18px] bg-gradient-to-r from-white to-[#bbbbe1] rounded-[33px]"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
        <div className="flex max-992px:justify-center justify-between items-end max-992px:p-0 pr-[30px] max-992px:mb-0 mb-[55px]">
          <motion.div
            initial={{ opacity: 0, x: -75 }}
            animate={inView && !isLoading ? { opacity: 1, x: 0 } : {}}
            transition={{
              delay: 0.2,
              duration: 0.3,
              ease: 'easeOut',
            }}
            style={{ willChange }}
            className="max-992px:hidden swiper-top p-0 max-w-[500px]"
          >
            {!isLoading && (
              <>
                <div className="flex items-center justify-between font-radio mb-4 max-992px:px-4 pl-[30px] text-white">
                  <span className="text-[18px]">0{totalSlides}</span>
                  <div className="flex-1 mx-4 h-[2px] bg-[#FEE3BB] relative">
                    <div
                      className="pagination absolute top-0 right-0 w-full h-[3px] bg-white rotate-[180deg] transition-width ease-in-out duration-300"
                      style={{
                        backgroundColor: 'white',
                        width: `${(currentSlide / (totalSlides || 0)) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-[18px]">0{currentSlide}</span>
                </div>
                <div className="px-[30px]">
                  <Marquee pauseOnClick delay={1}>
                    {topPoolsData?.map((pool, index) => (
                      <NewsSlide
                        key={index}
                        image1={pool.token0}
                        image2={pool.token1}
                        title={pool.symbol}
                        poolType={pool.type}
                        apr={pool.apr}
                        tvl={pool.tvl}
                        chainId={pool.chainId}
                      />
                    ))}
                  </Marquee>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
      <div className="hidden max-992px:block swiper-top p-0 mb-[36px] lg:max-w-[500px]">
        <div className="flex items-center justify-between font-radio mb-4 max-992px:px-4 pl-[30px] text-white">
          <span className="text-[18px]">0{totalSlides}</span>
          <div className="flex-1 mx-4 h-[2px] bg-[#FEE3BB] relative">
            <div
              className="pagination absolute top-0 right-0 w-full h-[3px] bg-white rotate-[180deg]"
              style={{
                backgroundColor: 'white',
                width: `${(currentSlide / (totalSlides || 0)) * 100}%`,
              }}
            ></div>
          </div>
          <span className="text-[18px]">0{currentSlide}</span>
        </div>
        {!isLoading && (
          <Marquee pauseOnClick delay={1}>
            {topPoolsData?.map((pool: ILendingPool, index: number) => (
              <NewsSlide
                key={index}
                image1={pool.token0}
                image2={pool.token1}
                title={pool.symbol}
                poolType={pool.type}
                apr={pool.apr}
                tvl={pool.tvl}
                chainId={pool.chainId}
              />
            ))}
          </Marquee>
        )}
      </div>
    </div>
  );
};
