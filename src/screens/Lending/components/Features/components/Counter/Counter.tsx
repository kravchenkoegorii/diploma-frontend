import CountUp from 'react-countup';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface ICounterProps {
  target: number;
  duration: number;
}

const formatNumber = (value: number): string => {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1) + 'B';
  }
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + 'M';
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(1) + 'K';
  }
  return value.toString();
};

export const Counter = ({ target, duration }: ICounterProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, {
    margin: '0px 0px -10% 0px',
    once: true,
  });

  return (
    <div ref={ref}>
      <CountUp
        start={0}
        end={inView ? target : 0}
        duration={duration}
        useEasing={true}
        formattingFn={formatNumber}
        separator=" "
        key={target}
      >
        {({ countUpRef }) => (
          <div className="w-[298px]">
            <span className="num_lg text-white" ref={countUpRef} />
          </div>
        )}
      </CountUp>
    </div>
  );
};
