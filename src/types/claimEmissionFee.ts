import { Address } from 'viem';
import { EActionType } from './chat';
import { TChainId } from './chain';

export interface IClaimEmissionFee {
  success: boolean;
  action: EActionType.CLAIM_EMISSION_FEE;
  isSimulation: boolean;
  walletAddress: Address;
  isClPool: boolean;
  poolAddress: Address;
  tokenId: bigint;
  feeBn: bigint;
  nfpm: Address;
  gauge: Address;
  isAlmPool: boolean;
  alm: Address;
  chainId: TChainId;
}
