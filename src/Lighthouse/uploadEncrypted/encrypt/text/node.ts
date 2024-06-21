/* istanbul ignore file */
import axios from 'axios'
import { FormData } from 'formdata-node';
import { encryptFile } from '../../encryptionNode'
import { generate, saveShards } from '@lighthouse-web3/kavach'
import { lighthouseConfig } from '../../../../lighthouse.config'

export default async (
  text: string,
  apiKey: string,
  publicKey: string,
  signedMessage: string,
  name: string
) => {
  try {
    const token = 'Bearer ' + apiKey
    const endpoint = lighthouseConfig.lighthouseNode + '/api/v0/add'

    // Upload file
    const formDdata = new FormData()

    const { masterKey: fileEncryptionKey, keyShards } = await generate()

    const encryptedData = await encryptFile(
      Buffer.from(text),
      fileEncryptionKey
    )
    const blob = new Blob([Buffer.from(encryptedData)]);
    formDdata.set('file', blob, name)

    const response = await axios.post(endpoint, formDdata, {
      withCredentials: true,
      maxContentLength: Infinity, //this is needed to prevent axios from erroring out with large directories
      maxBodyLength: Infinity,
      headers: {
        'Content-type': `multipart/form-data;`,
        Encryption: 'true',
        'Mime-Type': 'text/plain',
        Authorization: token,
      },
    })

    const { error } = await saveShards(
      publicKey,
      response.data.Hash,
      signedMessage,
      keyShards
    )

    if (error) {
      throw new Error('Error encrypting file')
    }
    return { data: response.data }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
