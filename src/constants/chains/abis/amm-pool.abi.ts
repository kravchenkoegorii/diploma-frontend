export const ammPoolAbi = [
  {
    inputs: [],
    name: 'getInfo',
    outputs: [
      {
        components: [
          { internalType: 'uint96', name: 'nonce', type: 'uint96' },
          { internalType: 'address', name: 'operator', type: 'address' },
          { internalType: 'address', name: 'token0', type: 'address' },
          { internalType: 'address', name: 'token1', type: 'address' },
          { internalType: 'int24', name: 'tickSpacing', type: 'int24' },
          { internalType: 'int24', name: 'tickLower', type: 'int24' },
          { internalType: 'int24', name: 'tickUpper', type: 'int24' },
          { internalType: 'uint128', name: 'liquidity', type: 'uint128' },
          {
            internalType: 'uint256',
            name: 'feeGrowthInside0LastX128',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'feeGrowthInside1LastX128',
            type: 'uint256',
          },
          { internalType: 'uint128', name: 'tokensOwed0', type: 'uint128' },
          { internalType: 'uint128', name: 'tokensOwed1', type: 'uint128' },
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        ],
        internalType: 'struct PositionLibrary.Position[]',
        name: 'data',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
