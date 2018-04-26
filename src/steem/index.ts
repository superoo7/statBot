import * as steem from 'steem'

steem.api.setOptions({
  url: 'wss://gtg.steem.house:8090'
})

export { steem }
