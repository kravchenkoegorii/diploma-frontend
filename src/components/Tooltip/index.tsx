import { FC, useEffect, useState } from 'react';
import {
  Root as TooltipRoot,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import {
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
  PopoverTriggerProps,
  Root,
} from '@radix-ui/react-popover';
import { AnimatePresence, motion } from 'framer-motion';
import { useWindowSize } from 'usehooks-ts';

interface ITooltipProps {
  children?: React.ReactNode;
  tooltip: React.ReactNode;
  triggerProps?: PopoverTriggerProps;
}

export const Tooltip: FC<ITooltipProps> = ({
  children,
  tooltip,
  triggerProps,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width < 992;

  useEffect(() => {
    if (!isMobile || !isOpen) return;

    const handleScroll = () => setIsOpen(false);

    window.addEventListener('scroll', handleScroll, { passive: true });

    const transactionsContainer = document.querySelector(
      '.infinite-scroll-component'
    );
    transactionsContainer?.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      transactionsContainer?.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen, isMobile]);

  if (isMobile) {
    return (
      <Root open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger {...triggerProps}>{children}</PopoverTrigger>
        <AnimatePresence>
          {isOpen && (
            <PopoverPortal forceMount>
              <PopoverContent
                sideOffset={8}
                side="bottom"
                align="center"
                asChild
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="rounded-full text-center max-992px:max-w-[90vw] border-[0.5px] border-solid border-white/10 bg-[#000] text-white max-992px:px-[8px] px-[15px] py-2.5 text-sm max-992px:text-[11px] leading-none text-violet11 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] outline-none z-[9999] mb-2"
                >
                  {tooltip}
                </motion.div>
              </PopoverContent>
            </PopoverPortal>
          )}
        </AnimatePresence>
      </Root>
    );
  }

  return (
    <TooltipProvider>
      <TooltipRoot delayDuration={10} open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger>{children}</TooltipTrigger>
        <AnimatePresence>
          {isOpen && (
            <TooltipPortal forceMount>
              <TooltipContent
                sideOffset={8}
                side="bottom"
                align="center"
                asChild
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="rounded-full text-center w-max max-992px:max-w-[50vw] border-[0.5px] border-solid border-white/10 bg-[#000] text-white max-992px:px-[8px] px-[15px] py-2.5 text-sm leading-none text-violet11 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] outline-none z-[9999] mb-2"
                >
                  {tooltip}
                </motion.div>
              </TooltipContent>
            </TooltipPortal>
          )}
        </AnimatePresence>
      </TooltipRoot>
    </TooltipProvider>
  );
};
