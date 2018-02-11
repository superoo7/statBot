import axios from 'axios';
import crypto from './crypto.json';

let getPrice = async (coin, currency = 'USD') => {
  let res = await axios.get(
    `https://api.coinmarketcap.com/v1/ticker/${coin}/?convert=${currency}`
  );
  let price = res.data[0][`price_${currency.toLowerCase()}`] || '-';
  return `${currency} ${price}`;
};

let getOnlyPrice = async (coin, currency) => {
  let res = await axios.get(
    `https://api.coinmarketcap.com/v1/ticker/${crypto[coin]}/?convert=${currency}`
  ).catch((err) => 'Wrong Coin');
  let price = res.data[0][`price_${currency.toLowerCase()}`] || '-';
  return price;
};

let countRatio = async (coin1, coin2) => {
  let coinPrice1, coinPrice2;
  return await getOnlyPrice(coin1, 'USD')
    .then(price1 => {
      coinPrice1 = price1;
      return getOnlyPrice(coin2, 'USD').then(price2 => price2);
    })
    .then(price2 => {
      coinPrice2 = price2;
    })
    .then(() => {
      return coinPrice1/coinPrice2;
    });
};

export { getPrice, getOnlyPrice, countRatio };
