import { http, createConfig } from '@wagmi/core'
import { readContract } from '@wagmi/core';
import { DAPP_RATING_SYSTEM_CONTRACT_ADDRESS, DAPP_RATING_SYSTEM_CONTRACT_ABI, CURRENT_WAGMI_CHAIN} from './contracts'
import { DappRegistered } from './fetchFromSubgraph';

const config = createConfig({
    chains: [CURRENT_WAGMI_CHAIN],
    transports: {
      [CURRENT_WAGMI_CHAIN.id]: http(),
    },
  })

  export async function fetchAllDapps(): Promise<DappRegistered[]> {
    try {
      const dappData = await readContract(config, {
        address: DAPP_RATING_SYSTEM_CONTRACT_ADDRESS as `0x${string}`,
        abi: DAPP_RATING_SYSTEM_CONTRACT_ABI,
        functionName: "getAllDapps",
      });
  
      console.log("DApp data received:", dappData);
  
      return dappData as DappRegistered[];
    } catch (error) {
      console.error("Failed to fetch DApp data:", error);
      return [];
    }
  }


  // example
  // const dappData = await readContract(config, {
  //   address: DAPP_RATING_SYSTEM_CONTRACT_ADDRESS as `0x${string}`,
  //   abi: DAPP_RATING_SYSTEM_CONTRACT_ABI,
  //   functionName: "getAllDapps",
  // });
  // console.log("DApp data received:", dappData);