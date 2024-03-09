import { NextRequest } from 'next/server'
import { ethers } from 'ethers'
import { jsonResponse } from '@/app/utils/response'
import { getValidateMessage } from '@/app/utils/farcasterAPI'
import { homeHtml, notFoundHtml } from '@/app/utils/html'
import { getBuyPriceAfterFee } from '@/app/utils/contract'

export const dynamic = 'force-dynamic' // static by default, unless reading the request

export async function POST(request: NextRequest) {
  const host = request.nextUrl.origin
  const body = await new Response(request.body).json();
  const data = await getValidateMessage(body.trustedData.messageBytes)
  const frameActionBody = data.message.data.frameActionBody

  console.log('txdata frameActionBody: ', frameActionBody)

  const stateEncoded = Buffer.from(frameActionBody.state, 'base64').toString('binary')
  const state = Buffer.from(stateEncoded, 'base64').toString('binary')
  const targetKeyOwner = JSON.parse(state)

  const jsonABI = [{
    "inputs": [
      {
        "internalType": "uint256",
        "name": "creatorId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "sharesAmount",
        "type": "uint256"
      }
    ],
    "name": "buyShares",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }]

  const contractInterface = new ethers.Interface(jsonABI)
  const calldata = contractInterface.encodeFunctionData('buyShares', [targetKeyOwner.fid, 1])

  const buyPriceAfterFee = await getBuyPriceAfterFee(targetKeyOwner.fid, 1)

  const txData = {
    chainId: "eip155:10",
    method: "eth_sendTransaction",
    params: {
      abi: jsonABI,
      to: "0x6Df43106F7A4Ba0D1e9653eDA49530333A6B2D98",
      data: calldata,
      value: buyPriceAfterFee.toString(),
    },
  };

  return jsonResponse(JSON.stringify(txData))
}
