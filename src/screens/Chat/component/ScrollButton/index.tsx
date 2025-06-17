import { useEffect, useState } from 'react';
import {
  useObserveScrollPosition,
  useScrollToBottom,
  useSticky,
} from 'react-scroll-to-bottom';
import { useWindowSize } from 'usehooks-ts';

export const ScrollButton = () => {
  const { width } = useWindowSize();
  const scrollToBottom = useScrollToBottom();
  const [isSticky] = useSticky();
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(
    document.getElementById('chat-scroll-container')?.scrollHeight || 0
  );

  useEffect(() => {
    const scrollContainer = document.querySelector('.chat-scroll-container');
    if (scrollContainer) {
      setScrollHeight(scrollContainer.clientHeight);
    }
  }, [width]);

  useObserveScrollPosition(({ scrollTop }) => {
    setScrollTop(scrollTop);
  });

  const isShouldShowButton =
    scrollTop + scrollHeight > (width > 1440 ? 1500 : 700);

  if (isSticky || isShouldShowButton) {
    return null;
  }

  return (
    <button
      onClick={() => scrollToBottom()}
      className="absolute bottom-[20px] right-0 bg-[#000]/30 w-7 h-7 text-center rounded-full text-white hover:opacity-60 duration-300 cursor-pointer"
    >
      ↓
    </button>
  );
};
