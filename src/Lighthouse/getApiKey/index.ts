import axios from 'axios'
import { lighthouseConfig } from '../../lighthouse.config'

export type apiKeyResponse = {
  data: {
    apiKey: string
  }
}

export default async (
  publicKey: string,
  signedMessage: string
): Promise<apiKeyResponse> => {
  try {
    const apiKey = (
      await axios.post(
        lighthouseConfig.lighthouseAPI + `/api/auth/create_api_key`,
        {
          publicKey: publicKey,
          signedMessage: signedMessage,
        }
      )
    ).data
    /*
      return:
        { data: { apiKey: '489a497e-4e0c-4cb5-9522-ca07740f6dfb' } }
    */
    return { data: { apiKey } }
  } catch (error: any) {
    throw new Error(error.response.data)
  }
}
