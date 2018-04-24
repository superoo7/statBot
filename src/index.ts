// Library
import * as Discord from 'discord.js'
import * as logger from 'winston'
import * as dotenv from 'dotenv'

// File
import { BOT_ID, TRIGGER } from './config'

// Initialize
dotenv.config()

if (
  !process.env.DISCORD_TOKEN ||
  !process.env.DATABASE ||
  !process.env.USERNAME ||
  !process.env.PASSWORD
)
  throw new Error('ENV variable missing')

// @ts-ignore
let { DISCORD_TOKEN, DATABASE, USERNAME, PASSWORD } = process.env

const client = new Discord.Client()

// On Setup
client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag} !`)
})

// When received message

client.on('message', msg => {
  if (BOT_ID === msg.author.id) {
    logger.info('BOT MESSAGE:', msg.content)
    return
  }
  if (!(msg.content.substring(0, 1) == TRIGGER)) return

  msg.reply('hi')
})

// Sign in

client.login(DISCORD_TOKEN)
