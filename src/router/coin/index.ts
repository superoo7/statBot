import axios from 'axios'
import crypto from './convert'

let getOnlyPrice = async (coin: string, currency: string) => {
  let res
  if (!!crypto[coin]) {
    // let res = await axios.get(
    //   `https://api.coinmarketcap.com/v1/ticker/${crypto[coin]}/?convert=${currency}`
    // )
    // let price: number = res.data[0][`price_${currency.toLowerCase()}`] || 0
    res = await axios.get(`https://api.coingecko.com/api/v3/coins/${crypto[coin]}`)
  } else {
    // let res = await axios.get(
    //   `https://api.coinmarketcap.com/v1/ticker/${coin}/?convert=${currency}`
    // )
    // let price: number = res.data[0][`price_${currency.toLowerCase()}`] || 0
    res = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin}`)
  }
  let price: number = res.data['market_data']['current_price'][currency]
  let image: string = res.data['image']['thumb']
  return { price, image }
}

let countRatio = async (coin1: string, coin2: string) => {
  let data: { price: number; image: string }[] = await Promise.all([
    await getOnlyPrice(coin1, 'usd'),
    await getOnlyPrice(coin2, 'usd')
  ])
  return { price: data[0].price / data[1].price, images: [data[0].image, data[1].image] }
}

export { getOnlyPrice, countRatio }
