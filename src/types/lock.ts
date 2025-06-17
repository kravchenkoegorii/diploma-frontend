'use strict';

import { Address } from 'viem';
import { TChainId } from './chain';

export interface ICommonAction {
  chainId: TChainId;
}

export interface ICreateLock extends ICommonAction {
  success: boolean;
  action: 'lockTokens';
  walletAddress: Address;
  feeBn: bigint;
  amountBn: bigint;
  duration: bigint;
  token_address: Address;
  amountToApproveBn: bigint;
}

export interface IExtendLock extends ICommonAction {
  success: boolean;
  walletAddress: Address;
  duration: bigint;
  lockId: string;
}

export interface IIncreaseLock extends ICommonAction {
  success: boolean;
  action: string;
  isSimulation: boolean;
  walletAddress: Address;
  feeBn: string;
  amountBn: string;
  token_address: Address;
  amountToApproveBn: string;
  lockId: string;
}

export interface IMergeLocks extends ICommonAction {
  success: boolean;
  action: string;
  isSimulation: boolean;
  walletAddress: Address;
  feeBn: string;
  lockIds: string[];
}

export interface ITransferLock extends ICommonAction {
  success: boolean;
  action: 'transferLock';
  isSimulation: boolean;
  walletAddress: Address;
  toAddress: Address;
  lockId: string;
  feeBn: string;
}

export interface ISetLockToRaley extends ICommonAction {
  success: boolean;
  isSimulation: boolean;
  tokenId: bigint;
  mTokenId: bigint;
}
