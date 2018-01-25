import axios from 'axios';

let getPrice = async (coin, currency = 'USD') => {
  let res = await axios.get(
    `https://api.coinmarketcap.com/v1/ticker/${coin}/?convert=${currency}`
  );
  let price = res.data[0][`price_${currency.toLowerCase()}`] || '-';
  console.log(price);
  return `${currency} ${price}`;
};

let getOnlyPrice = async (coin, currency = 'USD') => {
  let res = await axios.get(
    `https://api.coinmarketcap.com/v1/ticker/${coin}/?convert=${currency}`
  );
  let price = res.data[0][`price_${currency.toLowerCase()}`] || '-';
  return price;
};

let countRatio = async (coin1, coin2) => {
  let coinPrice1, coinPrice2;
  return await getOnlyPrice(coin1)
    .then(price1 => {
      coinPrice1 = price1;
      return getOnlyPrice(coin2).then(price2 => price2);
    })
    .then(price2 => {
      coinPrice2 = price2;
    })
    .then(() => {
      return `${coinPrice1 / coinPrice2} ${coin1}/${coin2}`;
    });
};

export { getPrice, getOnlyPrice, countRatio };
