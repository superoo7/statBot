import * as Discord from 'discord.js'
import { color } from '@template'

const info = (client: Discord.Client, msg: Discord.Message): void => {
  msg.channel.send({
    embed: {
      color: color.green,
      description: 'Created by @superoo7',
      fields: [
        {
          name: 'License',
          value: 'on 2017-2018 (MIT LICENSE)'
        },
        {
          name: 'GitHub Repository',
          value: 'https://github.com/superoo7/steem-discord'
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

export default info
