import * as Discord from 'discord.js'
import { color, errorMsg, infoMsg } from '@template'
import { TRIGGER } from '../config'
import { getOnlyPrice } from './coin'

const price = async (msg: Discord.Message, args: string[]) => {
  if (!(args.length === 1)) {
    errorMsg(msg, `Invalid format, try \`${TRIGGER}price btc\` or \`$btc\` `)
    return
  }
  let coin = args[0]
  await getOnlyPrice(coin, 'usd')
    .then(price => {
      if (price === 0) {
        errorMsg(msg, `${coin} is not available`)
        return
      } else {
        infoMsg(msg, `${coin} is at $${price}`)
        return
      }
    })
    .catch(() => {
      errorMsg(msg, `${coin} is not available`)
      return
    })
}

export default price
