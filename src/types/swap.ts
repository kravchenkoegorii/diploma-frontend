import { Address, Hex } from 'viem';
import { TChainId } from './chain';

export interface ISwap {
  success: boolean;
  fromAddress: Address;
  action:
    | 'swapExactETHForTokens'
    | 'swapExactTokensForETH'
    | 'swapExactTokensForTokens';
  token0: Address;
  token1: Address;
  amountIn: string;
  amountInFormatted: string;
  amountOut: string;
  amountOutFormatted: string;
  routes: {
    from: Address;
    to: Address;
    stable: boolean;
    factory: Address;
  }[];
  rate: number;
  slippage: number;
  gas: string;
  gasFormatted: string;
  feeETH: string;
  feeAddress: Address;
  commands: Hex;
  inputs: Hex[];
  isWrapping: boolean;
  isUnwrapping: boolean;
  chainId: TChainId;
}
