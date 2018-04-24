import { getPrice, getOnlyPrice, countRatio } from '../api';

// api.js
getPrice('steem', 'usd').then(data =>
  console.log(`getPrice of Steem: ${data}`)
);
getOnlyPrice('steem', 'usd').then(data =>
  console.log(`getOnlyPrice of Steem: ${data}`)
);
countRatio('steem', 'sbd').then(data =>
  console.log(`countRatio of Steem/SBD: ${data}`)
);


