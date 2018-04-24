import * as Discord from 'discord.js'

const errorMsg = (msg: Discord.Message, m: string) => {
  msg.channel.send({
    embed: {
      color: 15158332,
      description: m
    }
  })
}

const infoMsg = (msg: Discord.Message, m: string) => {
  msg.channel.send({
    embed: {
      color: 15158332,
      description: m
    }
  })
}

export { errorMsg, infoMsg }
