import { yellow, green, red } from 'kleur'
import lighthouse from '../Lighthouse'
import bytesToSize from './utils/byteToSize'

const showResponse = (cid: string, dealStatus: any) => {
  console.log(
    yellow('\r\nCID:') +
      Array(9).fill('\xa0').join('') +
      cid
  )

  console.log(
    Array(20).fill('\xa0').join('') +
      yellow('Miner : ') +
      Array(10).fill('\xa0').join('') +
      yellow('DealId: ')
  )

  for (let i = 0; i < dealStatus.length; i++) {
    const gap = 10 + (8 - dealStatus[i]['Provider'].length)
    console.log(
      Array(20).fill('\xa0').join('') +
        dealStatus[i]['Provider'] +
        Array(gap).fill('\xa0').join('') +
        dealStatus[i]['DealID']
    )
  }
  console.log(
    green('\r\nView deals at filfox URL:\r\n') +
      Array(4).fill('\xa0').join('') +
      'https://filfox.info/en/deal/' +
      dealStatus[0]['DealID']
  )
}

export default async function (data: any, options: any) {
  if (JSON.stringify(data) === '{}') {
    console.log(yellow('Select an option:'))
    options.help()
  } else {
    try {
      const dealStatus = (await lighthouse.dealStatus(data)).data
      dealStatus.length === 0
        ? console.log('Deal creation in progress')
        : showResponse(data, dealStatus)
    } catch (error: any) {
      console.log(red(error.message))
      process.exit(0)
    }
  }
}
