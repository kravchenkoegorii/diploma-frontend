import { ammGaugeAbi } from '@/abis/amm-gauge.abi';
import { ammPoolContractAbi } from '@/abis/amm-pl-contract.abi';
import { clGaugeAbi } from '@/abis/cl-gauge.abi';
import { permit2Abi } from '@/abis/permit2.abi';
import { universalAddressSwapperAbi } from '@/abis/universalRouter.abi';
import { PERMIT2 } from '@/constants/permit2';
import { IClaimTradingFee } from '@/types/claimTradingFee';
import { IStake } from '@/types/staking';
import { IUnstake } from '@/types/unstake';
import { IWithdraw, IWithdrawAction } from '@/types/withdraw';
import { getClient, getTransactionReceipt, multicall } from '@wagmi/core';
import {
  Address,
  erc20Abi,
  erc721Abi,
  getContract,
  maxUint128,
  MulticallParameters,
} from 'viem';

import { almAbi } from '@/abis/alm.abi';
import { factoryAbi } from '@/abis/factoryAbi';
import { veNftAbi } from '@/abis/veNFT.abi';
import { voterAbi } from '@/abis/voter.abi';
import { SWAPPER_ABI, SWAPPER_CONTRACT } from '@/constants/swapper';
import { appStore } from '@/stores/app';
import { TChainId } from '@/types/chain';
import { EActionType, ETxMessageType } from '@/types/chat';
import { IClaimEmissionFee } from '@/types/claimEmissionFee';
import { IDeposit, IDepositETH, IDepositMint } from '@/types/deposit';
import {
  ICreateLock,
  IExtendLock,
  IIncreaseLock,
  IMergeLocks,
  ISetLockToRaley,
  ITransferLock,
} from '@/types/lock';
import { IVote } from '@/types/votes';
import { IWithdrawLock } from '@/types/withdrawLock';
import {
  estimateFeesPerGas,
  getAccount,
  GetAccountReturnType,
  readContract,
  simulateContract,
  switchChain,
  writeContract,
} from 'wagmi/actions';
import { $api } from '.';
import { sugarAbi } from '../abis/sugar.abi.ts';
import { factoryRegistryAbi } from '../abis/factoryRegistryAbi.abi';
import { rewardsSugarAbi } from '../abis/rewardsSugar.abi';
import { veSugarAbi } from '../abis/veSugar.abi';
import { wagmiConfig } from '../config/wagmiConfig';
import { MINUTE } from '../constants/time';
import { chatsStore } from '../stores/chats';
import {
  ILendingPool,
  IToken,
  ITransaction,
  IVotingReward,
  TLock,
  TPosition,
} from '../types/aerodrome';
import { ISwap } from '../types/swap';
import { chatService } from './chatService';
import { IClaimVotingReward } from '@/types/claimVotingRewards';
import { chainsConfig } from '../constants/chains/chainsConfig';
import { flatMap, intersectionWith } from 'lodash';
import { IClaimLockRewards } from '@/types/claimLockRewards';
import { ViemService } from './viem.service';
import { waitForTransactionReceipt } from 'viem/actions';
import { IResetLock } from '@/types/resetLock';
import { IPokeLock } from '@/types/pokeLock';

export class AerodromeService {
  private viemService = new ViemService();

  async swap(data: ISwap) {
    if (!data) {
      throw new Error('Invalid swap data');
    }
    console.group('Swap transaction');

    console.log('Swapping', data);

    const account = getAccount(wagmiConfig);
    const address = account.address;
    const { chainId } = data;
    const { universalRouter } = chainsConfig[chainId];

    console.log('Chain id', chainId);

    console.log('Universal Router', universalRouter);

    if (!address) {
      throw new Error('Invalid account');
    }

    await this._switchChain(account, chainId);

    const feeBn = BigInt(data.feeETH);
    const amountInBn = BigInt(data.amountIn);

    const amountToApproveBn =
      amountInBn + BigInt(Math.trunc(+amountInBn.toString() * 0.001));

    const feesPerGas = await estimateFeesPerGas(wagmiConfig, {
      chainId,
    });

    let tx: Address | undefined;
    if (data.action === 'swapExactETHForTokens') {
      const { request } = await simulateContract(wagmiConfig, {
        address: universalRouter,
        abi: universalAddressSwapperAbi,
        functionName: 'execute',
        args: [data.commands, data.inputs],
        chainId,
        value: amountInBn + feeBn,
        account: account.address,
      });

      tx = await writeContract(wagmiConfig, request);
    } else if (data.action === 'swapExactTokensForETH') {
      if (data.isUnwrapping) {
        const [allowance, expiration] = await readContract(wagmiConfig, {
          address: PERMIT2,
          functionName: 'allowance',
          args: [address, data.token0, universalRouter],
          abi: permit2Abi,
          chainId,
        });
        const currentTime = Date.now();
        console.log(
          `PERMIT2 Approval`,
          allowance,
          amountToApproveBn,
          expiration,
          currentTime
        );

        if (
          allowance < amountToApproveBn ||
          Number(expiration) <= Number(currentTime)
        ) {
          const deadline = currentTime + 10 * MINUTE;
          const hash = await writeContract(wagmiConfig, {
            address: PERMIT2,
            abi: permit2Abi,
            functionName: 'approve',
            args: [data.token0, universalRouter, amountToApproveBn, deadline],
            chainId,
            account: account.address,
            gasPrice: feesPerGas.gasPrice,
            maxPriorityFeePerGas: feesPerGas.maxPriorityFeePerGas,
          });
          console.log('PERMIT2 Approval tx', hash);

          const viemClient = this.viemService.getViemClient(chainId);

          await waitForTransactionReceipt(viemClient, {
            hash: hash as Address,
          });
        }
      }

      const allowanceTo = data.isUnwrapping ? PERMIT2 : universalRouter;
      const allowance = await readContract(wagmiConfig, {
        address: data.token0,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address, allowanceTo],
        chainId,
      });

      console.log('ERC20 Approval', allowance, amountToApproveBn);

      if (allowance < amountToApproveBn) {
        const approvalTx = await writeContract(wagmiConfig, {
          address: data.token0,
          abi: erc20Abi,
          functionName: 'approve',
          args: [allowanceTo, amountToApproveBn],
          chainId,
          account: account.address,
          gasPrice: feesPerGas.gasPrice,
          maxPriorityFeePerGas: feesPerGas.maxPriorityFeePerGas,
        });
        console.log('Approval tx', approvalTx);
        const viemClient = this.viemService.getViemClient(chainId);

        await waitForTransactionReceipt(viemClient, {
          hash: approvalTx as Address,
        });
      }

      const { request } = await simulateContract(wagmiConfig, {
        address: universalRouter,
        abi: universalAddressSwapperAbi,
        functionName: 'execute',
        args: [data.commands, data.inputs],
        value: feeBn,
        chainId,
        account: account.address,
      });

      tx = await writeContract(wagmiConfig, request);
    } else if (data.action === 'swapExactTokensForTokens') {
      const allowance = await readContract(wagmiConfig, {
        address: data.token0,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address, universalRouter],
        chainId,
        account: account.address,
      });

      console.log('Approval', allowance, amountToApproveBn);

