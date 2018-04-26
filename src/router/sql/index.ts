import * as Discord from 'discord.js'
import executeQuery from './db'
import { searchTag, searchAllTag, checkDelegator } from './queries'
import { errorMsg, color } from '../../template'
import { steem } from '../../steem'

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

const delegator = async (client: Discord.Client, msg: Discord.Message, username: string) => {
  let data: any[] = await Promise.all([
    await executeQuery(checkDelegator(username)),
    await steem.api.getDynamicGlobalPropertiesAsync()
  ])
  const fields: { name: string; value: string; inline: boolean }[] = data[0]
    .filter((r: any) => {
      return r.vesting_shares !== 0
    })
    .map((r: any) => {
      const d = data[1]
      const totalSteems = parseFloat(d.total_vesting_fund_steem.split(' ')[0])
      const totalVests = parseFloat(d.total_vesting_shares.split(' ')[0])
      const vestingShares = parseFloat(r.vesting_shares)
      let sp = totalSteems * (vestingShares / totalVests)
      return {
        name: `${r.delegator}`,
        value: `${r.vesting_shares} Vests\n${sp} SP`,
        inline: true
      }
    })
  msg.channel.send({
    embed: {
      color: color.green,
      description: `Delegators of ${username}`,
      fields: fields,
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL,
        text: '© superoo7'
      }
    }
  })
  return
}

export { tag, all, delegator }
