import { frames } from "../../../frames";
import { transaction } from "frames.js/core";
import { encodeFunctionData, Abi } from 'viem'; 
import DappRatingSystemABI from '../../../../../public/abi/DappRatingSystem.json' assert { type: 'json' };

export const POST = frames(async (ctx) => {
    const dappId = ctx.searchParams.dappId;
    const inputText = ctx.message?.inputText;

    console.log('Output|' + dappId + '|' + inputText)
  // Create calldata for the transaction using Viem's `encodeFunctionData`
  const calldata = encodeFunctionData({
    abi: DappRatingSystemABI,
    functionName: "addDappRating",
    args: [dappId, parseInt(inputText ?? '', 10), ' '],
  });
  
  // Return transaction data that conforms to the correct type
  return transaction({
    chainId: "eip155:84532", // Base Sepolia
    method: "eth_sendTransaction",
    params: {
      abi: DappRatingSystemABI as Abi,
      to: '0x30A622c03aaf163F9eEEF259aAc49d261047CB53',
      data: calldata,
    },
  });
});