export const sugarRelaysAbi = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_registries', type: 'address[]' },
      { name: '_voter', type: 'address' },
    ],
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'all',
    inputs: [{ name: '_account', type: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'venft_id', type: 'uint256' },
          { name: 'decimals', type: 'uint8' },
          { name: 'amount', type: 'uint128' },
          { name: 'voting_amount', type: 'uint256' },
          { name: 'used_voting_amount', type: 'uint256' },
          { name: 'voted_at', type: 'uint256' },
          {
            name: 'votes',
            type: 'tuple[]',
            components: [
              { name: 'lp', type: 'address' },
              { name: 'weight', type: 'uint256' },
            ],
          },
          { name: 'token', type: 'address' },
          { name: 'compounded', type: 'uint256' },
          { name: 'withdrawable', type: 'uint256' },
          { name: 'run_at', type: 'uint256' },
          { name: 'manager', type: 'address' },
          { name: 'relay', type: 'address' },
          { name: 'inactive', type: 'bool' },
          { name: 'name', type: 'string' },
          {
            name: 'account_venfts',
            type: 'tuple[]',
            components: [
              { name: 'id', type: 'uint256' },
              { name: 'amount', type: 'uint256' },
              { name: 'earned', type: 'uint256' },
            ],
          },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'registries',
    inputs: [{ name: 'arg0', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'voter',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 've',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'token',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
] as const;
