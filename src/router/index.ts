import * as Discord from 'discord.js'
import { infoMsg, errorMsg } from '@template'
import info from './info'
import help from './help'
import { TRIGGER } from '../config'
import sql from './query'
import price from './price'
import { countRatio } from './coin'
import convert from './convert'
import delegate from './delegate'
import { postStatus } from './steemhunt/status'

let router = async (client: Discord.Client, msg: Discord.Message) => {
  // All the data
  let args = msg.content
    .substring(1)
    .replace(/\n/g, ' ')
    .toLowerCase()
    .split(/\s+/)

  // Command
  let cmd = args[0]
  // The rest of the command
  args = args.splice(1)
  // Router
  switch (cmd) {
    case 'steemhunt':
    case 'hunt':
      if (args.length === 1) {
        postStatus(msg, args[0], client).catch(() => {
          errorMsg(msg, `Post not found`)
        })
      } else {
        errorMsg(msg, `Please follow the format \`${TRIGGER}${cmd} steemhunt <steemit_URL>\` `)
      }
      break
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
    case 'delegator':
      sql(client, msg, cmd, args)
      break
    case 'delegatee':
      sql(client, msg, cmd, args)
      break
    case 'delegate':
      delegate(client, msg, args)
      break
    case 'q':
    case 'query':
      if (args.length < 1) {
        errorMsg(msg, `Invalid Command, try **${TRIGGER}${cmd} help** to get started`)
        return
      }
      cmd = args[0]
      args = args.slice(1)
      sql(client, msg, cmd, args)
      break
    case 'p':
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
      convert(client, msg, ['1', 'steem', 'sbd'])
      break
    case 'sbd/s':
      convert(client, msg, ['1', 'sbd', 'steem'])
      break
    case 'c':
    case 'convert':
      convert(client, msg, args)
      break
    case 'discord':
      infoMsg(msg, `Joing our discord channel`)
      msg.channel.send(`https://discord.gg/J99vTUS`)
      break
    case 'bug':
    case 'bugs':
      infoMsg(
        msg,
        `You can file bug report on our github https://github.com/superoo7/statbot/issues or join our discord by using \`${TRIGGER}discord\` command`
      )
      break
    default:
      errorMsg(msg, `Type **${TRIGGER}help** to get started`)
      break
  }
}

export default router
