import { useRef, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Footer } from '../Footer';
import { motion, useInView, useWillChange } from 'framer-motion';

const FAQs = [
  {
    title: 'What is Crypto App ?',
    description:
      'Crypto App is a dApp where AI actively supports users, improving their trading and yield-seeking journey by offering tailored suggestions to help boost their investment strategies. Crypto App is where words become on chain transactions.',
    id: 0,
  },
  {
    title: 'How does the app work ?',
    description:
      'The app connects to your wallet, evaluates your portfolio and market data, then generates investment strategies. You can review and approve the strategy, and the app will execute it on the blockchain.',
    id: 1,
  },
  {
    title: 'Why superchain ?',
    description:
      'Superchain is a scalable Ethereum Layer 2 blockchain with fast and low-cost transactions and top TVL.',
    id: 2,
  },
  {
    title: 'How is my wallet secured ?',
    description:
      'Your private keys are never shared with the app. All transactions are signed locally in your wallet, ensuring maximum security.',
    id: 3,
  },
  {
    title: 'How does the AI create investment strategies ?',
    description:
      'The AI analyzes your wallet portfolio, transaction history, and current market data from Droms DEX to identify optimal opportunities tailored to your needs.',
    id: 4,
  },
  {
    title: 'Can the AI make investments without my approval ?',
    description:
      'No, the AI only provides suggestions and waits for your approval to execute any transactions.',
    id: 5,
  },
  {
    title: 'Why Droms ?',
    description:
      'Droms are the backbone of Superchain`s ecosystem, driving liquidity and activity with its innovative design and unmatched performance. As the largest liquidity hub on Superchain.',
    id: 6,
  },
];

export const FAQ = () => {
  const [expanded, setExpanded] = useState<number | false>(false);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const faqRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(titleRef, {
    margin: '0px 0px 10% 0px',
    once: false,
  });

  const faqInView = useInView(faqRef, {
    margin: '0px 0px 10% 0px',
    once: false,
  });

  const footerInView = useInView(footerRef, {
    margin: '0px 0px 10% 0px',
    once: false,
  });

  const handleAccordionChange = (panelId: number) => {
    setExpanded(expanded === panelId ? false : panelId);
  };

  const willChange = useWillChange();

  return (
    <>
      <div className="absolute left-0 right-0 bottom-0 flex justify-center overflow-hidden z-[-1] w-full h-[1300px] bg-gradient-to-t from-[#FFC700] via-[#FFD700] to-[#FFFF]" />

      <div className="max-992px:mt-[60px] mt-[200px] max-992px:px-4 pb-[30px] font-radio overflow-hidden h-full">
        <motion.h1
          ref={titleRef}
          initial={{ opacity: 0, x: 0, y: 90 }}
          animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{
            delay: 0.2,
            duration: 0.5,
            ease: 'easeOut',
          }}
          style={{ willChange }}
          className="max-992px:text-[32px] text-[57px] text-center mb-[26px]"
        >
          FAQ
        </motion.h1>
        <motion.div
          ref={faqRef}
          initial={{ opacity: 0, x: 0, y: 90 }}
          animate={faqInView ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{
            delay: 0.2,
            duration: 0.5,
            ease: 'easeOut',
          }}
          style={{ willChange }}
          className="max-992px:mx-0 mx-[342px] lending-faq"
        >
          {FAQs?.map(faq => (
            <Accordion
              key={faq.id}
              expanded={expanded === faq.id}
              onChange={() => handleAccordionChange(faq.id)}
              className="bg-transparent group"
            >
              <AccordionSummary
                expandIcon={
                  <button className="border-solid max-992px:group-hover:opacity-100 group-hover:opacity-40 transition duration-300 relative max-992px:w-[0px] w-[50px] max-992px:h-[0px] h-[50px] border border-black rounded-full max-992px:p-[17px] p-[0px]">
                    <span
                      className={`max-992px:w-[15px] w-[25px] h-[2px] bg-black absolute transform transition-all duration-300 translate-y-1/2 max-992px:left-[29%] left-[25%] top-[45%]`}
                    ></span>
                    <span
                      className={`max-992px:w-[15px] w-[25px] h-[2px] bg-black absolute rotate-90 max-992px:right-[26%] right-[26%] max-992px:top-[49%] top-[47%] transform transition-all duration-300 ${
                        expanded === faq.id ? 'rotate-[0deg]' : ''
                      }`}
                    ></span>
                  </button>
                }
                aria-controls={`panel${faq.id}-content`}
                id={`panel${faq.id}-header`}
                style={{
                  transition: '0.3s',
                }}
                className="max-992px:group-hover:opacity-100 group-hover:opacity-40 transition-opacity duration-300 max-992px:text-[20px] text-[34px]"
              >
                {faq?.title}
              </AccordionSummary>
              <AccordionDetails className="max-w-[701px] max-992px:text-[14px] ">
                {faq?.description}
              </AccordionDetails>
            </Accordion>
          ))}
        </motion.div>
        <motion.div
          ref={footerRef}
          initial={{ opacity: 0, x: 0, y: 90 }}
          animate={footerInView ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{
            delay: 0.2,
            duration: 0.5,
            ease: 'easeOut',
          }}
          style={{ willChange }}
        >
          <Footer />
        </motion.div>
      </div>
    </>
  );
};

export default FAQ;
