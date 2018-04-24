import * as Discord from 'discord.js'
import { color } from '../template'
import { TRIGGER } from '../config'

const help = async (client: Discord.Client, msg: Discord.Message) => {
  await msg.channel.send({
    embed: {
      color: color.green,
      description: 'BEEP BEEP 🤖, statBot HELP (V2.0.0 beta)',
      fields: [
        {
          name: `**${TRIGGER}ping**`,
          value: "Bot reply 'pong'."
        },
        {
          name: `**${TRIGGER}query <query_name> <query_input>**`,
          value: 'Currentl available operation are tag and all'
        },
        {
          name: `**${TRIGGER}tag <tag_name>**`,
          value:
            'Details on votes, comments, topics and pending payout of that certain tags in past 7 days'
        },
        {
          name: `**${TRIGGER}all <tag_name>**`,
          value: `Details on votes, comments, topics and pending payout of that certain tags from 01/01/2017`
        },
        {
          name: `**$<crypto_name>**`,
          value: `Check a certain crypto price (e.g. **$btc**)`
        },
        {
          name: `**${TRIGGER}s/sbd** or **${TRIGGER}sbd/s**`,
          value: `Steem to SBD ratio or SBD to Steem ratio from coinmarketcap`
        },
        {
          name: `**${TRIGGER}convert <value> <from coin/currency> <to coin/currency>**`,
          value: `To calculate crypto to fiat from coinmarketcap (e.g. **${TRIGGER}convert 10 steem myr**)`
        },
        {
          name: `**${TRIGGER}info**`,
          value: `To know more about this bot`
        },
        {
          name: 'Donation',
          value: 'Consider donate to me for me to sustain this project in terms of server cost.'
        },
        {
          name: 'steem',
          value: '@superoo7'
        },
        {
          name: 'dogecoin 🐶',
          value: 'DQzS5W8hPy2d9pw3AgM8sVed31vap8PzUe'
        },
        {
          name: 'Ethereum',
          value: '0x2bd5e79a753ebdf8cb83aaf4d417aa549625a192'
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

export default help
