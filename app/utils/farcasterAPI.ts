interface IProof {
    timestamp: number,
    name: string,
    owner: string,
    signature: string,
    fid: number,
    type: string
}

export const getFidByUsername = async (name: string) => {
  const api = `https://nemes.farcaster.xyz:2281/v1/userNameProofByName?name=${ name }`
  const proof = await fetch(api)
  const proofJson = await proof.json() as IProof
  return proofJson.fid
}

export const getAvatarByFid = async (fid: number) => {
  const api = `https://nemes.farcaster.xyz:2281/v1/userDataByFid?fid=${ fid }&user_data_type=1`
  const response = await fetch(api)
  const userData = await response.json()
  return userData.data.userDataBody.value
}

export const getNicknameByFid = async (fid: number) => {
  const api = `https://nemes.farcaster.xyz:2281/v1/userDataByFid?fid=${ fid }&user_data_type=2`
  const response = await fetch(api)
  const userData = await response.json()
  return userData.data.userDataBody.value
}
