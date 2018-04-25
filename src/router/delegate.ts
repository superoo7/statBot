import * as Discord from 'discord.js'
import { color, errorMsg } from '../template'
import { TRIGGER } from '../config'

const delegate = async (client: Discord.Client, msg: Discord.Message, args: string[]) => {
  if (args.length === 3) {
    // FROM TO SP
    // https://steemconnect.com/sign/delegateVestingShares?delegator=${}+&delegatee=${}&vesting_shares=${}%20SP

    await msg.channel.send({
      embed: {
        color: color.green,
        description: `Delegate to ${args[1]}`,
        fields: [
          {
            name: `From`,
            value: `${args[0]}`,
            inline: true
          },
          {
            name: `To`,
            value: `${args[1]}`,
            inline: true
          },
          {
            name: `SP`,
            value: `${args[2]}`,
            inline: true
          },
          {
            name: `SteemConnect link to delegate SP`,
            value: `https://steemconnect.com/sign/delegateVestingShares?delegator=${
              args[0]
            }&delegatee=${args[1]}&vesting_shares=${args[2]}%20SP
            `,
            inline: false
          }
        ]
      }
    })
  } else if (args.length === 2) {
    // TO SP
    await msg.channel.send({
      embed: {
        color: color.green,
        description: `Delegate to ${args[0]}`,
        fields: [
          {
            name: `To`,
            value: `${args[0]}`,
            inline: true
          },
          {
            name: `SP`,
            value: `${args[1]}`,
            inline: true
          },
          {
            name: `SteemConnect link to delegate SP`,
            value: `https://steemconnect.com/sign/delegateVestingShares?delegator=&delegatee=${
              args[0]
            }&vesting_shares=${args[1]}%20SP
            `,
            inline: false
          }
        ]
      }
    })
  } else {
    errorMsg(
      msg,
      `Invalid Message, try **${TRIGGER}delegate <to> <SP>** or **${TRIGGER}delegate <from> <to> <SP>**`
    )
  }
}

export default delegate
