import { BaseEntity } from '.';
import { IClaimEmissionFee } from './claimEmissionFee';
import { IClaimTradingFee } from './claimTradingFee';
import {
  ICreateLock,
  IExtendLock,
  IIncreaseLock,
  IMergeLocks,
  ISetLockToRaley,
  ITransferLock,
} from './lock';
import { IDeposit, IDepositETH, IDepositMint } from './deposit';
import { IStake } from './staking';
import { ISwap } from './swap';
import { IUnstake } from './unstake';
import { IVote } from './votes';
import { IWithdraw } from './withdraw';
import { IWithdrawLock } from './withdrawLock';
import { IClaimVotingReward } from './claimVotingRewards';
import { IClaimLockRewards } from './claimLockRewards';
import { IResetLock } from './resetLock';
import { IPokeLock } from './pokeLock';

export enum ESenderType {
  USER = 'USER',
  AI = 'AI',
}

export enum EActionType {
  LOGIN = 'LOGIN',
  SWAP = 'swap',
  DLIQUIDITY = 'addLiquidity',
  DLIQUIDITYETH = 'addLiquidityETH',
  DMINT = 'mint',
  WITHDRAW = 'withdraw',
  STAKE = 'stake',
  UNSTAKE = 'unstake',
  CLAIM_TRADING_FEE = 'claimFee',
  CLAIM_EMISSION_FEE = 'claimEmission',
  CLAIM_TRADING_AND_EMISSION_FEE = 'claimAllRewards',
  LOCK_TOKENS = 'lockTokens',
  VOTE = 'vote',
  EXTEND_LOCK = 'extendLock',
  INCREASE_LOCK = 'increaseLock',
  MERGE_LOCKS = 'mergeLocks',
  TRANSFER_LOCK = 'transferLock',
  SET_LOCK_TO_RELAY = 'setLockToRelay',
  WITHDRAW_LOCK = 'withdrawLock',
  CLAIM_VOTING_REWARDS = 'claimVotingRewards',
  CLAIM_LOCK_REWARDS = 'claimLockRewards',
  RESET_LOCK = 'resetLock',
  POKE_LOCK = 'pokeLock',
}

export interface IMessage extends BaseEntity {
  content: string;
  senderType: ESenderType;
  actionType?: EActionType;
}

export interface IChat extends BaseEntity {
  title: string;
  messages?: IMessage[];
}

export interface IMessageWithAction {
  actionType: EActionType;
  chainId?: number; // TODO should be defined
  data:
    | ISwap[]
    | IDeposit[]
    | IDepositETH[]
    | IDepositMint[]
    | IWithdraw[]
    | IStake[]
    | IUnstake[]
    | ICreateLock[]
    | IVote[]
    | IExtendLock[]
    | IIncreaseLock[]
    | IMergeLocks[]
    | ITransferLock[]
    | ISetLockToRaley[]
    | (IClaimTradingFee | IClaimEmissionFee)[]
    | IWithdrawLock[]
    | IClaimVotingReward[]
    | IClaimLockRewards[]
    | IResetLock[]
    | IPokeLock[];
}

export interface IMessageLimits {
  isBlocked: boolean;
  usedLimitPerHour: number;
  totalLimitPerHHour: number;
  limitResetInMs: number;
  limitExpiresAt: string;
}

export enum ETxMessageType {
  SWAP = 'swap',
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  STAKE = 'stake',
  UNSTAKE = 'unstake',
  CLAIM_TRADING_FEE = 'claimTradingFee',
  LOCK_TOKENS = 'lockTokens',
  VOTE = 'vote',
  EXTEND_LOCK = 'extendLock',
  INCREASE_LOCK = 'increaseLock',
  MERGE_LOCKS = 'mergeLocks',
  TRANSFER_LOCK = 'transferLock',
  SET_LOCK_TO_RELAY = 'setLockToRelay',
  WITHDRAW_LOCK = 'withdrawLock',
  CLAIM_VOTING_REWARDS = 'claimVotingRewards',
  CLAIM_LOCK_REWARDS = 'claimLockRewards',
  RESET_LOCK = 'resetLock',
  POKE_LOCK = 'pokeLock',
}
