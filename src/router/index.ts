import * as Discord from 'discord.js'
import { infoMsg, errorMsg } from '../template'
import info from './info'
import help from './help'
import { TRIGGER } from '../config'
import sql from './query'
import price from './price'
import { countRatio } from './coin'
import convert from './convert'
import delegate from './delegate'

let router = async (client: Discord.Client, msg: Discord.Message) => {
  // All the data
  let args = msg.content.substring(1).split(' ')
  // Command
  let cmd = args[0]
  // The rest of the command
  args = args.splice(1)

  // Router
  switch (cmd) {
    case 'info':
      info(client, msg)
      break
    case 'help':
      help(client, msg)
      break
    case 'ping':
      infoMsg(msg, `Pong! (${client.ping} ms)`)
      break
    case 'tag':
      sql(client, msg, cmd, args)
      break
    case 'all':
      sql(client, msg, cmd, args)
      break
    case 'delegate':
      delegate(client, msg, args)
      break
    case 'query':
      if (args.length < 1) {
        errorMsg(msg, `Invalid Command, try **${TRIGGER}${cmd} help** to get started`)
        return
      }
      cmd = args[0]
      args = args.slice(1)
      sql(client, msg, cmd, args)
      break
    case 'price':
      price(msg, args)
      break
    case 'steem':
    case 's':
      price(msg, ['steem'])
      break
    case 'sbd':
      price(msg, ['sbd'])
      break
    case 's/sbd':
      infoMsg(msg, `Steem to SBD ratio is ${await countRatio('steem', 'sbd')}`)
      break
    case 'sbd/s':
      infoMsg(msg, `SBD to Steem ratio is ${await countRatio('steem', 'sbd')}`)
      break
    case 'convert':
      convert(client, msg, args)
      break
    default:
      errorMsg(msg, `Type **${TRIGGER}help** to get started`)
      break
  }
}

export default router
