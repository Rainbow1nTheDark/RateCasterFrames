import { baseSepolia } from '@wagmi/core/chains'
import DappRatingSystemABI from './abi/DappRatingSystem.json';

const baseSepoliaChainId = 84532;

// Current Operating Chain - baseSepolia
export const CURRENT_CHAIN_ID = baseSepoliaChainId;
export const CURRENT_WAGMI_CHAIN = baseSepolia;

// Current Contract Addresses
export const DAPP_RATING_SYSTEM_CONTRACT_ADDRESS = "0x0683A7321f397cDf50a4554914C453EE3C98A55B";
export const DAPP_RATING_SYSTEM_CONTRACT_ABI = DappRatingSystemABI;