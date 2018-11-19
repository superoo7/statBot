import * as Discord from 'discord.js'
import axios from 'axios'
import { errorMsg, color } from '@template'
import * as distanceInWords from 'date-fns/distance_in_words'
import { influencer, IApiData } from './types'

export const postStatus = async (msg: Discord.Message, args: string, client: Discord.Client) => {
  let authorName: string | undefined, permlinkName: string | undefined
  let permlinkCounter: number = 0
  let link = args.match(/(https?:\/\/[^\s]+)/g)
  if (!!link && link.length === 1) {
    const splittedLink = link[0].split(/[\/#]/)

    authorName = splittedLink.find((lnk, idx) => {
      permlinkCounter = idx
      return lnk.startsWith('@')
    })
    permlinkName =
      permlinkCounter < splittedLink.length ? splittedLink[permlinkCounter + 1] : undefined

    // parse out author and permlink and check wether is correct
    if (authorName && permlinkName) {
      const _apiData = await axios.get(
        `https://api.steemhunt.com/posts/${authorName}/${permlinkName}.json`
      )

      const apiData: IApiData = _apiData.data
      const img = apiData.images[0].link.endsWith('.mp4')
        ? { file: `${apiData.images[0].link.split(' ').join('%20')}` }
        : { image: { url: `${apiData.images[0].link.split(' ').join('%20')}` } }
      const validVotes = apiData['valid_votes']
      const influencerVotes = validVotes.filter(d => influencer.indexOf(d.voter) !== -1)
      const createdTime = new Date(apiData.created_at)
      const timeago = distanceInWords(createdTime, new Date(), { addSuffix: true })
      const kstTime = createdTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
      msg.author.send({
        embed: {
          ...img,
          color: color.green,
          description: `Data from Steemhunt`,
          fields: [
            { name: 'Author', value: `@${apiData.author}`, inline: true },
            { name: 'Title', value: `${apiData.title}`, inline: true },
            { name: 'Tagline', value: apiData.tagline, inline: true },
            {
              name: 'URL',
              value: `https://steemhunt.com/${authorName}/${permlinkName}?ref=superoo7`,
              inline: true
            },
            {
              name: 'created',
              value: `${timeago} (${kstTime} KST)`,
              inline: true
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
            },
            {
              name: 'Influencer Boost?',
              value: `${
                influencerVotes.length > 0
                  ? `Boost by: ${influencerVotes.map(d => d.voter).join(', ')}`
                  : 'No'
              }`,
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
      msg.delete()
    } else {
      msg.author.send({
        embed: {
          color: color.red,
          title: 'Invalid link',
          description: 'please use steemit/steemhunt url'
        }
      })
      msg.delete()
    }
  }
}
