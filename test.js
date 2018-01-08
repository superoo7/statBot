// const steem = require('steem');

// steem.api.getAccounts(['bitrocker2020'], function(err, response) {
//   // console.log(err, response);
//   var id = response[0].reputation;
//   var steemPower = steem.formatter.estimateAccountValue(response[0]);
//   steemPower
//     .then(data => {
//       console.log(data);
//     })
//     .catch(err => {
//       console.log('ERR');
//     });
//   console.log(steemPower);
//   var reputation = steem.formatter.reputation(3512485230915);
// });

// steem.api.getAccountVotes('superoo7', function(err, result) {
//   console.log(err, result);
// });

const axios = require('axios');

// axios
//   .get('https://bittrex.com/api/v1.1/public/getmarketsummary?market=btc-steem')
//   .then(res => {
//     steemPrice = { low: res.data.result[0].Low, high: res.data.result[0].High };
//     return axios.get(
//       'https://bittrex.com/api/v1.1/public/getmarketsummary?market=btc-sbd'
//     );
//   })
//   .then(res => {
//     sbdPrice = { low: res.data.result[0].Low, high: res.data.result[0].High };

//     console.log(steemPrice);
//     console.log(sbdPrice);

//     let ratio = {
//       low: steemPrice.low / sbdPrice.low,
//       high: steemPrice.high / sbdPrice.high
//     };

//     console.log(ratio);
//   });

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

getRatio().then(data => console.log(data));

// console.log('steem ', steemPrice);
// const ratio = getSteem() / getSBD();
// console.log(ratio);
