import { LogInButton } from '@/components/LogInButton';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import { CgSpinnerAlt } from 'react-icons/cg';
import { Address } from 'viem';
import { useShallow } from 'zustand/shallow';
import { useUserStore } from '../../stores/user';
import { BalanceChart } from './components/BalanceChart';
import { BalanceHistory } from './components/BalanceHistory';
import { Pools } from './components/Pools';
import { Summary } from './components/Summary';
import { TransactionList } from './components/TxsHistory';
import { SocialButtons } from './components/SocialButtons';
import './styles.css';
import { NetworkSelect } from './components/NetworksSelect';

const Dashboard = () => {
  const { user, authenticated, ready } = usePrivy();
  const { login } = useLogin();
  const defaultWallet = useUserStore(
    useShallow(s => s.userData?.wallets.find(w => w.isDefault))
  );

  if (!ready || (!defaultWallet?.address && user)) {
    return (
      <div className="flex items-center justify-center text-white text-[40px] max-992px:mt-[130px]">
        <CgSpinnerAlt className="animate-spin" />
      </div>
    );
  }

  if (!user || !authenticated || !defaultWallet) {
    return (
      <div className="max-992px:h-screen h-[70vh] w-full flex flex-col justify-center items-center text-white">
        <p className="leading-[19.8px] max-1400px:text-[15px] max-992px:text-[15px] text-[18px] text-[#C9C9E2] max-w-[718px] mx-auto text-center max-1400px:mb-[20px] mb-[1.875rem]">
          You need to login first
        </p>
        <LogInButton disabled={!ready} onClick={login} />
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-4 max-992px:mt-[127px] max-992px:px-4 px-[30px]">
        {/* MOBILE */}
        <div className="min-992px:hidden w-full">
          <div className="mb-3 px-[6px] flex justify-between gap-[5px] w-full">
            <NetworkSelect />
            <div className="max-h-[46px] flex gap-[5px]">
              <SocialButtons />
            </div>
          </div>
          <div className="bg-[#171717] bg-opacity-[36%] w-full max-h-[max-content] relative rounded-[16px] border-[0.5px] border-white/10 pt-[26px]">
            <BalanceChart />
          </div>
          <div className="mt-4 w-full bg-[#171717] bg-opacity-[36%] relative mb-4 min-h-[169px] font-radio pt-[26px]  border-[0.5px] border-white/10 rounded-[23px]">
            <Summary />
          </div>
          <div className="min-w-[272px] rounded-[23px]  bg-[#171717] bg-opacity-[36%] w-full relative mb-4 min-h-[159px] font-radio border-[0.5px] border-white/10">
            <BalanceHistory />
          </div>
          <div className="bg-[#171717] bg-opacity-[60%] py-6 mb-[23px] rounded-[23px] border-[0.5px] border-white/10 w-full">
            <div className="text-[#fff] text-[24px] leading-[26.4px] max-992px:px-[22px] px-8 border-b-[0.5px] border-white/10 pb-6">
              Transaction history
            </div>
            <TransactionList walletAddress={defaultWallet.address as Address} />
          </div>
          <Pools />
        </div>

        {/* TABLET */}
        <div className="max-992px:hidden min-1400px:hidden w-full h-full mt-4 min-1200px:mt-0">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-3 px-[6px] flex justify-between gap-[5px] w-full">
                <NetworkSelect />
                <div className="max-h-[46px] flex gap-[5px]">
                  <SocialButtons />
                </div>
              </div>
              <div className="bg-[#171717] min-h-[514px] bg-opacity-[36%] w-full max-h-[max-content] relative rounded-[16px] border-[0.5px] border-white/10 pt-[26px]">
                <BalanceChart />
              </div>
            </div>

            <div className="bg-[#171717] bg-opacity-[60%] py-6 rounded-[23px] border-[0.5px] border-white/10 w-full h-full">
              <div className="text-[#fff] text-[24px] leading-[26.4px] max-992px:px-[22px] px-8 border-b-[0.5px] border-white/10 pb-6">
                Transaction history
              </div>
              <TransactionList
                walletAddress={defaultWallet.address as Address}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 my-4">
            <div className="rounded-[23px] bg-[#171717] bg-opacity-[36%] w-full relative min-h-[159px] font-radio border-[0.5px] border-white/10">
              <BalanceHistory />
            </div>
            <div className="w-full bg-[#171717] bg-opacity-[36%] relative min-h-[169px] font-radio pt-[26px]  border-[0.5px] border-white/10 rounded-[23px]">
              <Summary />
            </div>
          </div>

          <Pools />
        </div>

        {/* DESCTOP */}
        <>
          <div className="max-1400px:hidden w-full flex flex-col">
            <div className="flex gap-4">
              <div className="min-w-[450px] rounded-[23px] bg-[#171717] bg-opacity-[46%] w-full relative mb-4 min-h-[169px] font-radio border-[0.5px] border-white/10">
                <BalanceHistory />
              </div>
              <div className="min-w-[450px] w-full bg-[#171717] bg-opacity-[46%] relative mb-4 min-h-[468px] font-radio pt-[26px]  border-[0.5px] border-white/10 rounded-[23px]">
                <Summary />
              </div>
            </div>
            <Pools />
          </div>

          <div className="max-1400px:hidden flex flex-col gap-3 max-w-[386px]">
            <div className="px-[6px] flex justify-between gap-[5px] w-full">
              <NetworkSelect />
              <div className="max-h-[46px] flex gap-[5px]">
                <SocialButtons />
              </div>
            </div>
            <div className=" max-1400px:hidden min-h-[514px] bg-[#171717] bg-opacity-[46%] w-[386px] max-h-[max-content] relative  rounded-[16px] flex-shrink-0 border-[0.5px] border-white/10 pt-[26px]">
              <BalanceChart />
            </div>
            <div className="bg-[#171717] bg-opacity-[60%] py-6 mb-[30px] rounded-[23px] border-[0.5px] border-white/10 min-1400px:h-full w-full">
              <div className="text-[#fff] text-[24px] leading-[26.4px] max-992px:px-[22px] px-8 border-b-[0.5px] border-white/10 pb-6">
                Transaction history
              </div>

              <TransactionList
                walletAddress={defaultWallet?.address as Address}
              />
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default Dashboard;
