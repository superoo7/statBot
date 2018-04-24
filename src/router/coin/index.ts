import axios from 'axios'
import crypto from './convert'

let getOnlyPrice = async (coin: string, currency: string) => {
  console.log(crypto[coin])
  if (!!crypto[coin]) {
    let res = await axios.get(
      `https://api.coinmarketcap.com/v1/ticker/${crypto[coin]}/?convert=${currency}`
    )
    let price: number = res.data[0][`price_${currency.toLowerCase()}`] || 0
    return price
  } else {
    let res = await axios.get(
      `https://api.coinmarketcap.com/v1/ticker/${coin}/?convert=${currency}`
    )
    let price: number = res.data[0][`price_${currency.toLowerCase()}`] || 0
    return price
  }
}

let countRatio = async (coin1: string, coin2: string) => {
  let data: number[] = await Promise.all([
    await getOnlyPrice(coin1, 'USD'),
    await getOnlyPrice(coin2, 'USD')
  ])

  return data[0] / data[1]
}

export { getOnlyPrice, countRatio }
