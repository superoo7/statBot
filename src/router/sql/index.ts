import * as Discord from 'discord.js'
import executeQuery from './db'
import { searchTag, searchAllTag } from './queries'
import { errorMsg, color } from '../../template'

let tag = async (client: Discord.Client, msg: Discord.Message, tag: string) => {
  let result: any = await executeQuery(searchTag(tag)).catch(() => {
    errorMsg(msg, `Database Error`)
    return
  })

  if (result === 'ERROR') {
    errorMsg(msg, `Database Error`)
    return
  }

  await msg.channel.send({
    embed: {
      color: color.green,
      description: `**#${tag}** in the past 7 days`,
      fields: [
        {
          name: 'Posts 📘',
          value: `${result[0].Posts}`,
          inline: true
        },
        {
          name: 'Votes 👍',
          value: `${result[0].Votes}`,
          inline: true
        },
        {
          name: 'Pending Payout 💵',
          value: `$${result[0].PendingPayouts}`,
          inline: true
        },
        {
          name: 'Comments 💬',
          value: `${result[0].Comments}`,
          inline: true
        },
        {
          name: 'Profitability 💰',
          value: `$${result[0].PendingPayouts / result[0].Posts}`,
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
  return
}

let all = async (client: Discord.Client, msg: Discord.Message, tag: string) => {
  let result: any = await executeQuery(searchAllTag(tag)).catch(() => {
    errorMsg(msg, `Database Error`)
    return
  })

  if (result === 'ERROR') {
    errorMsg(msg, `Database Error`)
    return
  }

  await msg.channel.send({
    embed: {
      color: color.green,
      description: `**#${tag}** in from 01/01/2017`,
      fields: [
        {
          name: 'Posts 📘',
          value: `${result[0].Posts}`,
          inline: true
        },
        {
          name: 'Votes 👍',
          value: `${result[0].Votes}`,
          inline: true
        },
        {
          name: 'Pending Payout 💵',
          value: `$${result[0].PendingPayouts}`,
          inline: true
        },
        {
          name: 'Comments 💬',
          value: `${result[0].Comments}`,
          inline: true
        },
        {
          name: 'Profitability 💰',
          value: `$${result[0].PendingPayouts / result[0].Posts}`,
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
  return
}

export { tag, all }
