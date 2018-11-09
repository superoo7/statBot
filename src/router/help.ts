import * as Discord from 'discord.js'
import { color } from '@template'
import { TRIGGER } from '../config'

const help = async (client: Discord.Client, msg: Discord.Message) => {
  await msg.channel.send({
    embed: {
      color: color.green,
      description: 'BEEP BEEP 🤖, statBot HELP (V2.3.0)',
      fields: [
        {
          name: `**${TRIGGER}ping**`,
          value: "Bot reply 'pong'."
        },
        {
          name: `**${TRIGGER}hunt <URL>** or **${TRIGGER}steemhunt <steemit/steemhunt URL>**`,
          value: 'Check steemhunt post status.'
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
          name: `**${TRIGGER}delegate <to> <SP>** or **${TRIGGER}delegate <from> <to> <SP>**`,
          value: `To generate link on steemconnect to delegate to someone with a specific SP`
        },
        {
          name: `**${TRIGGER}info**`,
          value: `To know more about this bot`
        },
        {
          name: `**${TRIGGER}discord**`,
          value: 'to join our discord!'
        },
        {
          name: `**${TRIGGER}bugs**`,
          value: 'To report bugs or give suggestion about the bot'
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
