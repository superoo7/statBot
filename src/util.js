import axios from 'axios';

let getDateTimeFromTimestamp = unixTimeStamp => {
  var date = new Date(unixTimeStamp);
  return (
    ('0' + date.getDate()).slice(-2) +
    '/' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '/' +
    date.getFullYear() +
    ' ' +
    ('0' + date.getHours()).slice(-2) +
    ':' +
    ('0' + date.getMinutes()).slice(-2)
  );
};

let getSteem = async () => {
  let res = await axios.get(
    'https://api.coinmarketcap.com/v1/ticker/steem/?convert=USD'
  );
  let steemPrice = res.data[0].price_usd;
  return steemPrice;
};

let getSBD = async () => {
  let res = await axios.get(
    'https://api.coinmarketcap.com/v1/ticker/steem-dollars/?convert=USD'
  );
  let sbdPrice = res.data[0].price_usd;
  return sbdPrice;
};

let getRatio = async () => {
  let steemPrice, sbdPrice;

  return await getSteem()
    .then(data1 => {
      steemPrice = data1;
      return getSBD().then(data2 => data2);
    })
    .then(data => {
      sbdPrice = data;
    })
    .then(() => {
      return steemPrice / sbdPrice;
    });
};

export { getDateTimeFromTimestamp, getSteem, getSBD, getRatio };
