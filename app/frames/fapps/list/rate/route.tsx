import { frames } from "../../../frames";
import { transaction } from "frames.js/core";
import { encodeFunctionData, Abi } from 'viem'; 
import { DAPP_RATING_SYSTEM_CONTRACT_ADDRESS, DAPP_RATING_SYSTEM_CONTRACT_ABI, CURRENT_CHAIN_ID}  from '../../../../../scripts/on-chain/contracts'

export const POST = frames(async (ctx) => {
    const dappId = ctx.searchParams.dappId;
    const inputText = ctx.message?.inputText;

    console.log('Output|' + dappId + '|' + inputText)
  // Create calldata for the transaction using Viem's `encodeFunctionData`
  const calldata = encodeFunctionData({
    abi: DAPP_RATING_SYSTEM_CONTRACT_ABI,
    functionName: "addDappRating",
    args: [dappId, parseInt(inputText ?? '', 10), ' '],
  });
  
  // Return transaction data that conforms to the correct type
  return transaction({
    chainId: `eip155:${CURRENT_CHAIN_ID}`, // Base Sepolia
    method: "eth_sendTransaction",
    params: {
      abi: DAPP_RATING_SYSTEM_CONTRACT_ABI as Abi,
      to: DAPP_RATING_SYSTEM_CONTRACT_ADDRESS,
      data: calldata,
    },
  });
});