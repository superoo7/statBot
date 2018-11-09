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
      if (!price.price) {
        errorMsg(msg, `${coin} is not available`)
        return
      } else {
        const replyMessage = new Discord.RichEmbed()
          .setColor(0x00ae86)
          .setTitle(`${coin} price`)
          .setThumbnail(`${price.image}`)
          .addField('Price', `$${price.price}`)
        msg.channel.send({ embed: replyMessage })
        return
      }
    })
    .catch(() => {
      errorMsg(msg, `${coin} is not available`)
      return
    })
}

export default price
