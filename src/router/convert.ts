import * as Discord from 'discord.js'
import { color, errorMsg } from '@template'
import { TRIGGER } from '../config'
import { countRatio, getOnlyPrice } from './coin'
import crypto from './coin/convert'

const convert = async (client: Discord.Client, msg: Discord.Message, args: string[]) => {
  if (args.length === 3 && !!parseFloat(args[0])) {
    const number = parseFloat(args[0])
    const coin1 = args[1].toLowerCase()
    const coin2 = args[2].toLowerCase()
    const isCoin1Crypto = coin1 in crypto
    const isCoin2Crypto = coin2 in crypto
    console.log(`${isCoin1Crypto} ${isCoin2Crypto}`)
    if (isCoin1Crypto && isCoin2Crypto) {
      // Crypto to Crypto
      countRatio(coin1, coin2).then(data => {
        if (data === 0) {
          errorMsg(msg, 'Invalid coin/currency')
        } else {
          msg.channel.send({
            embed: {
              color: 3447003,
              description: `${coin1} -> ${coin2}`,
              fields: [
                {
                  name: `${coin1}`,
                  value: `${number}`
                },
                {
                  name: `${coin2}`,
                  value: `${data * number}`
                }
              ],
              timestamp: new Date(),
              footer: {
                icon_url: client.user.avatarURL,
                text: '© superoo7'
              }
            }
          })
        }
      })
    } else if (isCoin1Crypto) {
      // Crypto to Fiat
      // crypto, currency
      getOnlyPrice(coin1, coin2)
        .then(data => {
          if (data === 0) {
            errorMsg(msg, 'Invalid coin/currency')
          } else {
            msg.channel.send({
              embed: {
                color: 3447003,
                description: `${coin1} -> ${coin2}`,
                fields: [
                  {
                    name: `${coin1}`,
                    value: `${number}`
                  },
                  {
                    name: `${coin2}`,
                    value: `${data * number}`
                  }
                ],
                timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL,
                  text: '© superoo7'
                }
              }
            })
          }
        })
        .catch(err => errorMsg(msg, 'Wrong Coin'))
    } else if (isCoin2Crypto) {
      // Fiat to Crypto
      getOnlyPrice(coin2, coin1)
        .then(data => {
          if (data === 0) {
            msg.reply('Invalid coin/currency')
          } else {
            msg.channel.send({
              embed: {
                color: 3447003,
                description: `${coin1} -> ${coin2}`,
                fields: [
                  {
                    name: `${coin1}`,
                    value: `${number}`
                  },
                  {
                    name: `${coin2}`,
                    value: `${number / data}`
                  }
                ],
                timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL,
                  text: '© superoo7'
                }
              }
            })
          }
        })
        .catch(err => errorMsg(msg, 'Wrong Coin'))
    } else {
      // error
      errorMsg(msg, 'Invalid coin/currency')
    }
  } else {
    errorMsg(
      msg,
      `Please follow the format: "${TRIGGER}convert <number> <CryptoCurrencyName> <CurrencyName>" (e.g. ${TRIGGER}convert 1 eth myr)`
    )
  }
}

export default convert
