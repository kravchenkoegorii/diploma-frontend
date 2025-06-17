import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useEffect, useState } from 'react';
import { useWindowSize } from 'usehooks-ts';

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
      'The AI analyzes your wallet portfolio, transaction history, and current market data from Aerodrome DEX to identify optimal opportunities tailored to your needs.',
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
  {
    title: 'How to interact ?',
    description: (
      <ul className="list-disc pl-3 flex flex-col gap-1">
        <li>Log in (email, Google, or wallet)</li>
        <li>Ask Crypto AI your question</li>
        <li>Review the details</li>
        <li>Confirm the swap</li>
        <li>Get your result!</li>
      </ul>
    ),
    id: 7,
  },
];

const FAQ = () => {
  const [expanded, setExpanded] = useState<number | false>(false);
  const { width } = useWindowSize();

  const handleAccordionChange = (panelId: number) => {
    setExpanded(expanded === panelId ? false : panelId);
  };

  useEffect(() => {
    if (width > 992) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [width]);

  return (
    <div className="text-white mx-auto max-992px:mt-[130px] max-992px:p-[16px] mb-3 max-992px:pt-[0px]">
      <div className="text-[25px] mb-5">Frequently asked questions</div>
      <div className="flex flex-col gap-3 max-992px:max-h-[63.5vh] overflow-y-auto scrollbar-hidden mb-5">
        {FAQs?.map(faq => (
          <Accordion
            key={faq.id}
            expanded={expanded === faq.id}
            onChange={() => handleAccordionChange(faq.id)}
            style={{ borderRadius: '23px' }}
            className="bg-[rgb(23,23,23)] border border-white/30 group px-4"
          >
            <AccordionSummary
              expandIcon={
                <button className="max-992px:group-hover:opacity-100 group-hover:opacity-40 transition duration-300 relative max-992px:w-[0px] w-[50px] max-992px:h-[0px] h-[50px] border border-black rounded-[50%] max-992px:p-[17px] p-[8px]">
                  <span
                    className={`max-992px:w-[15px] w-[25px] h-[2px] bg-[#ccc5ba] absolute transform transition-all duration-300 translate-y-1/2 max-992px:left-[29%] left-[25%] top-[45%]`}
                  ></span>
                  <span
                    className={`max-992px:w-[15px] w-[25px] h-[2px] bg-[#ccc5ba] absolute rotate-90 max-992px:right-[26%] right-[36%] max-992px:top-[49%] top-[46%] transform transition-all duration-300 ${
                      expanded === faq.id ? 'rotate-[0deg]' : ''
                    }`}
                  ></span>
                </button>
              }
              aria-controls={`panel${faq.id}-content`}
              id={`panel${faq.id}-header`}
              style={{
                transition: '0.3s',
                color: '#ccc5ba',
              }}
              className="max-992px:group-hover:opacity-100 group-hover:opacity-40 transition-opacity duration-300 max-992px:text-[20px] text-[20px]"
            >
              {faq?.title}
            </AccordionSummary>
            <AccordionDetails className="max-w-[701px] max-992px:text-[14px] text-[#fff] ">
              {faq?.description}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
