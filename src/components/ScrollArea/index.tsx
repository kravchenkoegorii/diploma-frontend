import {
  Root as ScrollAreaRoot,
  ScrollAreaProps,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from '@radix-ui/react-scroll-area';
import cn from 'classnames';
import { ReactNode } from 'react';

interface ScrollAreaExtendedProps extends ScrollAreaProps {
  children?: ReactNode;
  viewPortClassName?: string;
  scrollbarClassName?: string;
  orientation?: 'vertical' | 'horizontal';
  thumbClassName?: string;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
}

export function ScrollArea({
  children,
  className,
  viewPortClassName,
  scrollbarClassName,
  thumbClassName,
  orientation = 'vertical',
  onScroll,
  ...props
}: ScrollAreaExtendedProps) {
  return (
    <ScrollAreaRoot
      type="auto"
      className={cn('overflow-hidden', className)}
      {...props}
    >
      <ScrollAreaViewport
        className={cn(' h-full overflow-auto', viewPortClassName)}
        onScroll={onScroll}
      >
        {children}
      </ScrollAreaViewport>
      <ScrollAreaScrollbar
        className={cn('w-[3px] rounded-lg bg-white-4', scrollbarClassName)}
        orientation={orientation}
      >
        <ScrollAreaThumb
          className={cn(
            'w-[3px] rounded-lg bg-white-8 cursor-pointer',
            thumbClassName
          )}
        />
      </ScrollAreaScrollbar>
    </ScrollAreaRoot>
  );
}
