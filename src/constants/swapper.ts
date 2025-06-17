import { Abi, Address } from 'viem';
import { STAGE, STAGES } from '.';
import { swapperProdAbi } from '@/abis/swapper-prod.abi';
import { swapperDevAbi } from '@/abis/swapper-dev.abi';
import { swapperDevOptimismAbi } from '@/abis/swapper-dev-OP.abi';
import { swapperProdOPAbi } from '@/abis/swapper-prod-OP.abi';

export const swapperContracts: Record<STAGES, Record<number, Address>> = {
  [STAGES.DEVELOPMENT]: {
    8453: '0x41b5CBBAf5f57c9d67b6CC3B13342b9BBEe84D1e', // Base
    10: '0x1829CAA08768A680b18A56FEF33238f84297aD58', // Optimism
  },
  [STAGES.STAGING]: {
    8453: '0x41b5CBBAf5f57c9d67b6CC3B13342b9BBEe84D1e', // Base
    10: '0x1829CAA08768A680b18A56FEF33238f84297aD58', // Optimism
  },
  [STAGES.PRODUCTION]: {
    8453: '0x41b5CBBAf5f57c9d67b6CC3B13342b9BBEe84D1e', // Base
    10: '0x1829CAA08768A680b18A56FEF33238f84297aD58', // Optimism
  },
};

export const swapperAbi: Record<STAGES, Record<number, Abi>> = {
  [STAGES.DEVELOPMENT]: {
    8453: swapperDevAbi as Abi,
    10: swapperDevOptimismAbi as Abi,
  },
  [STAGES.STAGING]: {
    8453: swapperDevAbi as Abi,
    10: swapperDevOptimismAbi as Abi,
  },
  [STAGES.PRODUCTION]: {
    8453: swapperProdAbi as Abi,
    10: swapperProdOPAbi as Abi,
  },
};

export const SWAPPER_CONTRACT = swapperContracts[STAGE];
export const SWAPPER_ABI = swapperAbi[STAGE];
