import * as Discord from 'discord.js';
import * as logger from 'winston';
import * as dotenv from 'dotenv';
import * as steem from 'steem';
import * as http from 'http';
import axios from 'axios';

import 'babel-polyfill';

dotenv.config();

import { executeQuery } from './db';
import { searchTag } from './sql';
import { getDateTimeFromTimestamp } from './util';
import { getPrice, getOnlyPrice, countRatio } from './api';

import config from './config.json';

// start client
const client = new Discord.Client();

client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    // GET INFO FOR MESSAGE
    let {
        id: currentMessageId,
        author: { username: currentUsername, id: currentUserId },
        content: currentContent,
        createdTimestamp: currentCreatedTimestamp
    } = msg;

    if (currentUserId === config.botId) {
        logger.info('BOT MESSAGE:', currentContent);
    } else {
        let currentCreatedTime = getDateTimeFromTimestamp(
            currentCreatedTimestamp
        );

        logger.info(
            `${currentUsername} (${currentUserId}) created "${currentContent}" on ${currentCreatedTime} (msg_id: ${currentMessageId})`
        );
        logger.info(currentContent);

        if (currentContent.substring(0, 1) == config.trigger) {
            var args = msg.content.substring(1).split(' ');
            var cmd = args[0];
            args = args.splice(1);
            // CONSOLE LOGGING
            logger.info(`CMD: ${cmd}`);
            logger.info(`ARGS: ${args}`);
            console.log(args);
            // END
            switch (cmd) {
                case 'info':
                    msg.reply(
                        'Created by @superoo7 on 2017-2018 (MIT LICENSE) https://github.com/superoo7/steem-discord'
                    );
                    break;
                case 'help':
                    msg.reply(`\n
BEEP BEEP 🤖, statBot HELP\n
Type \`${config.trigger}ping\` to get bot reply 'pong'\n
Type \`${config.trigger}tag <tag_name>\` to get details on votes, comments, topics and pending payout of that certain tags in past 7 days\n
Type \`${config.trigger}coin <coin_name> <currency(optional)>\` to get price of the coin (e.g. \`${config.trigger}coin bitcoin myr\`)\n
Type \`${config.trigger}sbd\` to get sbd price from coinmarketcap\n
Type \`${config.trigger}steem\` to get steem price from coinmarketcap\n
Type \`${config.trigger}s/sbd\` to get steem to sbd ratio from coinmarketcap\n
Type \`${config.trigger}convert <value> <coin_name> <currency>\` to get steem to sbd ratio from coinmarketcap (e.g. \`${config.trigger}convert 10 steem myr\`)\n
Type \`${config.trigger}info\` to know more about this bot
                `);
                    break;
                case 'ping':
                    msg.reply('Pong!');
                    break;
                case 'tag':
                    msg.reply('Connecting to database....');
                    const query = searchTag(args[0]);
                    async function querying(query, tag) {
                        let result = await executeQuery(query);
                        console.log(result);
                        result === 'ERROR'
                            ? msg.reply('ERROR ON QUERY-ING')
                            : msg.reply(`There is
${result[0].Posts} posts 📘,
${result[0].Votes} votes 👍,
$${result[0].PendingPayouts} steem 💵,
${result[0].Comments} comments 💬,
Profitability 💰: ${result[0].PendingPayouts / result[0].Posts}
on #${tag} in the past 7 days`);
                    }
                    querying(query, args);
                    break;
                case 'coin':
                    if (args.length > 0 && args.length < 3) {
                        const coin = args[0];
                        const currency = args[1] || 'USD';
                        getPrice(coin, currency)
                            .then(data => {
                                msg.reply(`1 ${coin} is worth ${data}`);
                            })
                            .catch(err => msg.reply('Wrong Coin'));
                    } else {
                        msg.reply(
                            `Please follow the format: "${
                                config.trigger
                            }coin <CryptoCurrencyName> <CurrencyName>" (e.g. ${
                                config.trigger
                            }coin ethereum MYR)`
                        );
                    }
                    break;
                case 'sbd':
                    getPrice('steem-dollars', 'USD')
                        .then(data => {
                            msg.reply(`SBD Price is at ${data}`);
                        })
                        .catch(err => msg.reply('Server down'));
                    break;
                case 'steem':
                    getPrice('steem', 'USD')
                        .then(data => {
                            msg.reply(`Steem Price is at ${data}`);
                        })
                        .catch(err => msg.reply('Server down'));
                    break;
                case 's/sbd':
                    countRatio('steem', 'steem-dollars')
                        .then(data => {
                            msg.reply(`Steem to SBD ratio is ${data}`);
                        })
                        .catch(err => bot.sendMessage(chatId, 'Invalid Coin'));
                    break;
                case 'convert':
                    if (args.length === 3 && !!parseInt(args[0])) {
                        const number = parseFloat(args[0]);
                        const coin = args[1];
                        const currency = args[2];
                        getOnlyPrice(coin, currency)
                            .then(data => {
                                console.log(data, number)
                                msg.reply(`${number} ${coin} is worth ${currency} ${parseFloat(data)*number}`);
                            })
                            .catch(err => msg.reply('Wrong Coin'));
                    } else {
                        msg.reply(
                            `Please follow the format: "${
                                config.trigger
                            }coin <CryptoCurrencyName> <CurrencyName>" (e.g. ${
                                config.trigger
                            }coin ethereum MYR)`
                        );
                    }
                    break;

                    break;
                default:
                    msg.reply(`\`${config.trigger}help\` to get started`);
                    break;
            }
        }
    }
});
client.login(process.env.DISCORD_TOKEN); // http //     .createServer(function(request, response) { //         response.writeHead(200, { 'Content-Type': contentType }); //         response.end(content, 'utf-8'); //     }) //     .listen(process.env.PORT || 5000);