      if (allowance < amountToApproveBn) {
        const approvalTx = await writeContract(wagmiConfig, {
          address: data.token0,
          abi: erc20Abi,
          functionName: 'approve',
          args: [universalRouter, amountToApproveBn],
          chainId,
          account: account.address,
          gasPrice: feesPerGas.gasPrice,
          maxPriorityFeePerGas: feesPerGas.maxPriorityFeePerGas,
        });
        const viemClient = this.viemService.getViemClient(chainId);

        await waitForTransactionReceipt(viemClient, {
          hash: approvalTx as Address,
        });
      }

      const { request } = await simulateContract(wagmiConfig, {
        address: universalRouter,
        abi: universalAddressSwapperAbi,
        functionName: 'execute',
        args: [data.commands, data.inputs],
        value: feeBn,
        chainId: chainId,
        account: account.address,
      });

      tx = await writeContract(wagmiConfig, request);
    }

    console.log('Transaction', tx);

    if (!tx) {
      throw new Error('Invalid transaction');
    }

    const viemClient = this.viemService.getViemClient(chainId);
    const receipt = await waitForTransactionReceipt(viemClient, {
      hash: tx as Address,
    });

    console.log('Receipt', receipt);

    console.groupEnd();

    return { receipt, chainId };
  }

  async getFactories(chainId: TChainId) {
    const { factoryRegistry } = chainsConfig[chainId];

    const factories = await readContract(wagmiConfig, {
      address: factoryRegistry,
      abi: factoryRegistryAbi,
      functionName: 'poolFactories',
      chainId,
    });

    return factories;
  }

  parseData(data: ILendingPool[]): ILendingPool[] {
    return data.map(item => ({
      ...item,
      liquidity: BigInt(item.liquidity),
      reserve0: BigInt(item.reserve0),
      reserve1: BigInt(item.reserve1),
      staked0: BigInt(item.staked0),
      staked1: BigInt(item.staked1),
      sqrt_ratio: BigInt(item.sqrt_ratio),
      emissionsTokenSymbol: item.emissionsTokenSymbol,
      apr: item.apr,
      tvl: item.tvl,
      chainId: item.chainId,
    }));
  }

  async getPoolsByAddresses(
    addresses: { address: Address; chainId: TChainId }[]
  ): Promise<ILendingPool[]> {
    if (!addresses.length) return [];

    const url = '/api/dex/pools';
    const body = { addresses };

    const { data } = await $api.post(url, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return this.parseData(data);
  }

  async getPositionsForChains(walletAddress?: Address, chainIds?: TChainId[]) {
    const positions: TPosition[] = [];

    const chains = chainIds
      ? intersectionWith(wagmiConfig.chains, chainIds, (a, b) => a.id === b)
      : wagmiConfig.chains;

    await Promise.all(
      chains.map(async chain => {
        try {
          const data = await this.getPositions(chain.id, walletAddress);
          if (data) {
            positions.push(...data);
          }
        } catch (error) {
          console.error('Error getting positions for chain', chain.id, error);
        }
      })
    );

    return flatMap(positions).filter(Boolean) as TPosition[];
  }

  async getPositions(chainId: TChainId, walletAddress?: Address) {
    console.log('Getting positions for', walletAddress, chainId);
    const { sugarContract, multicallAddress } = chainsConfig[chainId];

    if (!walletAddress) {
      return;
    }

    let limit = 200n;

    try {
      limit = await readContract(wagmiConfig, {
        address: sugarContract,
        abi: sugarAbi,
        chainId,
        functionName: 'MAX_POSITIONS',
      });
    } catch (error) {
      console.error('Error getting MAX_POSITIONS', error);
    }

    const factories = await this.getFactories(chainId);

    type MulticallItem = {
      type: 'factory' | 'unstaked';
      call: MulticallParameters['contracts'][0];
    };
    const multicallQueue: MulticallItem[] = [];

    const factoryPoolLengths = await Promise.all(
      factories.map(async factory => {
        const poolsLength = await readContract(wagmiConfig, {
          address: factory,
          abi: factoryAbi,
          functionName: 'allPoolsLength',
          chainId,
        });
        return { factory, poolsLength };
      })
    );

    for (const { factory, poolsLength } of factoryPoolLengths) {
      let offset = BigInt(0);
      while (offset < poolsLength) {
        multicallQueue.push({
          type: 'factory',
          call: {
            address: sugarContract,
            abi: sugarAbi,
            functionName: 'positionsByFactory',
            args: [limit, offset, walletAddress as Address, factory],
          },
        });
        offset += limit;
      }
    }

    let unstakedOffset = BigInt(0);
    while (unstakedOffset < BigInt(10000)) {
      multicallQueue.push({
        type: 'unstaked',
        call: {
          address: sugarContract,
          abi: sugarAbi,
          functionName: 'positionsUnstakedConcentrated',
          args: [limit, unstakedOffset, walletAddress as Address],
        },
      });
      unstakedOffset += limit;
    }
    const factoryResults: TPosition[] = [];
    const unstakedResults: TPosition[] = [];

    const multicallResults = await multicall(wagmiConfig, {
      multicallAddress,
      contracts: multicallQueue.map(item => item.call),
      chainId: chainId,
    });

    for (let i = 0; i < multicallResults.length; i++) {
      const result = multicallResults[i].result as TPosition[] | undefined;
      if (result) {
        for (const item of result) {
          item.chainId = chainId;
        }
        if (multicallQueue[i].type === 'factory') {
          factoryResults.push(...result);
        } else if (multicallQueue[i].type === 'unstaked') {
          unstakedResults.push(...result);
        }
      }
    }

    return [...factoryResults, ...unstakedResults];
  }

  async getLocksForChains(address?: Address, chainIds?: TChainId[]) {
    const locks: TLock[] = [];

    const chains = chainIds
      ? intersectionWith(wagmiConfig.chains, chainIds, (a, b) => a.id === b)
      : wagmiConfig.chains;

    await Promise.all(
      chains.map(async chain => {
        try {
          const data = await this.getLocks(address, chain.id);
          if (data) {
            locks.push(...data);
          }
        } catch (error) {
          console.error('Error getting positions for chain', chain.id, error);
        }
      })
    );

    return flatMap(locks).filter(Boolean) as TLock[];
  }

  async getLocks(address?: Address, chainId?: TChainId) {
    console.log('Getting locks for', chainId, address);

    if (!address || !chainId) {
      return;
    }

    const { veSugar } = chainsConfig[chainId];

    const client = getClient(wagmiConfig, {
      chainId,
    });

    const contract = getContract({
      address: veSugar,
      abi: veSugarAbi,
      client,
    });

    const locks = (await contract.read.byAccount([address])) as TLock[];

    for (const lock of locks) {
      lock.chainId = chainId;
    }

    return locks as TLock[];
  }

  async getVotingRewardsForChains(
    address?: Address,
    locks?: TLock[],
    chainIds?: TChainId[]
  ) {
    const rewards: IVotingReward[] = [];

    const chains = chainIds
      ? intersectionWith(wagmiConfig.chains, chainIds, (a, b) => a.id === b)
      : wagmiConfig.chains;

    await Promise.all(
      chains.map(async chain => {
        try {
          const data = await this.getVotingRewards(address, locks, chain.id);

          if (data) {
            rewards.push(...data);
          }
        } catch (error) {
          console.error(
            'Error getting voting rewards for chain',
            chain.id,
            error
          );
        }
      })
    );

    return flatMap(rewards).filter(Boolean) as IVotingReward[];
  }

  async getVotingRewards(
    address?: Address,
    locks?: TLock[],
    chainId?: TChainId
  ) {
    console.log('Getting voting rewards for', address, chainId);

    const { rewardsSugar } = chainsConfig[chainId as TChainId];

    if (!address || !locks || !chainId) {
      return [];
    }

    const client = getClient(wagmiConfig, { chainId });

    const contract = getContract({
      address: rewardsSugar,
      abi: rewardsSugarAbi,
      client,
    });

    const limit = BigInt(1000);
    const allRewardsData: IVotingReward[] = [];

    for (let i = 0; i < locks.length; i++) {
      const lock = locks[i];
      let offset = BigInt(0);

      for (let j = 0; j < 10; j++) {
        try {
          const rewardsChunk = (await contract.read.rewards([
            limit,
            offset,
            lock.id,
          ])) as IVotingReward[];

          for (const reward of rewardsChunk) {
            reward.chainId = chainId;
          }

          allRewardsData.push(...rewardsChunk);
          offset += BigInt(limit);
        } catch (err) {
          console.error('Error fetching rewards for chain', chainId, err);
        }
      }
    }

    return allRewardsData;
  }

  async withdraw(data: IWithdraw) {
    if (!data) {
      throw new Error('Invalid swap data');
    }
    const { chainId } = data;

    if (!SWAPPER_CONTRACT[chainId]) {
      throw new Error('Invalid swapper contract');
    }
    console.log('Withdrawing', data);

    const account = getAccount(wagmiConfig);
    const address = data.toAddress;

    if (!address) {
      throw new Error('Invalid account');
    }
    await this._switchChain(account, chainId);

    const feeBn = BigInt(data.feeETH);

    let tx: Address | undefined;

    if (data.action === IWithdrawAction.CL) {
      if (!data.nfpm) {
        throw new Error('Invalid nfpm');
      }

      await this.approveNft(
        chainId,
        data.nfpm,
        data.tokenId,
        address,
        SWAPPER_CONTRACT[chainId]
      );

      const { request: decreaseRequest } = await simulateContract(wagmiConfig, {
        address: SWAPPER_CONTRACT[chainId],
        abi: SWAPPER_ABI[chainId],
        functionName: 'decreaseLiquidity',
        args: [
          {
            tokenId: BigInt(data.tokenId),
            liquidity: BigInt(data.liquidity),
            amount0Min: BigInt(data.amount0Min),
            amount1Min: BigInt(data.amount1Min),
            deadline: BigInt(data.deadline),
          },
          feeBn,
        ],
        chainId: chainId,
        value: feeBn,
        account: address as Address,
      });

      const decreaseHash = await writeContract(wagmiConfig, decreaseRequest);

      const viemClient = this.viemService.getViemClient(chainId);
      const decreaseReceipt = await waitForTransactionReceipt(viemClient, {
        hash: decreaseHash as Address,
        retryDelay: () => 1100,
      });

      if (decreaseReceipt.status === 'reverted') {
        throw new Error('DecreaseLiquidity transaction reverted');
      }

      await this.approveNft(
        chainId,
        data.nfpm,
        data.tokenId,
        address,
        SWAPPER_CONTRACT[chainId]
      );

      const { request: collectRequest } = await simulateContract(wagmiConfig, {
        address: SWAPPER_CONTRACT[chainId],
        abi: SWAPPER_ABI[chainId],
        functionName: 'collect',
        args: [
          {
            tokenId: BigInt(data.tokenId),
            recipient: address,
            amount0Max: maxUint128,
            amount1Max: maxUint128,
          },
          feeBn,
        ],
        chainId: chainId,
        value: feeBn,
        account: address as Address,
      });

      const collectHash = await writeContract(wagmiConfig, collectRequest);

      const collectReceipt = await waitForTransactionReceipt(viemClient, {
        hash: collectHash as Address,
        retryDelay: () => 1100,
      });

      if (collectReceipt.status === 'reverted') {
        throw new Error('Collect transaction reverted');
      }

      console.log(
        `Successfully withdrawn CL position. Decrease hash: ${decreaseHash}, Collect hash: ${collectHash}`
      );

      tx = collectHash as Address;
    } else if (data.action === IWithdrawAction.AMM) {
      await this.approveToken(
        chainId,
        address,
        data.poolAddress,
        data.liquidity
      );

      const hash = await writeContract(wagmiConfig, {
        address: SWAPPER_CONTRACT[chainId],
        abi: SWAPPER_ABI[chainId],
        functionName: 'removeLiquidity',
        args: [
          data.token0 as Address,
          data.token1 as Address,
          data.stable,
          data.liquidity,
          data.amount0Min,
          data.amount1Min,
          address as Address,
          data.deadline,
          feeBn,
        ],
        chainId: chainId,
        value: feeBn,
        account: address as Address,
        connector: account.connector,
      });

      const viemClient = this.viemService.getViemClient(chainId);
      await waitForTransactionReceipt(viemClient, {
        hash: hash as Address,
        retryDelay: () => 1100,
      });

      console.log(
        `Successfully withdrawn AMM position. Remove Liquidity hash: ${hash}`
      );
      tx = hash as Address;
    }

    if (!tx) {
      throw new Error('Invalid transaction');
    }

    const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
      hash: tx,
    });

    return { receipt, chainId };
  }

  async deposit(
    deposits: (IDeposit | IDepositETH | IDepositMint)[],
    chatId: string
  ) {
    const transactions: ITransaction[] = [];
    const { setIsTransactionSubmitting } = chatsStore.getState();
    setIsTransactionSubmitting(true);

    try {
      for (const deposit of deposits) {
        const { chainId } = deposit;

        try {
          if (deposit.actionType === 'addLiquidity') {
            const tx = await this.depositLiquidity(
              chainId,
              deposit as IDeposit
            );
            if (tx) {
              transactions.push(tx);
            }
          } else if (deposit.actionType === 'addLiquidityETH') {
            const tx = await this.depositLiquidityETH(
              chainId,
              deposit as IDepositETH
            );
            if (tx) {
              transactions.push(tx);
            }
          } else {
            const tx = await this.depositMint(chainId, deposit as IDepositMint);
            if (tx) {
              transactions.push(tx);
            }
          }
        } catch (error) {
          console.error(error, 'deposit error');
          if (error instanceof Error) {
            await chatService.sendErrorMessage(chatId, error.message);
          }
        }
      }
      if (transactions.length > 0) {
        await chatService.sendTxMessage(
          chatId,
          transactions,
          ETxMessageType.DEPOSIT
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTransactionSubmitting(false);
    }
  }

  async depositLiquidity(chainId: TChainId, deposit: IDeposit) {
    const account = getAccount(wagmiConfig);
    const address = account.address;
    const isPriviWallet = account.connector?.id === 'io.privy.wallet';
    let tx: Address | undefined;

    if (!address) throw new Error('Invalid account');

    await this._switchChain(account, chainId);

    if (!deposit.isSimulation) {
      await this.approveToken(
        chainId,
        address as Address,
        deposit.tokenA,
        deposit.amountAToApproveBN
      );
      await this.approveToken(
        chainId,
        address as Address,
        deposit.tokenB,
        deposit.amountBToApproveBN
      );

      await new Promise(resolve => setTimeout(resolve, 1000));

      const swapperContractAddress = SWAPPER_CONTRACT[chainId];

      if (!swapperContractAddress)
        throw new Error(
          `Can not find the swapper contract on the chain: ${chainId}`
        );

      const { request } = await simulateContract(wagmiConfig, {
        address: swapperContractAddress as Address,
        abi: SWAPPER_ABI[chainId],
        functionName: 'addLiquidity',
        args: [
          deposit.tokenA as Address,
          deposit.tokenB as Address,
          deposit.stable,
          deposit.amountADesired,
          deposit.amountBDesired,
          deposit.amountAMin,
          deposit.amountBMin,
          deposit.to,
          deposit.deadline,
          deposit.feeAmount,
        ],
        chainId: chainId,
        value: deposit.value,
        account: address,
        gas: isPriviWallet ? undefined : BigInt(8000000),
      });

      const hash = await writeContract(wagmiConfig, request);

      const viemClient = this.viemService.getViemClient(chainId);
      await waitForTransactionReceipt(viemClient, {
        hash: hash as Address,
        retryDelay: () => 1100,
      });

      tx = hash as Address;

      const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
        hash: tx,
      });

      return { receipt, chainId };
    }
  }

  async depositLiquidityETH(chainId: TChainId, deposit: IDepositETH) {
    const account = getAccount(wagmiConfig);
    const address = account.address;
    const isPriviWallet = account.connector?.id === 'io.privy.wallet';
    let tx: Address | undefined;

    if (!address) throw new Error('Invalid account');

    await this._switchChain(account, chainId);

    if (!SWAPPER_CONTRACT[chainId])
      throw new Error(
        `Can not find the swapper contract on the chain: ${chainId}`
      );

    if (!deposit.isSimulation) {
      await this.approveToken(
        chainId,
        address as Address,
        deposit.token,
        deposit.amountToApproveBN
      );

      const { request } = await simulateContract(wagmiConfig, {
        address: SWAPPER_CONTRACT[chainId] as Address,
        abi: SWAPPER_ABI[chainId],
        functionName: 'addLiquidityETH',
        args: [
          deposit.token as Address,
          deposit.stable,
          deposit.amountTokenDesired,
          deposit.amountTokenMin,
          deposit.amountETHMin,
          deposit.to,
          deposit.deadline,
          deposit.feeAmount,
        ],
        chainId: chainId,
        value: BigInt(deposit.value),
        account: address,
        gas: isPriviWallet ? undefined : BigInt(8000000),
      });

      const hash = await writeContract(wagmiConfig, request);

      const viemClient = this.viemService.getViemClient(chainId);
      await waitForTransactionReceipt(viemClient, {
        hash: hash as Address,
        retryDelay: () => 1100,
      });

      tx = hash as Address;

      const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
        hash: tx,
      });

      return { receipt, chainId };
    }
  }

  async depositMint(chainId: TChainId, deposit: IDepositMint) {
    const account = getAccount(wagmiConfig);
    const address = account.address;
    const isPriviWallet = account.connector?.id === 'io.privy.wallet';
    let tx: Address | undefined;

    if (!address) throw new Error('Invalid account');

    if (!SWAPPER_CONTRACT[chainId])
      throw new Error(
        `Can not find the swapper contract on the chain: ${chainId}`
      );

    await this._switchChain(account, chainId);
    if (!deposit.isSimulation) {
      await this.approveToken(
        chainId,
        address as Address,
        deposit.token0,
        deposit.amountAToApproveBN
      );

      await this.approveToken(
        chainId,
        address as Address,
        deposit.token1,
        deposit.amountBToApproveBN
      );

      const { request } = await simulateContract(wagmiConfig, {
        address: SWAPPER_CONTRACT[chainId] as Address,
        abi: SWAPPER_ABI[chainId],
        functionName: 'mint',
        args: [
          {
            token0: deposit.token0 as Address,
            token1: deposit.token1 as Address,
            tickSpacing: deposit.tickSpacing,
            tickLower: deposit.tickLower,
            tickUpper: deposit.tickUpper,
            amount0Desired: deposit.amount0Desired,
            amount1Desired: deposit.amount1Desired,
            amount0Min: deposit.amount0Min,
            amount1Min: deposit.amount1Min,
            recipient: deposit.recipient,
            deadline: deposit.deadline,
            sqrtPriceX96: deposit.sqrtPriceX96,
          },
          deposit.feeAmount,
        ],
        chainId: chainId,
        account: address,
        value: deposit.value,
        gas: isPriviWallet ? undefined : BigInt(8000000),
      });

      const hash = await writeContract(wagmiConfig, request);

      const viemClient = this.viemService.getViemClient(chainId);
      await waitForTransactionReceipt(viemClient, {
        hash: hash as Address,
        retryDelay: () => 1100,
      });

      tx = hash as Address;

      const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
        hash: tx,
      });

      return { receipt, chainId };
    }
  }

  async stake(data: IStake) {
    const {
      feeBn,
      isClPool,
      lpToken,
      gauge,
      walletAddress,
      amountBN,
      amountToApproveBN,
      tokenId,
      nfpm,
      chainId,
    } = data;
    const account = getAccount(wagmiConfig);

    if (!SWAPPER_CONTRACT[chainId])
      throw new Error(
        `Can not find the swapper contract on the chain: ${chainId}`
      );

    await this._switchChain(account, chainId);

    if (isClPool) {
      await this.approveNft(chainId, nfpm, tokenId, walletAddress, gauge);

      const stakingData = await simulateContract(wagmiConfig, {
        address: gauge,
        abi: clGaugeAbi,
        functionName: 'deposit',
        args: [BigInt(tokenId)],
        chainId: chainId,
        account: walletAddress,
      });

      const hash = await writeContract(wagmiConfig, stakingData.request);

      const viemClient = this.viemService.getViemClient(chainId);
      await waitForTransactionReceipt(viemClient, {
        hash: hash as Address,
        retryDelay: () => 1100,
      });
      const tx = hash;

      if (!tx) {
        throw new Error('Invalid transaction');
      }

      const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
        hash: tx,
      });

      return { receipt, chainId };
    }

    await this.approveToken(chainId, walletAddress, lpToken, amountToApproveBN);

    const stakingData = await simulateContract(wagmiConfig, {
      address: SWAPPER_CONTRACT[chainId] as Address,
      abi: SWAPPER_ABI[chainId],
      functionName: 'depositAMM',
      args: [lpToken, amountBN, walletAddress, feeBn],
      value: feeBn,
      chainId: chainId,
      account: walletAddress,
    });

    const hash = await writeContract(wagmiConfig, stakingData.request);

    const viemClient = this.viemService.getViemClient(chainId);
    await waitForTransactionReceipt(viemClient, {
      hash: hash as Address,
      retryDelay: () => 1100,
    });
    const tx = hash;

    if (!tx) {
      throw new Error('Invalid transaction');
    }

    const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
      hash: tx,
    });

    return { receipt, chainId };
  }

  async unStake(data: IUnstake) {
    const { isClPool, gauge, walletAddress, amountBn, tokenId, chainId } = data;
    const account = getAccount(wagmiConfig);

    await this._switchChain(account, chainId);

    const viemClient = this.viemService.getViemClient(chainId);
    if (isClPool) {
      const sendData = await simulateContract(wagmiConfig, {
        address: gauge,
        abi: clGaugeAbi,
        functionName: 'withdraw',
        args: [tokenId],
        chainId: chainId,
        account: walletAddress,
      });

      const hash = await writeContract(wagmiConfig, sendData.request);

      await waitForTransactionReceipt(viemClient, {
        hash: hash as Address,
        retryDelay: () => 1100,
      });

      const tx = hash as Address;

      if (!tx) {
        throw new Error('Invalid transaction');
      }

      const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
        hash: tx,
      });

      return { receipt, chainId };
    }

    const sendData = await simulateContract(wagmiConfig, {
      address: gauge,
      abi: ammGaugeAbi,
      functionName: 'withdraw',
      args: [amountBn],
      chainId: chainId,
      account: walletAddress,
    });

    const hash = await writeContract(wagmiConfig, sendData.request);

    await waitForTransactionReceipt(viemClient, {
      hash: hash as Address,
      retryDelay: () => 1100,
    });
    const tx = hash as Address;

    if (!tx) {
      throw new Error('Invalid transaction');
    }

    const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
      hash: tx,
    });

    return { receipt, chainId };
  }

  async claimTradingFee(data: IClaimTradingFee) {
    const {
      walletAddress: address,
      isClPool,
      tokenId,
      nfpm,
      feeBn,
      poolAddress,
      chainId,
    } = data;
    const account = getAccount(wagmiConfig);

    await this._switchChain(account, chainId);

    if (!SWAPPER_CONTRACT[chainId])
      throw new Error(
        `Can not find the swapper contract on the chain: ${chainId}`
      );

    let tx: Address | undefined;
    if (isClPool) {
      await this.approveNft(
        chainId,
        nfpm,
        tokenId.toString(),
        address,
        SWAPPER_CONTRACT[chainId]
      );

      const { request: collectRequest } = await simulateContract(wagmiConfig, {
        address: SWAPPER_CONTRACT[chainId] as Address,
        abi: SWAPPER_ABI[chainId],
        functionName: 'collect',
        args: [
          {
            tokenId: BigInt(tokenId),
            recipient: address,
            amount0Max: maxUint128,
            amount1Max: maxUint128,
          },
          feeBn,
        ],
        chainId: chainId,
        value: feeBn,
        account: address,
      });

      const hash = await writeContract(wagmiConfig, collectRequest);
      const viemClient = this.viemService.getViemClient(chainId);

      const collectReceipt = await waitForTransactionReceipt(viemClient, {
        hash: hash as Address,
        retryDelay: () => 1100,
      });

      if (collectReceipt.status === 'reverted') {
        throw new Error('Collect transaction reverted');
      }

      tx = hash;
    } else {
      const { request: claimRequest } = await simulateContract(wagmiConfig, {
        address: poolAddress,
        abi: ammPoolContractAbi,
        functionName: 'claimFees',
        chainId: chainId,
        account: address as Address,
      });

      const hash = await writeContract(wagmiConfig, claimRequest);

      const viemClient = this.viemService.getViemClient(chainId);
      const claimReceipt = await waitForTransactionReceipt(viemClient, {
        hash: hash as Address,
        retryDelay: () => 1100,
      });

      if (claimReceipt.status === 'reverted') {
        throw new Error('Claim transaction reverted');
      }

      tx = hash;
    }

    if (!tx) {
      throw new Error('Invalid transaction');
    }

    const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
      hash: tx,
    });

    return { receipt, chainId };
  }

  async claimEmissionFee(data: IClaimEmissionFee) {
    const { walletAddress, isClPool, tokenId, gauge, isAlmPool, alm, chainId } =
      data;
    const account = getAccount(wagmiConfig);

    await this._switchChain(account, chainId);
    const viemClient = this.viemService.getViemClient(chainId);

    let tx: Address | undefined;

    if (isAlmPool) {
      const { request: rewardClAlmRequest } = await simulateContract(
        wagmiConfig,
        {
          address: alm,
          abi: almAbi,
          functionName: 'getRewards',
          args: [walletAddress],
          chainId: chainId,
          account: walletAddress as Address,
        }
      );

      const hash = await writeContract(wagmiConfig, rewardClAlmRequest);

      const rewardClAlmReceipt = await waitForTransactionReceipt(viemClient, {
        hash: hash as Address,
        retryDelay: () => 1100,
      });

      if (rewardClAlmReceipt.status === 'reverted') {
        throw new Error('Collect transaction reverted');
      }

      tx = hash;
    } else if (isClPool) {
      /**
       * @see(https://github.com/velodrome-finance/docs/blob/main/content/sdk.mdx#emissions-claiming-1)
       * Concentrated Pools
       * Emissions Claiming
       *
       * To claim emissions for a staked deposit,
       * call the Gauge contract function getReward()
       * passing the deposit NFT id.
       */

      const { request: rewardCLRequest } = await simulateContract(wagmiConfig, {
        address: gauge,
        abi: clGaugeAbi,
        functionName: 'getReward',
        args: [tokenId],
        chainId: chainId,
        account: walletAddress as Address,
      });

      const hash = await writeContract(wagmiConfig, rewardCLRequest);

      const rewardCLReceipt = await waitForTransactionReceipt(viemClient, {
        hash: hash as Address,
        retryDelay: () => 1100,
      });

      if (rewardCLReceipt.status === 'reverted') {
        throw new Error('Collect transaction reverted');
      }

      tx = hash;
    } else {
      /**
       * @see(https://github.com/velodrome-finance/docs/blob/main/content/sdk.mdx#emissions-claiming)
       * Base Pools
       * Emissions Claiming
       *
       * To claim emissions for a staked deposit,
       * call the Gauge contract function getReward()
       * passing the LP depositor address.
       */
      const { request: rewardBaseRequest } = await simulateContract(
        wagmiConfig,
        {
          address: gauge,
          abi: ammGaugeAbi,
          functionName: 'getReward',
          args: [walletAddress],
          chainId: chainId,
          account: walletAddress as Address,
        }
      );

      const hash = await writeContract(wagmiConfig, rewardBaseRequest);

      const rewardBaseReceipt = await waitForTransactionReceipt(viemClient, {
        hash: hash as Address,
        retryDelay: () => 1100,
      });

      if (rewardBaseReceipt.status === 'reverted') {
        throw new Error('Claim emission transaction reverted');
      }

      tx = hash;
    }

    if (!tx) {
      throw new Error('Invalid transaction');
    }

    const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
      hash: tx,
    });

    return { receipt, chainId };
  }

  async claimLockRewards(data: IClaimLockRewards) {
    const { walletAddress: address, lockIds, feeBn, chainId } = data;
    const account = getAccount(wagmiConfig);
    await this._switchChain(account, chainId);

    const isMany = lockIds.length > 1;
    const { votingEscrow } = chainsConfig[chainId];

    if (lockIds.length === 0) {
      throw new Error('No lock IDs provided');
    }

    if (!SWAPPER_CONTRACT[chainId])
      throw new Error(
        `Can not find the swapper contract on the chain: ${chainId}`
      );

    for (const id of lockIds) {
      await this.approveNft(
        chainId,
        votingEscrow,
        id,
        address,
        SWAPPER_CONTRACT[chainId]
      );
    }

    const simulationData = await simulateContract(wagmiConfig, {
      address: SWAPPER_CONTRACT[chainId] as Address,
      abi: SWAPPER_ABI[chainId],
      functionName: isMany ? 'claimManyRebases' : 'claimRebases',
      args: isMany
        ? [lockIds.map(BigInt), BigInt(feeBn)]
        : [BigInt(lockIds[0]), BigInt(feeBn)],
      chainId: chainId,
      value: BigInt(feeBn),
      account: address,
    });

    const hash = await writeContract(wagmiConfig, simulationData.request);

    const viemClient = this.viemService.getViemClient(chainId);
    await waitForTransactionReceipt(viemClient, {
      hash: hash as Address,
      retryDelay: () => 1100,
    });

    if (!hash) {
      throw new Error('Invalid transaction');
    }

    const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
      hash,
    });

    return { receipt, chainId };
  }

  async claimTradingOrEmissionFeeHandler(
    data: IClaimTradingFee | IClaimEmissionFee
  ) {
    if (data.action === EActionType.CLAIM_TRADING_FEE) {
      return this.claimTradingFee(data);
    } else {
      return this.claimEmissionFee(data);
    }
  }

  async lockTokens(data: ICreateLock) {
    const {
      walletAddress: address,
      amountBn,
      amountToApproveBn,
      feeBn,
      duration,
      token_address,
      chainId,
    } = data;
    const account = getAccount(wagmiConfig);

    await this._switchChain(account, chainId);

    await this.approveToken(chainId, address, token_address, amountToApproveBn);

    if (!SWAPPER_CONTRACT[chainId])
      throw new Error(
        `Can not find the swapper contract on the chain: ${chainId}`
      );

    const sd = await simulateContract(wagmiConfig, {
      address: SWAPPER_CONTRACT[chainId] as Address,
      abi: SWAPPER_ABI[chainId],
      functionName: 'createLockFor',
      args: [amountBn, duration, address, feeBn],
      chainId: chainId,
      value: feeBn,
      account: address as Address,
    });

    const hash = await writeContract(wagmiConfig, sd.request);

    const viemClient = this.viemService.getViemClient(chainId);
    await waitForTransactionReceipt(viemClient, {
      hash: hash as Address,
      retryDelay: () => 1100,
    });

    if (!hash) {
      throw new Error('Invalid transaction');
    }

    const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
      hash,
    });

    return { receipt, chainId };
  }

  async increaseLock(data: IIncreaseLock) {
    const {
      walletAddress: address,
      amountBn,
      amountToApproveBn,
      feeBn,
      lockId,
      token_address,
      chainId,
    } = data;
    const account = getAccount(wagmiConfig);
    const { votingEscrow } = chainsConfig[chainId];

    await this._switchChain(account, chainId);

    if (!SWAPPER_CONTRACT[chainId])
      throw new Error(
        `Can not find the swapper contract on the chain: ${chainId}`
      );

    await this.approveToken(
      chainId,
      address,
      token_address,
      BigInt(amountToApproveBn)
    );
    await this.approveNft(
      chainId,
      votingEscrow,
      lockId,
      address,
      SWAPPER_CONTRACT[chainId]
    );

    const simulationData = await simulateContract(wagmiConfig, {
      address: SWAPPER_CONTRACT[chainId] as Address,
      abi: SWAPPER_ABI[chainId],
      functionName: 'increaseAmount',
      args: [BigInt(lockId), amountBn, BigInt(feeBn)],
      chainId: chainId,
      value: BigInt(feeBn),
      account: address,
    });

    const hash = await writeContract(wagmiConfig, simulationData.request);

    const viemClient = this.viemService.getViemClient(chainId);
    await waitForTransactionReceipt(viemClient, {
      hash: hash as Address,
      retryDelay: () => 1100,
    });

    if (!hash) {
      throw new Error('Invalid transaction');
    }

    const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
      hash,
    });

    return { receipt, chainId };
  }

  async vote(data: IVote) {
    const { tokenId, pools, powers, chainId } = data;
    const { address } = getAccount(wagmiConfig);
    const account = getAccount(wagmiConfig);
    const { voter } = chainsConfig[chainId];
    await this._switchChain(account, chainId);

    if (!address) {
      throw new Error('Invalid account');
    }

    const { request } = await simulateContract(wagmiConfig, {
      address: voter,
      abi: voterAbi,
      functionName: 'vote',
      args: [tokenId, pools, powers],
      chainId: chainId,
      account: address,
    });

    const hash = await writeContract(wagmiConfig, request);

    const viemClient = this.viemService.getViemClient(chainId);
    await waitForTransactionReceipt(viemClient, {
      hash: hash as Address,
      retryDelay: () => 1100,
    });

    if (!hash) {
      throw new Error('Invalid transaction');
    }

    const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
      hash,
    });

    return { receipt, chainId };
  }

  async extendLock(data: IExtendLock) {
    const { walletAddress: address, duration, lockId, chainId } = data;
    const account = getAccount(wagmiConfig);
    const { votingEscrow } = chainsConfig[chainId];
    await this._switchChain(account, chainId);

    const simulationData = await simulateContract(wagmiConfig, {
      address: votingEscrow,
      abi: veNftAbi,
      functionName: 'increaseUnlockTime',
      args: [BigInt(lockId), duration],
      chainId: chainId,
      account: address as Address,
    });

    const hash = await writeContract(wagmiConfig, simulationData.request);

    const viemClient = this.viemService.getViemClient(chainId);
    await waitForTransactionReceipt(viemClient, {
      hash: hash as Address,
      retryDelay: () => 1100,
    });

    if (!hash) {
      throw new Error('Invalid transaction');
    }

    const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
      hash,
    });

    return { receipt, chainId };
  }

  async mergeLocks(data: IMergeLocks) {
    const { lockIds, walletAddress: address, feeBn, chainId } = data;
    const account = getAccount(wagmiConfig);
    const { votingEscrow } = chainsConfig[chainId];

    await this._switchChain(account, chainId);

    if (!SWAPPER_CONTRACT[chainId])
      throw new Error(
        `Can not find the swapper contract on the chain: ${chainId}`
      );

    for (let i = 0; i < lockIds.length; i++) {
      const lockId = lockIds[i];
      await this.approveNft(
        chainId,
        votingEscrow,
        lockId,
        address,
        SWAPPER_CONTRACT[chainId]
      );
    }

    const [from, to] = lockIds;

    const simulationData = await simulateContract(wagmiConfig, {
      address: SWAPPER_CONTRACT[chainId] as Address,
      abi: SWAPPER_ABI[chainId],
      functionName: 'merge',
      args: [from, to, BigInt(feeBn)],
      chainId: chainId,
      value: BigInt(feeBn),
      account: address,
    });

    const hash = await writeContract(wagmiConfig, simulationData.request);

    const viemClient = this.viemService.getViemClient(chainId);
    await waitForTransactionReceipt(viemClient, {
      hash: hash as Address,
      retryDelay: () => 1100,
    });

    if (!hash) {
      throw new Error('Invalid transaction');
    }

    const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
      hash,
    });

    return { receipt, chainId };
  }

  async transferLock(data: ITransferLock) {
    const { lockId, walletAddress: address, toAddress, feeBn, chainId } = data;
    const account = getAccount(wagmiConfig);
    const { votingEscrow } = chainsConfig[chainId];
    await this._switchChain(account, chainId);

    if (!SWAPPER_CONTRACT[chainId])
      throw new Error(
        `Can not find the swapper contract on the chain: ${chainId}`
      );

    await this.approveNft(
      chainId,
      votingEscrow,
      lockId,
      address,
      SWAPPER_CONTRACT[chainId]
    );

    const simulationData = await simulateContract(wagmiConfig, {
      address: SWAPPER_CONTRACT[chainId] as Address,
      abi: SWAPPER_ABI[chainId],
      functionName: 'transferLock',
      args: [lockId, toAddress, BigInt(feeBn)],
      chainId: chainId,
      value: BigInt(feeBn),
      account: address,
    });

    const hash = await writeContract(wagmiConfig, simulationData.request);

    const viemClient = this.viemService.getViemClient(chainId);
    await waitForTransactionReceipt(viemClient, {
      hash: hash as Address,
      retryDelay: () => 1100,
    });

    if (!hash) {
      throw new Error('Invalid transaction');
    }

    const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
      hash,
    });

    return { receipt, chainId };
  }

  async setLockToRelay(data: ISetLockToRaley) {
    const { tokenId, mTokenId, chainId } = data;
    const account = getAccount(wagmiConfig);
    const { voter } = chainsConfig[chainId];

    await this._switchChain(account, chainId);

    const { request } = await simulateContract(wagmiConfig, {
      address: voter,
      abi: voterAbi,
      functionName: 'depositManaged',
      args: [tokenId, mTokenId],
      chainId: chainId,
      account: account?.address,
    });

    const hash = await writeContract(wagmiConfig, request);

    const viemClient = this.viemService.getViemClient(chainId);
    await waitForTransactionReceipt(viemClient, {
      hash: hash as Address,
      retryDelay: () => 1100,
    });

    if (!hash) {
      throw new Error('Invalid transaction');
    }

    const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
      hash,
    });

    return { receipt, chainId };
  }

  async withdrawLock(lockData: IWithdrawLock) {
    const { walletAddress: address, feeBn, lockId, chainId } = lockData;
    const account = getAccount(wagmiConfig);
    const { votingEscrow } = chainsConfig[chainId];

    await this._switchChain(account, chainId);

    if (!SWAPPER_CONTRACT[chainId])
      throw new Error(
        `Can not find the swapper contract on the chain: ${chainId}`
      );

    await this.approveNft(
      chainId,
      votingEscrow,
      lockId,
      address,
      SWAPPER_CONTRACT[chainId]
    );

    const { request } = await simulateContract(wagmiConfig, {
      address: SWAPPER_CONTRACT[chainId] as Address,
      abi: SWAPPER_ABI[chainId],
      functionName: 'withdraw',
      args: [BigInt(lockId), BigInt(feeBn)],
      chainId: chainId,
      account: account?.address,
      value: BigInt(feeBn),
    });

    const hash = await writeContract(wagmiConfig, request);

    const tx = hash;

    const viemClient = this.viemService.getViemClient(chainId);
    await waitForTransactionReceipt(viemClient, {
      hash: hash as Address,
      retryDelay: () => 1100,
    });

    if (!tx) {
      throw new Error('Invalid transaction');
    }

    const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
      hash,
    });

    return { receipt, chainId };
  }

  async claimVotingRewards(lockData: IClaimVotingReward) {
    const {
      walletAddress,
      bribes,
      rewardTokens,
      veNFTTokenId,
      feeBn,
      chainId,
    } = lockData;
    const account = getAccount(wagmiConfig);
    const { votingEscrow } = chainsConfig[chainId];
    await this._switchChain(account, chainId);

    if (!SWAPPER_CONTRACT[chainId])
      throw new Error(
        `Can not find the swapper contract on the chain: ${chainId}`
      );

    await this.approveNft(
      chainId,
      votingEscrow,
      String(veNFTTokenId),
      walletAddress,
      SWAPPER_CONTRACT[chainId]
    );

    const { request } = await simulateContract(wagmiConfig, {
      address: SWAPPER_CONTRACT[chainId] as Address,
      abi: SWAPPER_ABI[chainId],
      functionName: 'claimBribes',
      args: [bribes, rewardTokens, veNFTTokenId, feeBn],
      chainId,
      account: account?.address,
      value: feeBn,
    });

    const hash = await writeContract(wagmiConfig, request);

    const tx = hash;

    const viemClient = this.viemService.getViemClient(chainId);
    await waitForTransactionReceipt(viemClient, {
      hash: hash as Address,
      retryDelay: () => 1100,
    });

    if (!tx) {
      throw new Error('Invalid transaction');
    }

    const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
      hash,
    });

    return { receipt, chainId };
  }

  async resetLock(data: IResetLock) {
    const { walletAddress, lockId, chainId } = data;
    const account = getAccount(wagmiConfig);
    await this._switchChain(account, chainId);

    const { voter } = chainsConfig[chainId];

    const { request } = await simulateContract(wagmiConfig, {
      address: voter,
      abi: voterAbi,
      functionName: 'reset',
      args: [BigInt(lockId)],
      chainId,
      account: walletAddress,
      value: undefined,
    });

    const hash = await writeContract(wagmiConfig, request);

    const tx = hash;

    const viemClient = this.viemService.getViemClient(chainId);
    await waitForTransactionReceipt(viemClient, {
      hash: hash as Address,
      retryDelay: () => 1100,
    });

    if (!tx) {
      throw new Error('Invalid transaction');
    }

    const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
      hash,
    });

    return { receipt, chainId };
  }

  async pokeLock(data: IPokeLock) {
    const { walletAddress, lockId, chainId } = data;
    const account = getAccount(wagmiConfig);
    await this._switchChain(account, chainId);

    const { voter } = chainsConfig[chainId];

    const { request } = await simulateContract(wagmiConfig, {
      address: voter,
      abi: voterAbi,
      functionName: 'poke',
      args: [BigInt(lockId)],
      chainId,
      account: walletAddress,
      value: undefined,
    });

    const hash = await writeContract(wagmiConfig, request);

    const tx = hash;

    const viemClient = this.viemService.getViemClient(chainId);
    await waitForTransactionReceipt(viemClient, {
      hash: hash as Address,
      retryDelay: () => 1100,
    });

    if (!tx) {
      throw new Error('Invalid transaction');
    }

    const receipt = await this.getTransactionReceiptWithRetry(wagmiConfig, {
      hash,
    });

    return { receipt, chainId };
  }

  async resetLockMultiple(calls: IResetLock[], chatId: string) {
    return this._executeBatch(
      calls,
      chatId,
      this.resetLock.bind(this),
      ETxMessageType.RESET_LOCK
    );
  }

  async pokeLockMultiple(calls: IPokeLock[], chatId: string) {
    return this._executeBatch(
      calls,
      chatId,
      this.pokeLock.bind(this),
      ETxMessageType.POKE_LOCK
    );
  }

  async claimVotingRewardsMultiple(
    calls: IClaimVotingReward[],
    chatId: string
  ) {
    return this._executeBatch(
      calls,
      chatId,
      this.claimVotingRewards.bind(this),
      ETxMessageType.CLAIM_VOTING_REWARDS
    );
  }

  async claimLockRewardsMultiple(calls: IClaimLockRewards[], chatId: string) {
    return this._executeBatch(
      calls,
      chatId,
      this.claimLockRewards.bind(this),
      ETxMessageType.CLAIM_LOCK_REWARDS
    );
  }

  async withdrawLockMultiple(calls: IWithdrawLock[], chatId: string) {
    return this._executeBatch(
      calls,
      chatId,
      this.withdrawLock.bind(this),
      ETxMessageType.WITHDRAW_LOCK
    );
  }

  async transferMultiple(calls: ITransferLock[], chatId: string) {
    return this._executeBatch(
      calls,
      chatId,
      this.transferLock.bind(this),
      ETxMessageType.TRANSFER_LOCK
    );
  }

  async mergeMultiple(calls: IMergeLocks[], chatId: string) {
    return this._executeBatch(
      calls,
      chatId,
      this.mergeLocks.bind(this),
      ETxMessageType.MERGE_LOCKS
    );
  }

  async unStakeMultiple(calls: IUnstake[], chatId: string) {
    return this._executeBatch(
      calls,
      chatId,
      this.unStake.bind(this),
      ETxMessageType.UNSTAKE
    );
  }

  async withdrawMultiple(calls: IWithdraw[], chatId: string) {
    return this._executeBatch(
      calls,
      chatId,
      this.withdraw.bind(this),
      ETxMessageType.WITHDRAW
    );
  }

  async swapMultiple(calls: ISwap[], chatId: string) {
    return this._executeBatch(
      calls,
      chatId,
      this.swap.bind(this),
      ETxMessageType.SWAP
    );
  }

  async voteMultiple(calls: IVote[], chatId: string) {
    return this._executeBatch(
      calls,
      chatId,
      this.vote.bind(this),
      ETxMessageType.VOTE
    );
  }

  async increaseLockMultiple(calls: IIncreaseLock[], chatId: string) {
    return this._executeBatch(
      calls,
      chatId,
      this.increaseLock.bind(this),
      ETxMessageType.INCREASE_LOCK
    );
  }

  async extendLockMultiple(calls: IExtendLock[], chatId: string) {
    return this._executeBatch(
      calls,
      chatId,
      this.extendLock.bind(this),
      ETxMessageType.EXTEND_LOCK
    );
  }

  async lockMultiple(calls: ICreateLock[], chatId: string) {
    return this._executeBatch(
      calls,
      chatId,
      this.lockTokens.bind(this),
      ETxMessageType.LOCK_TOKENS
    );
  }

  async stakeMultiple(calls: IStake[], chatId: string) {
    return this._executeBatch(
      calls,
      chatId,
      this.stake.bind(this),
      ETxMessageType.STAKE
    );
  }

  async setLockToRelayMultiple(calls: ISetLockToRaley[], chatId: string) {
    return this._executeBatch(
      calls,
      chatId,
      this.setLockToRelay.bind(this),
      ETxMessageType.SET_LOCK_TO_RELAY
    );
  }

  async claimTradingOrEmissionFeeMultiple(
    calls: (IClaimTradingFee | IClaimEmissionFee)[],
    chatId: string
  ) {
    return this._executeBatch(
      calls,
      chatId,
      this.claimTradingOrEmissionFeeHandler.bind(this),
      ETxMessageType.CLAIM_TRADING_FEE
    );
  }

  async getAllTokens(chainIds: number[]) {
    try {
      const url = `/api/dex/tokens`;
      const { data } = await $api.get<IToken[]>(url, {
        params: {
          chains: chainIds,
        },
        headers: {
          Accept: 'application/json',
        },
      });

      const tokensObj: Record<Address, IToken> = {};
      data?.forEach(el => {
        tokensObj[el.token_address] = el;
      });

      appStore.setState({ tokens: tokensObj });
      return data;
    } catch (error) {
      console.error('Error fetching tokens list', error);
      return [];
    }
  }

  async getRebaseApr() {
    try {
      const url = '/api/dex/rebase-aprs';
      const { data } = await $api.get<{
        rebaseAprs: { chainId: number; rebaseApr: number }[];
      }>(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      return data.rebaseAprs;
    } catch (error) {
      console.error('Error fetching rebase APRs', error);
      return [];
    }
  }

  async getTransactionReceiptWithRetry(
    client: typeof wagmiConfig,
    {
      hash,
      maxRetries = 10,
      delayMs = 2000,
    }: {
      hash: Address;
      maxRetries?: number;
      delayMs?: number;
    }
  ): Promise<ReturnType<typeof getTransactionReceipt>> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await getTransactionReceipt(client, { hash });
      } catch (err) {
        if (attempt === maxRetries) {
          throw err;
        }
        console.error(
          `Getting Receipt failed (attempt ${attempt + 1}), retrying in ${delayMs}ms...`,
          err
        );
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    throw new Error(
      `Failed to get transaction receipt after retries, tx hash: ${hash}`
    );
  }

  private async approveToken(
    chainId: TChainId,
    fromAddress: Address,
    tokenAddress: Address,
    amountToApproveBN: bigint
  ) {
    const account = getAccount(wagmiConfig);

    await this._switchChain(account, chainId);

    const swapperContractAddress = SWAPPER_CONTRACT[chainId];

    if (!swapperContractAddress)
      throw new Error(
        `Can not find the swapper contract on the chain: ${chainId}`
      );

    const allowance = await readContract(wagmiConfig, {
      address: tokenAddress,
      functionName: 'allowance',
      args: [fromAddress, SWAPPER_CONTRACT[chainId] as `0x${string}`],
      abi: erc20Abi,
    });

    const { connector } = getAccount(wagmiConfig);

    if (allowance < amountToApproveBN) {
      const hash = await writeContract(wagmiConfig, {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [SWAPPER_CONTRACT[chainId] as `0x${string}`, amountToApproveBN],
        chainId: chainId,
        connector,
      });

      const viemClient = this.viemService.getViemClient(chainId);

      await waitForTransactionReceipt(viemClient, {
        hash: hash as Address,
        retryDelay: () => 1100,
      });
    }
  }

  private async approveNft(
    chainId: TChainId,
    npfm: Address,
    tokenId: string,
    walletAddress: Address,
    spender: Address | undefined
  ) {
    if (!spender) {
      throw new Error('Invalid swapper contract');
    }
    const { connector, address } = getAccount(wagmiConfig);
    const account = getAccount(wagmiConfig);

    await this._switchChain(account, chainId);

    if (walletAddress.toLowerCase() !== address?.toLowerCase()) {
      throw new Error('Invalid wallet address');
    }

    const hash = await writeContract(wagmiConfig, {
      address: npfm,
      abi: erc721Abi,
      functionName: 'approve',
      args: [spender, BigInt(tokenId)],
      chainId: chainId,
      connector,
    });

    const viemClient = this.viemService.getViemClient(chainId);

    await waitForTransactionReceipt(viemClient, {
      hash: hash as Address,
      retryDelay: () => 1100,
    });
  }

  private async _executeBatch<T extends { success: boolean }>(
    calls: T[],
    chatId: string,
    method: (call: T) => Promise<ITransaction>,
    txType: ETxMessageType
  ) {
    const { setIsTransactionSubmitting } = chatsStore.getState();
    setIsTransactionSubmitting(true);

    const txs: ITransaction[] = [];

    try {
      for (const call of calls) {
        try {
          if (!call.success) {
            throw new Error('Transaction failed');
          }
          const tx = await method(call);
          txs.push(tx);
        } catch (error) {
          console.error('Error sending transaction message', error);
          if (error instanceof Error) {
            await chatService.sendErrorMessage(chatId, error.message);
          }
        }
      }

      if (txs.length > 0) {
        await chatService.sendTxMessage(chatId, txs, txType);
      }

      return txs;
    } catch (error) {
      console.error('Error processing transactions', error);
    } finally {
      setIsTransactionSubmitting(false);
    }
  }

  private async _switchChain(account: GetAccountReturnType, chainId: TChainId) {
    if (account.chainId !== chainId && account.connector?.switchChain) {
      await switchChain(wagmiConfig, {
        chainId: chainId,
      });
    }
  }
}

export const aerodromeService = new AerodromeService();
