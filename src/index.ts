// Library
import * as Discord from 'discord.js'
import * as logger from 'winston'
import * as dotenv from 'dotenv'
import * as sql from 'mssql'

// File
import { BOT_ID, TRIGGER } from './config'
import { infoMsg, errorMsg } from './template'
import router from './router'
import price from './router/price'

// Initialize
dotenv.config()

if (
  !process.env.DISCORD_TOKEN ||
  !process.env.DATABASE ||
  !process.env.USERNAME ||
  !process.env.PASSWORD ||
  !process.env.HOSTNAME ||
  !process.env.PORTNO
)
  throw new Error('ENV variable missing')

const client = new Discord.Client()

// On Setup
client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag} !`)
})

// When received message

client.on('message', async msg => {
  if (BOT_ID === msg.author.id) {
    logger.info('BOT MESSAGE:', msg.content)
    return
  }
  let checkTrigger = msg.content.substring(0, 1)
  if (!(checkTrigger === TRIGGER || checkTrigger === '$')) return
  if (checkTrigger === '$') {
    const args = msg.content.substring(1).split(' ')
    if (args[0].toLowerCase() === 'price') {
      price(msg, args.splice(1))
      return
    } else {
      price(msg, args)
      return
    }
  }
  router(client, msg).catch(() => {
    logger.error('Router error')
    errorMsg(msg, 'router error 😭')
  })
})

// Sign in

client.login(process.env.DISCORD_TOKEN)
