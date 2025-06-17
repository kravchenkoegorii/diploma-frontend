import { useEffect } from 'react';
import { MdOutlinePrivacyTip } from 'react-icons/md';
import TosPpBg from '@/assets/images/tosPpBg.png';

export const PP = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  return (
    <div className="">
      <div
        style={{
          backgroundImage: `url(${TosPpBg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
        className="fixed inset-0 z-[-999] min-h-screen"
      />

      <div className="mx-auto max-1400px:p-4 p-8 pb-0 text-white">
        <div className="flex justify-center items-center border-b gap-4 mb-2 pb-1 text-[50px]">
          <MdOutlinePrivacyTip className="max-992px:text-[30px] text-[50px]" />
          <h1 className="font-radio max-992px:text-[30px] text-[50px]">
            Privacy Policy
          </h1>
        </div>

        <div className="max-1400px:max-w-full max-w-[50%] mx-auto z-[-1] pb-8 space-y-6 max-1400px:max-h-[calc(100svh-50px)] max-h-[calc(100svh-100px)] scrollbar-hidden overflow-y-auto">
          <section>
            <h2 className="text-[30px] font-bold">1. Introduction</h2>
            <p className="pl-3">
              This Privacy Policy explains how we collect, use, and protect your
              personal information when you use our AI agent application
              ("Agent") that interfaces with the Droms platform.
            </p>
          </section>

          <section>
            <h1 className="text-[30px] font-bold">2. Information We Collect</h1>
            <p className="text-xl font-semibold mt-2 pl-3">
              2.1.1. Information You Provide
            </p>
            <ul className="pl-6 list-inside list-disc">
              <li>Wallet addresses</li>
              <li>Transaction history</li>
              <li>Chat messages and commands</li>
              <li>
                Any other information you voluntarily provide through the Agent
              </li>
            </ul>

            <p className="text-xl font-semibold mt-4 pl-3">
              2.1.2. Automatically Collected Information
            </p>
            <ul className="pl-6 list-inside list-disc">
              <li>Usage data</li>
              <li>Agent interaction timestamps</li>
              <li>Technical information about your device</li>
              <li>Network information</li>
              <li>Token balances</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[30px] font-bold">
              3. How We Use Your Information
            </h2>
            <p className="pl-3 my-4">We use your information to:</p>
            <ul className="pl-6 list-disc list-inside">
              <li>Process your token swap requests</li>
              <li>Provide information about Droms</li>
              <li>Improve the Agent’s functionality</li>
              <li>Maintain security</li>
              <li>Comply with legal obligations</li>
              <li>Analyze usage patterns to enhance user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[30px] font-bold">4. Information Sharing</h2>

            <h3 className="text-xl font-semibold mt-2 pl-3">
              4.1.1. We may share your information with:
            </h3>
            <ul className="pl-6 list-disc list-inside mt-2">
              <li>Droms platform (for transaction processing)</li>
              <li>Service providers who assist in operating the Agent</li>
              <li>Law enforcement when required by law</li>
            </ul>

            <h3 className="text-xl font-semibold mt-3 pl-3">
              4.1.2. We do not sell your personal information to third parties.
            </h3>
          </section>

          <section>
            <h2 className="text-[30px] font-bold">5. Data Security</h2>
            <h3 className="text-xl font-semibold mt-3 pl-3">
              5.1. We implement appropriate technical and organizational
              measures to protect your information.
            </h3>
            <h3 className="text-xl font-semibold mt-3 pl-3">
              5.2. However, no internet transmission is completely secure. We
              cannot guarantee the security of information transmitted through
              the Agent.
            </h3>
          </section>

          <section>
            <h2 className="text-[30px] font-bold">6. Your Rights</h2>
            <p className="pl-3 mt-3">You have the right to:</p>
            <ul className="pl-6 list-inside list-disc mt-3">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Withdraw consent</li>
              <li>Request data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[30px] font-bold">7. Data Retention</h2>
            <p className="pl-3 mt-3">
              We retain your information for as long as:
            </p>
            <ul className="pl-6 list-inside mt-3 list-disc">
              <li>Your account is active</li>
              <li>Needed to provide our services</li>
              <li>Required by law</li>
              <li>Necessary for legitimate business purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[30px] font-bold">8. Children's Privacy</h2>
            <p className="pl-3">
              The Agent is not intended for users under 18 years of age. We do
              not knowingly collect information from children.
            </p>
          </section>

          <section>
            <h2 className="text-[30px] font-bold">
              9. Changes to Privacy Policy
            </h2>
            <p className="text-xl font-semibold mt-3 pl-3">
              9.1. We may update this Privacy Policy from time to time.
            </p>
            <p className="text-xl font-semibold mt-3 pl-3">
              9.2. We will notify users of any material changes through the
              Agent or other means.
            </p>
          </section>

          <section>
            <h2 className="text-[30px] font-bold">
              10. International Data Transfers
            </h2>
            <p className="pl-3 mt-3">
              Your information may be transferred to and processed in countries
              other than your own. We ensure appropriate safeguards are in place
              for such transfers.
            </p>
          </section>

          <section>
            <h2 className="text-[30px] font-bold">11. Contact Us</h2>
            <p className="pl-3 mt-3">
              For privacy-related questions or concerns, please contact [Your
              Contact Information].
            </p>
          </section>

          <section>
            <h2 className="text-[29px] font-bold">
              12. Legal Basis for Processing (for EU/EEA users)
            </h2>
            <p className="pl-3 mt-3">We process your information based on:</p>
            <ul className="pl-6 mt-3 list-inside list-disc">
              <li>Performance of contract</li>
              <li>Legal obligations</li>
              <li>Legitimate interests</li>
              <li>Your consent</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
