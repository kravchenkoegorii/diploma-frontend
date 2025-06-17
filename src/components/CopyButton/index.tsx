import { MouseEvent, useState } from 'react';
import copy from 'clipboard-copy';
import { motion } from 'framer-motion';
import { CopyIcon } from '@/assets/icons/CopyIcon';
import { CopiedIcon } from '@/assets/icons/CopiedIcon';

interface ICopyButtonProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: string;
}

export const CopyButton = ({ value, ...props }: ICopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    copy(value);

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  };

  return (
    <span
      onClick={handleClick}
      {...props}
      className="cursor-pointer group-hover:opacity-70 transition duration-300 flex items-center gap-2"
    >
      <motion.div
        key={isCopied ? 'copied' : 'copy'}
        initial={isCopied && { opacity: 0, scale: 0.5 }}
        animate={isCopied && { opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {isCopied ? <CopiedIcon /> : <CopyIcon />}
      </motion.div>

      {props.children}
    </span>
  );
};
