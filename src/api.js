import axios from 'axios';

let getPrice = async (coin, currency = 'USD') => {
  let res = await axios.get(
    `https://api.coinmarketcap.com/v1/ticker/${coin}/?convert=${currency}`
  );
  let price = res.data[0][`price_${currency.toLowerCase()}`] || '-';
  console.log(price);
  return `${currency} ${price}`;
};

let getOnlyPrice = async (coin1, coin2) => {
  let res = await axios.get(
    `https://min-api.cryptocompare.com/data/price?fsym=${coin1.toUpperCase()}&tsyms=${coin2.toUpperCase()}`
  ).catch((err) => 'Wrong Coin');
  let price = res.data[coin2.toUpperCase()] || '-';
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
      return `${coinPrice1 / coinPrice2} ${coin1}/${coin2}`;
    });
};

export { getPrice, getOnlyPrice, countRatio };
