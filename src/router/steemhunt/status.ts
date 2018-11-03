import * as Discord from 'discord.js'
import axios from 'axios'
import { errorMsg, color } from '../../template'

export const postStatus = async (msg: Discord.Message, args: string, client: Discord.Client) => {
  let authorName, permlinkName
  let link = args.match(/(https?:\/\/[^\s]+)/g)
  if (!!link && link.length === 1) {
    const splittedLink = link[0].split(/[\/#]/)
    if (splittedLink[3].startsWith('@')) {
      // Steemhunt link
      authorName = splittedLink[3]
      permlinkName = splittedLink[4]
    } else {
      // Steemit link
      authorName = splittedLink[4]
      permlinkName = splittedLink[5]
    }

    // parse out author and permlink and check wether is correct
    if (authorName.startsWith('@') && permlinkName) {
      const _apiData: any = await axios.get(
        `https://api.steemhunt.com/posts/${authorName}/${permlinkName}.json`
      )
      const apiData = _apiData.data
      msg.channel.send({
        embed: {
          color: color.green,
          description: `Data from Steemhunt`,
          fields: [
            { name: 'Author', value: `@${apiData.author}`, inline: true },
            { name: 'Title', value: `${apiData.title}`, inline: true },
            { name: 'Tagline', value: apiData.tagline, inline: true },
            {
              name: 'URL',
              value: `https://steemhunt.com/${authorName}/${permlinkName}?ref=superoo7`
            },
            { name: 'Payout', value: `$${apiData.payout_value}`, inline: true },
            { name: 'Vote 👍', value: `${apiData.active_votes.length || '0'}`, inline: true },
            { name: 'Hunt Score', value: `${apiData.hunt_score}`, inline: true },
            {
              name: 'Verify?',
              value: `${apiData.is_verified ? 'Yes' : 'No'}${
                apiData.verified_by ? ` by ${apiData.verified_by}` : ''
              }`,
              inline: true
            }
          ],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: '© superoo7'
          },
          file: `${apiData.images[0].link}`
        }
      })
    } else {
      errorMsg(msg, `Invalid link, please use steemit/steemhunt url`)
    }
  }
}
