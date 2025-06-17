import { usePrivy } from '@privy-io/react-auth';
import clsx from 'clsx';
import {
  AnchorHTMLAttributes,
  Children,
  FC,
  isValidElement,
  memo,
  ReactNode,
  useMemo,
} from 'react';

import { IoMdArrowDown } from 'react-icons/io';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { useShallow } from 'zustand/shallow';
import { aiAvatar } from '../../../../assets/images';
import { useChatsStore } from '../../../../stores/chats';
import { EActionType, ESenderType, IMessage } from '../../../../types/chat';
import { MessageCodeBlock } from '../MessageCodeblock';
import './styles.css';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { mathAdapter } from '@/utilities/mathAdapter';
import { motion } from 'framer-motion';

export interface IMessageProps {
  message: IMessage;
}

export const Message: FC<IMessageProps> = memo(
  ({ message }) => {
    const { user, login } = usePrivy();
    const [isSubmitting] = useChatsStore(useShallow(s => [s.isSubmitting]));
    const content = useMemo(() => {
      const content = message.content;
      if (
        content.includes('\\\\text') ||
        content.includes('\\\\times') ||
        content.includes('\\\\frac')
      ) {
        return mathAdapter(content);
      } else {
        return content
          .replace(/\\\\n/g, '\n')
          .replace(/\\n/g, '\n')
          .replace(/\n/g, '  \n')
          .replace(/\n-\*\*/g, '\n- **')
          .replace(/\\"/g, '"')
          .replace(/Total_/g, 'Total ')
          .replace(/Withdraw_/g, 'Withdraw ')
          .replace(/Deposit_/g, 'Deposit ')
          .replace(/\\*\$/g, '\uFF04');
      }
    }, [message.content]);

    const isShouldAnimate =
      Date.now() - new Date(message.createdAt).getTime() < 700;

    return (
      <div className="flex flex-col items-start gap-1" key={message.id}>
        <div
          className={clsx(
            'flex items-center gap-4 text-xs text-white',
            message.senderType === ESenderType.USER &&
              'ml-auto min-1400px:-mr-10',
            message.senderType === ESenderType.AI && '-ml-10'
          )}
        >
          {message.senderType === ESenderType.AI && (
            <img src={aiAvatar} width={22} height={22} alt="" />
          )}
          {message.senderType === ESenderType.AI && (
            <span className="ml-0.5">Crypto AI</span>
          )}
          {message.senderType === ESenderType.USER && <span>You</span>}
        </div>
        <div
          className={clsx(
            'text-white max-992px:max-w-[80%] max-w-[520px]',
            message.senderType === ESenderType.USER
              ? 'ml-auto min-1400px:-mr-10 text-left bg-white/10 px-5 pb-2 pt-2 rounded-3xl'
              : 'mr-auto text-left'
          )}
        >
          {message.senderType === ESenderType.AI && (
            <motion.div
              initial={isShouldAnimate ? { opacity: 0 } : { opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <ReactMarkdown
                key={message.id}
                className={clsx(
                  'message-item w-full prose [&_table]:overflow-auto [&_table]:block dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 min-w-full space-y-6 break-words'
                )}
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={{
                  h1({ children }) {
                    return (
                      <h1 className="text-3xl font-bold mb-4">{children}</h1>
                    );
                  },
                  h2({ children }) {
                    return (
                      <h2 className="text-2xl font-bold mb-3">{children}</h2>
                    );
                  },
                  h3({ children }) {
                    return (
                      <h3 className="text-xl font-bold mb-2">{children}</h3>
                    );
                  },
                  h4({ children }) {
                    return (
                      <h4 className="text-lg font-bold mb-1">{children}</h4>
                    );
                  },
                  h5({ children }) {
                    return (
                      <h5 className="text-base font-bold mb-1">{children}</h5>
                    );
                  },
                  h6({ children }) {
                    return (
                      <h6 className="text-sm font-bold mb-1">{children}</h6>
                    );
                  },
                  p({ children }) {
                    return <p className="mb-2 last:mb-0">{children}</p>;
                  },
                  img() {
                    return null;
                  },
                  a({
                    children,
                    ...props
                  }: AnchorHTMLAttributes<HTMLAnchorElement>) {
                    return (
                      <a
                        {...props}
                        className="underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    );
                  },
                  code({ className, children, ...props }) {
                    const childArray = Children.toArray(children);
                    const firstChild = childArray[0] as React.ReactElement;
                    const firstChildAsString = isValidElement(firstChild)
                      ? (
                          firstChild as React.ReactElement<{
                            children: ReactNode;
                          }>
                        ).props.children
                      : firstChild;

                    if (firstChildAsString === '▍') {
                      return (
                        <span className="mt-1 animate-pulse cursor-default">
                          ▍
                        </span>
                      );
                    }

                    if (typeof firstChildAsString === 'string') {
                      childArray[0] = firstChildAsString.replace('`▍`', '▍');
                    }

                    const match = /language-(\w+)/.exec(className || '');

                    if (
                      typeof firstChildAsString === 'string' &&
                      !firstChildAsString.includes('\n')
                    ) {
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      const { ref, ...restProps } = props;
                      return (
                        <code className={className} {...restProps}>
                          {childArray}
                        </code>
                      );
                    }

                    return (
                      <MessageCodeBlock
                        key={Math.random()}
                        language={(match && match[1]) || ''}
                        value={String(childArray).replace(/\n$/, '')}
                        {...props}
                      />
                    );
                  },
                  ul({ children }) {
                    return <ul className="list-disc pl-6">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="list-decimal pl-6">{children}</ol>;
                  },
                  li({ children }) {
                    return <li className="mb-2">{children}</li>;
                  },
                  table({ children }) {
                    return (
                      <table className="table-auto border-collapse">
                        {children}
                      </table>
                    );
                  },
                  thead({ children }) {
                    return <thead>{children}</thead>;
                  },
                  tbody({ children }) {
                    return <tbody>{children}</tbody>;
                  },
                  tr({ children }) {
                    return <tr className="border">{children}</tr>;
                  },
                  th({ children }) {
                    return (
                      <th className="font-bold border px-4 py-2">{children}</th>
                    );
                  },
                  td({ children }) {
                    return <td className="border px-4 py-2">{children}</td>;
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </motion.div>
          )}
          {message.senderType === 'USER' && (
            <pre className="prose [&_table]:overflow-auto [&_table]:block dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-[500px] space-y-6 break-words font-radio whitespace-pre-wrap">
              {message.content.replace(/\n/g, '  \n')}
            </pre>
          )}
        </div>
        {message.actionType === EActionType.LOGIN && (
          <button
            disabled={isSubmitting || !!user}
            className="max-w-[80%] flex items-center gap-[10px] mr-auto bg-[#17171729] text-white grow px-4 py-[9px] border-[0.5px] border-solid border-[#FFFFFF1A] rounded-[16px] transition-opacity duration-300 hover:opacity-75 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            onClick={login}
          >
            Log In <IoMdArrowDown className="text-white rotate-[-90deg]" />
          </button>
        )}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.senderType === nextProps.message.senderType &&
    prevProps.message.actionType === nextProps.message.actionType &&
    prevProps.message.createdAt === nextProps.message.createdAt &&
    prevProps.message.updatedAt === nextProps.message.updatedAt
);
