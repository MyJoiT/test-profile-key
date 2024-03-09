import { ethers } from 'ethers'

const storageRegistryContract = '0x6Df43106F7A4Ba0D1e9653eDA49530333A6B2D98';
const apiKey = 'FN1veTXn6WMxLcRoFWCeOqG-M60KxCCU'
const provider = new ethers.AlchemyProvider(10, apiKey)

const abi = [
  'function getBuyPrice(uint256 creatorId,uint256 amount) external view returns (uint256)',
  'function getSellPrice(uint256 creatorId,uint256 amount) external view returns (uint256)',
  'function getBuyPriceAfterFee(uint256 creatorId,uint256 amount) external view returns (uint256)',
  'function getSellPriceAfterFee(uint256 creatorId,uint256 amount) external view returns (uint256)'
]

const market = new ethers.Contract(storageRegistryContract, abi, provider)

export const getBuyPrice = async (creatorId: number, amount: number) => {
  return await market.getBuyPrice(creatorId, amount)
}

export const getSellPrice = async (creatorId: number, amount: number) => {
  return await market.getSellPrice(creatorId, amount)
}

export const getBuyPriceAfterFee = async (creatorId: number, amount: number) => {
  return await market.getBuyPriceAfterFee(creatorId, amount)
}

export const getSellPriceAfterFee = async (creatorId: number, amount: number) => {
  return await market.getSellPriceAfterFee(creatorId, amount)
}
