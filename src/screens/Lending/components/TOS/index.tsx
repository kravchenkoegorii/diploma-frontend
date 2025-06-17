import TosPpBg from '@/assets/images/tosPpBg.png';
import { useEffect } from 'react';
import { FaRegFileLines } from 'react-icons/fa6';

export const TOS = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="min-1400px:overflow-hidden pt-8 max-1400px:p-4 h-full min-h-[100dvh] ">
      <div
        style={{
          backgroundImage: `url(${TosPpBg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
        className="fixed inset-0 z-[-999] min-h-[100dvh]"
      />

      <div className="max-w-1/2 flex items-center border-b justify-center gap-4 max-1400px:mx-0 mx-8">
        <FaRegFileLines className="max-992px:text-[30px] text-[50px] text-white" />
        <h1 className="font-radio text-white max-992px:text-[30px] text-[50px]">
          Terms and Conditions
        </h1>
      </div>

      <div className="mx-[auto] min-1400px:max-w-[50%] pb-8 text-gray-300 max-1400px:max-h-[calc(100svh-50px)] max-h-[calc(100svh-100px)] scrollbar-hidden overflow-y-auto">
        <section className="mt-7 max-992px:mt-3">
          <h2 className="text-[30px] font-bold text-white">
            1. Acceptance of Terms
          </h2>
          <p className="pl-3">
            By accessing and using this AI agent application ("Agent"), you
            agree to be bound by these Terms and Conditions ("Terms"). If you do
            not agree to these Terms, please do not use the Agent.
          </p>
        </section>

        <section className="mt-7">
          <h2 className="text-[30px] font-bold text-white">Background</h2>
          <p className="pl-3">
            Welcome to Crypto AI AI agent (the "AI agent", "Agent", "FF" , "we",
            "our", or "us"), an AI-powered assistant designed to Velodrome
            ecosystem DEX (Droms) features. The AI agent can suggest and promote
            potential transactions within the Droms ecosystem, but all
            interactions and decisions remain the sole responsibility of the
            user. The AI agent operates under the Crypto AI engine and interacts
            with Droms for decentralized exchange functionalities. This Terms of
            Service Agreement (the "Agreement") outlines the terms and
            conditions by which you may access and use the AI agent. You must
            read this Agreement carefully. By accessing or using the AI agent,
            you signify that you have read, understand, and agree to be bound by
            this Agreement in its entirety. If you do not agree, you are not
            authorized to access or use the AI agent and should not engage with
            it.
          </p>
        </section>

        <section className="mt-7">
          <h2 className="text-[30px] font-bold text-white">
            Third-Party Services and Content
          </h2>
          <p className="pl-3">
            In using this Website, You may view content or utilize services
            provided by third parties ("Third Parties"), including links to Web
            pages and services of such parties ("Third-Party Content"). We do
            not control, endorse, or adopt any Third-Party Content and will have
            no responsibility for Third-Party Content, including, without
            limitation, material that may be misleading, incomplete, erroneous,
            offensive, indecent, or otherwise objectionable in Your
            jurisdiction. Your business dealings and/or correspondence with such
            Third Parties is a matter solely between You and the Third Parties.
            We are not liable or responsible for any loss or damage of any sort
            incurred as a result of such dealings, and You understand that Your
            use of Third-Party Content and Your interactions with Third Parties
            are at Your own risk.
            <br />{' '}
            <span className="inline-block mt-4">
              We may employ third-party companies to facilitate the Wallet
              integration with Our Services:
            </span>
            <br /> For Prive, please consult their{' '}
            <a
              href="https://www.privy.io/privacy-policy"
              className="text-[#4287f5] underline"
            >
              privacy policy.
              <br />
            </a>
            For WalletConnect, please consult{' '}
            <a
              href="https://walletconnect.network/privacy"
              className="text-[#4287f5] underline"
            >
              their legal agreements
            </a>
            .
          </p>
        </section>

        <section className="mt-7">
          <h2 className="text-[30px] font-bold text-white">
            Intellectual Property Rights
          </h2>
          <p className="pl-3">
            The Crypto App Website and its entire contents, features, and
            functionality (including but not limited to all information,
            software, text, displays, images, video, and audio, and the design,
            selection, and arrangement thereof) are owned by Crypto App and its
            licensors and affiliates and are protected by United States and
            international copyright, trademark, trade dress, patent, trade
            secret, and other intellectual property or proprietary rights laws.
            The Crypto App name and all related names, logos, product and
            service names, designs, and slogans are trademarks of Crypto App or
            its licensors or affiliates. Moreover, all intellectual property
            rights associated with Third Parties and Third-Party Content
            referenced on or offered through the Crypto App Website are owned by
            the respective entities offering such services. You agree not to use
            any Crypto App or Third-Party intellectual property without prior
            written permission from Crypto App or such Third Party. You are
            herein granted a limited, revocable, and nonexclusive right to post
            excerpts from or create a hyperlink to the Crypto App Website,
            provided that full and clear credit is given to Us with appropriate
            and specific direction to the original content, and provided such
            hyperlink is not related to any portrayal of Crypto App or the
            Website in any false, misleading, derogatory, or otherwise offensive
            manner.
          </p>
        </section>

        <div className="pl-8">
          <section className="mt-7 pb-5 border-b border-white/50">
            <h2 className="text-[25px] font-bold text-white">
              1.1. Nature of the Service
            </h2>
            <ul className="list-disc list-inside flex flex-col gap-2">
              <li>
                The AI agent is an AI-powered assistant providing educational
                content and discussions related to decentralized finance (DeFi),
                tokens, and Droms DEX features.
              </li>
              <li>
                The AI agent does not provide financial, investment, legal, or
                tax advice. Any insights or recommendations the AI agent makes
                are purely informational, and users should conduct their own
                research before engaging in transactions.
              </li>
              <li>
                The AI agent may prompt users to explore or execute transactions
                on Droms DEX, but it does not directly perform or process
                transactions. Users are responsible for executing any
                transactions via their own wallets.
              </li>
              <li>
                To access Droms DEX and perform transactions, users must use
                third-party non-custodial wallets. Their respective terms and
                conditions govern the relationship with such wallets.
              </li>
            </ul>
          </section>

          <section className="mt-7 pb-5 border-b border-white/50">
            <h2 className="text-[25px] font-bold text-white">
              1.2. Risks and Disclaimers
            </h2>
            <ul className="list-disc list-inside flex flex-col gap-2 pl-3">
              <span className="text-[20px] font-semibold">
                1.2.1 Your use of the AI agent and any transactions made on
                Droms DEX involve various risks, including but not limited to:
              </span>
              <li>Smart contract vulnerabilities.</li>
              <li>Market fluctuations affecting token values.</li>
              <li>Impermanent loss in liquidity provision.</li>
              <li>
                Risks associated with decentralized exchanges and DeFi
                protocols.
              </li>
            </ul>
            <div className="pl-3 mt-3">
              <p className=" text-[20px] font-semibold">
                1.2.2. The AI agent does not own, control, or operate Droms DEX.
                All transactions and interactions with Droms are governed by its
                own terms and policies. Users should review documentation of
                Droms before engaging in any transactions.
              </p>
              <p className="mt-3 text-[20px] font-semibold">
                1.2.3. THE AI AGENT IS PROVIDED "AS IS" WITHOUT WARRANTIES OF
                ANY KIND. WE DISCLAIM ALL LIABILITY FOR ANY LOSSES, DAMAGES, OR
                CLAIMS ARISING FROM YOUR USE OF THE AI AGENT OR DROMS DEX.
              </p>
            </div>
          </section>

          <section className="mt-7 pb-5 border-b border-white/50">
            <h2 className="text-[25px] font-bold text-white">
              1.3. User Responsibilities
            </h2>
            <div className="flex flex-col gap-3 pl-3">
              <p className="text-[20px]">
                1.3.1. Users are responsible for their own due diligence and
                decision-making regarding token transactions and liquidity
                provision.
              </p>
              <p className="text-[20px]">
                1.3.2. Users must comply with all applicable laws and
                regulations regarding DeFi transactions, including but not
                limited to anti-money laundering (AML) and know-your-customer
                (KYC) requirements.
              </p>
              <p className="text-[20px]">
                1.3.3. The AI agent does not store, manage, or have access to
                users' private keys, wallets, or funds. Users are solely
                responsible for securing their own assets.
              </p>
            </div>
          </section>

          <section className="mt-7 pb-5 border-b border-white/50">
            <h2 className="text-[25px] font-bold text-white">
              1.4. Limitation of Liability
            </h2>
            <div>
              <p className="text-[20px] mb-4 pl-3">
                1.4.1. To the maximum extent permitted by law, the AI agent, its
                developers, affiliates, and operators shall not be liable for
                any:
              </p>
              <ul className="list-disc list-inside pl-3 mb-4">
                <li>Direct, indirect, incidental, or consequential damages.</li>
                <li>Loss of assets, profits, or data.</li>
                <li>
                  Security breaches or unauthorized access to user wallets.
                </li>
              </ul>
              <p className="text-[20px] pl-3">
                1.4.2. Users waive all rights to claims in any jurisdiction
                related to their use of the AI agent and transactions on Droms
                DEX.
              </p>
            </div>
          </section>

          <section className="mt-7 pb-5 border-b border-white/50">
            <h2 className="text-[25px] font-bold text-white">
              1.5. Amendments and Updates
            </h2>
            <p className="text-[20px] pl-3 mb-4">
              1.5.1. We reserve the right to modify this Agreement at any time.
              Users will be notified of changes by an updated version of this
              Agreement being posted at the same link.
            </p>
            <p className="text-[20px] pl-3">
              1.5.2. Continued use of the AI agent after modifications
              constitutes acceptance of the updated Agreement. If you do not
              accept the modifications, you must discontinue use immediately.
            </p>
          </section>

          <section className="mt-7 mb-5 pb-5 border-b border-white/50">
            <h2 className="text-[25px] font-bold text-white">
              1.6. Governing Law and Dispute Resolution
            </h2>
            <p className="text-[20px] pl-3 mb-4">
              1.6.1. This Agreement shall be governed by and construed following
              the laws of the applicable jurisdiction.
            </p>
            <p className="text-[20px] pl-3">
              1.6.2. Any disputes arising from this Agreement shall be resolved
              through binding arbitration, and users waive the right to
              participate in class-action lawsuits.
            </p>
          </section>
          <p>
            By using FF, you acknowledge that you have read and understood this
            Agreement and agree to abide by its terms.
          </p>
        </div>

        <section className="mt-7">
          <h2 className="text-[30px] font-bold text-white">
            2. Description of Service
          </h2>
          <div className="pl-5 mt-3">
            <p>The FF is a chat-based interface that:</p>
            <ul className="list-disc list-inside mt-2 flex flex-col gap-2 pl-3">
              <li>Facilitates token swaps through the Droms platform.</li>
              <li>Provides information about Droms.</li>
              <li>
                Enables interaction with features of Droms through chat
                commands.
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-[30px] font-bold text-white">
            3. User Registration and Account
          </h2>
          <div className="pl-5 mt-3 font-semibold text-[20px]">
            <p>
              3.1.1. You may need to connect your wallet to use certain features
              of the Agent.
            </p>
            <p>
              3.1.2. You are responsible for maintaining the confidentiality of
              your wallet credentials and all activities that occur under your
              account.
            </p>
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-[30px] font-bold text-white">
            4. Token Swaps and Transactions
          </h2>
          <div className="pl-5">
            <p className="text-[20px] text-white mt-4 font-semibold">
              4.1.1. All token swaps are facilitated through the Droms platform.
            </p>
            <div className="text-[20px] text-white mt-4 font-semibold">
              4.1.2. You acknowledge that:
              <ul className="text-[16px] mt-2 font-normal list-disc list-inside pl-3 flex flex-col gap-2">
                <li>Cryptocurrency transactions are irreversible</li>
                <li>Market prices are volatile and can change rapidly</li>
                <li>
                  You are responsible for verifying all transaction details
                  before confirmation
                </li>
              </ul>
            </div>
            <div className="text-[20px] text-white mt-4 font-semibold">
              4.1.3. We are not responsible for any losses incurred due to:
              <ul className="text-[16px] font-normal mt-2 list-disc list-inside pl-3 flex flex-col gap-2">
                <li>User error</li>
                <li>Network delays</li>
                <li>Market volatility</li>
                <li>Smart contract vulnerabilities</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-[30px] font-bold text-white">5. User Conduct</h2>
          <div className="pl-5">
            <p className="text-white mt-4">You agree not to:</p>
            <div className="text-[20px] text-white mt-4">
              <ul className="text-[16px] mt-2 list-disc list-inside pl-3 flex flex-col gap-2">
                <li>Use the Agent for any illegal purposes</li>
                <li>
                  Attempt to reverse engineer or bypass the Agent’s security
                  measures
                </li>
                <li>Interfere with other users' access to the Agent</li>
                <li>Submit false or misleading information</li>
                <li>
                  Automate interactions with the Agent without explicit
                  permission
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-[30px] font-bold text-white">
            6. Intellectual Property
          </h2>
          <p className="text-[20px] pl-3 mt-4 font-semibold">
            6.1.1. The Agent, including its code, design, and content, is
            protected by intellectual property rights.
          </p>
          <p className="text-[20px] pl-3 mt-4 font-semibold">
            6.1.2. You may not copy, modify, distribute, or create derivative
            works based on the Agent without explicit permission.
          </p>
        </section>

        <section className="mt-7">
          <h2 className="text-[30px] font-bold text-white">
            7. Disclaimer of Warranties
          </h2>
          <p className="text-[20px] pl-3 mt-4 font-semibold">
            7.1.1. The Agent is provided "as is" without any warranties, express
            or implied.
          </p>
          <p className="text-[20px] pl-3 mt-4 font-semibold">
            7.1.2. We do not guarantee that:
          </p>
          <ul className="list-disc list-inside flex flex-col gap-2 mt-2 pl-5">
            <li>The Agent will be available at all times</li>
            <li>The Agent will be error-free</li>
            <li>The information provided will be accurate</li>
            <li>The token swap features will be available continuously</li>
          </ul>
        </section>

        <section className="mt-7">
          <h2 className="text-[30px] font-bold text-white">
            8. Limitation of Liability
          </h2>
          <p className="text-[20px] pl-3 mt-4 font-semibold">
            8.1.1. We shall not be liable for any indirect, incidental, special,
            or consequential damages.
          </p>
          <p className="text-[20px] pl-3 mt-4 font-semibold">
            8.1.2. Our total liability for any claims shall not exceed the
            amount you paid to use the Agent (if applicable).
          </p>
        </section>

        <section className="mt-7">
          <h2 className="text-[30px] font-bold text-white">
            9. Changes to Terms
          </h2>
          <p className="text-[20px] pl-3 mt-4 font-semibold">
            9.1.1. We reserve the right to modify these Terms at any time.
          </p>
          <p className="text-[20px] pl-3 mt-4 font-semibold">
            9.1.2. Continued use of the Agent after changes constitutes
            acceptance of the new Terms.
          </p>
        </section>

        <section className="mt-7">
          <h2 className="text-[30px] font-bold text-white">
            10. Governing Law
          </h2>
          <p className="pl-3">
            These Terms shall be governed by and construed following the laws of
            Portugal.
          </p>
        </section>

        <section className="mt-7">
          <h2 className="text-[30px] font-bold text-white">
            11. Modification of this Agreement
          </h2>
          <p className="pl-3">
            <p>
              We reserve the right, in our sole discretion, to modify this
              Agreement from time to time. If we make any modifications, we will
              notify you by reuploading a current version of the Agreement at:{' '}
              <a
                href="https://docs.google.com/document/d/e/2PACX-1vQtap4VWbyhUOioJvcI4XjfgUqc6uRrKELWD_gk-MMF0Er8VdqOpFDgSvZagxfcCaW04Y64-JLCjfLC/pub"
                className="text-[#4287f5] underline"
              >
                Agreement.
              </a>
            </p>
            <p className="mt-4">
              All modifications will be effective when they are posted, and your
              continued accessing or use of the Interface will serve as
              confirmation of your acceptance of those modifications. If you do
              not agree with any modifications to this Agreement, you must
              immediately stop accessing and using the Interface.
            </p>
          </p>
        </section>

        <section className="mt-7">
          <h2 className="text-[30px] font-bold text-white">
            12. Contact Information
          </h2>
          <p className="pl-3 italic mt-3">support@crypto.app.now</p>
        </section>
      </div>
    </div>
  );
};
