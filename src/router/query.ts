import * as Discord from 'discord.js'
import { errorMsg, infoMsg, color } from '../template'
import { TRIGGER } from '../config'
import executeQuery from './sql/db'
import { searchTag } from './sql/queries'
import { tag, all } from './sql'

const sql = async (client: Discord.Client, msg: Discord.Message, cmd: string, args: string[]) => {
  switch (cmd) {
    case 'tag':
      if (args.length === 1) {
        infoMsg(msg, `Connecting to Database by checking **#${args[0]}** tag`)
        await tag(client, msg, args[0])
      } else {
        errorMsg(msg, `Invalid Command, try \`${TRIGGER}${cmd} steemit\``)
      }
      break
    case 'all':
      if (args.length === 1) {
        infoMsg(msg, `Connecting to Database by checking **#${args[0]}** tag`)
        await all(client, msg, args[0])
      } else {
        errorMsg(msg, `Invalid Command, try **${TRIGGER}${cmd} steemit**`)
      }
      break
    case 'help':
      await msg.channel.send({
        embed: {
          color: color.green,
          description: `Available Query (**${TRIGGER}query <query_name> <query_input>** or **${TRIGGER}<query_name> <query_input>**)`,
          fields: [
            {
              name: `**${TRIGGER}query tag <tag_name>** or **${TRIGGER}tag <tag_name>**`,
              value:
                'Details on votes, comments, topics and pending payout of that certain tags in past 7 days'
            },
            {
              name: `**${TRIGGER}all <tag_name>** or **${TRIGGER}all <tag_name>**`,
              value: `Details on votes, comments, topics and pending payout of that certain tags from 01/01/2017`
            },
            {
              name: 'Donation',
              value: 'Consider donate to me for me to sustain this project in terms of server cost.'
            },
            {
              name: 'steem',
              value: '@superoo7',
              inline: true
            },
            {
              name: 'dogecoin 🐶',
              value: 'DQzS5W8hPy2d9pw3AgM8sVed31vap8PzUe',
              inline: true
            },
            {
              name: 'Ethereum',
              value: '0x2bd5e79a753ebdf8cb83aaf4d417aa549625a192',
              inline: true
            }
          ],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: '© superoo7'
          }
        }
      })
      break
    default:
      errorMsg(msg, `Invalid Command, try \`${TRIGGER}query help\` for help `)
  }
}

export default sql
