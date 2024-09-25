import { polygon } from '@wagmi/core/chains'
import DappRatingSystemABI from './abi/DappRatingSystem.json';

// const baseSepoliaChainId = 84532;
const POLYGON_MAINNET = 137;

// Current Operating Chain - baseSepolia
export const CURRENT_CHAIN_ID = POLYGON_MAINNET;
export const CURRENT_WAGMI_CHAIN = polygon;

// Current Contract Addresses
export const DAPP_RATING_SYSTEM_CONTRACT_ADDRESS = "0xD6E93AC22B754427077290d660442564BB7E6760";
export const DAPP_RATING_SYSTEM_CONTRACT_ABI = DappRatingSystemABI;