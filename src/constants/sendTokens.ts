import EthereumIcon from '../assets/icons/EthereumIcon.png';
import { zeroAddress } from 'viem';

export const TOKENS = [
  {
    name: 'ETH',
    address: zeroAddress,
    decimals: 18,
    icon: EthereumIcon,
  },
  {
    name: 'USDC',
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
    icon: 'https://raw.githubusercontent.com/SmolDapp/tokenAssets/main/tokens/8453/0x833589fcd6edb6e08f4c7c32d4f71b54bda02913/logo.svg',
  },
];
