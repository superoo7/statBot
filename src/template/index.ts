import * as Discord from 'discord.js'
import COLOR from './color'

const color = COLOR

const errorMsg = (msg: Discord.Message, m: string) => {
  msg.channel.send({
    embed: {
      color: color.red,
      description: m
    },
    timestamp: new Date(),
    footer: {
      icon_url: msg.author.avatarURL,
      text: 'if you think is an error, please contact superoo7'
    }
  })
}

const infoMsg = (msg: Discord.Message, m: string) => {
  msg.channel.send({
    embed: {
      color: color.blue,
      description: m
    }
  })
}

const successMsg = (msg: Discord.Message, m: string) => {
  msg.channel.send({
    embed: {
      color: color.green,
      description: m
    }
  })
}

export { errorMsg, infoMsg, color }
