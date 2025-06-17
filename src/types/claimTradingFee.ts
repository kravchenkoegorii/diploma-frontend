import { Address } from 'viem';
import { EActionType } from './chat';
import { TChainId } from './chain';

export interface IClaimTradingFee {
  success: boolean;
  action: EActionType.CLAIM_TRADING_FEE;
  isSimulation: boolean;
  walletAddress: Address;
  isClPool: boolean;
  poolAddress: Address;
  tokenId: string;
  feeBn: bigint;
  nfpm: Address;
  chainId: TChainId;
}
