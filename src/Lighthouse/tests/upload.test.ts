import { resolve } from 'path'
import lighthouse from '..'
import 'dotenv/config'

describe('uploadFiles', () => {
  const apiKey = process.env.TEST_API_KEY as string

  it('should upload file to ipfs when correct path is provided', async () => {
    const path = resolve(
      process.cwd(),
      'src/Lighthouse/tests/testImages/testImage1.svg'
    )
    const fileName = path.split('/').slice(-1)[0]
    const deployResponse = (await lighthouse.upload(path, apiKey, false)).data

    expect(deployResponse).toHaveProperty('Name')
    expect(deployResponse).toHaveProperty('Hash')
    expect(deployResponse).toHaveProperty('Size')

    expect(deployResponse['Name']).toBe(fileName)
    expect(typeof deployResponse['Hash']).toBe('string')
    expect(typeof deployResponse['Size']).toBe('string')
  }, 60000)

  it('should upload folder to ipfs when correct path is provided', async () => {
    const path = resolve(process.cwd(), 'src/Lighthouse/tests/testImages')
    const full_deployResponse = (await lighthouse.upload(path, apiKey, true))
      .data

    expect(full_deployResponse.length).toBeGreaterThan(1)
    const deployResponse = full_deployResponse[0]
    expect(deployResponse).toHaveProperty('Name')
    expect(deployResponse).toHaveProperty('Hash')
    expect(deployResponse).toHaveProperty('Size')

    expect(deployResponse).toHaveProperty('Name')
    expect(typeof deployResponse['Hash']).toBe('string')
    expect(typeof deployResponse['Size']).toBe('string')
  }, 60000)

  it('should not upload to ipfs when incorrect path is provided', async () => {
    try {
      const path = 'invalid/path/img.svg'
      const deployResponse = await lighthouse.upload(path, apiKey, false)
    } catch (error) {
      expect(error.code).toBe('ENOENT')
    }
  }, 60000)

  it('should not upload to ipfs when wrong API key is provided', async () => {
    try {
      const path = resolve(
        process.cwd(),
        'src/Lighthouse/tests/testImages/testImage1.svg'
      )
      await lighthouse.upload(path, 'random apiKey')
    } catch (error) {
      expect(error.message).toBe('Request failed with status code 500')
    }
  }, 60000)
})
