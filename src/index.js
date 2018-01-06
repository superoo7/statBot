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
            let message;
            switch (cmd) {
                case 'info':
                    message =
                        'Created by @superoo7 on 2017-2018 (MIT LICENSE) https://github.com/superoo7/steem-discord';
                    msg.reply(message);
                    break;
                case 'help':
                    message = `\n
                    BEEP BEEP 🤖, statBot HELP\n
                Type \`${config.trigger}ping\` to get bot reply 'pong'\n
                Type \`${
                    config.trigger
                }user <steem_name>\` to get details of that person (without @)\n
                Type \`${
                    config.trigger
                }ratio \` to get steem to sbd ratio from Bittrex\n
                Type \`${
                    config.trigger
                }tag <tag_name>\` to get details on votes, comments, topics and pending payout of that certain tags in past 7 days\n
                Type \`${
                    config.trigger
                }delete <message_id>\` to delete a message\n
                Type \`${config.trigger}info\` to know more about this bot
                `;
                    msg.reply(message);
                    break;
                case 'user':
                    steem.api.getAccounts(args, function(err, results) {
                        if (!!results[0]) {
                            results.map(result => {
                                if (!!result) {
                                    console.log(result);
                                    let reputation = steem.formatter.reputation(
                                        result.reputation
                                    );
                                    let accountWorth = steem.formatter.estimateAccountValue(
                                        result
                                    );

                                    accountWorth
                                        .then(worth => {
                                            message = `@${result.name} says "${
                                                JSON.parse(result.json_metadata)
                                                    .profile.about
                                            }"
                                and reputation: ${reputation} 🔰
                                and account worth: $${worth} 💰
                                `;
                                            msg.reply(message);
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        });
                                } else {
                                    msg.reply('User not found');
                                }
                            });
                        } else {
                            msg.reply('User not found');
                        }
                    });
                    break;
                case 'ping':
                    message = 'Pong!';
                    msg.reply(message);
                    break;
                case 'tag':
                    msg.reply('Connecting to database....');
                    const query = searchTag(args[0]);
                    async function querying(query, tag) {
                        let result = await executeQuery(query);
                        console.log(result);
                        result === 'ERROR'
                            ? msg.reply('ERROR ON QUERY-ING')
                            : msg.reply(
                                  `There is
                               ${result[0].Posts} posts 📘,
                               ${result[0].Votes} votes 👍,
                               $${result[0].PendingPayouts} steem 💵,
                               ${result[0].Comments} comments 💬,
                               on #${tag} in the past 7 days`
                              );
                    }
                    querying(query, args);
                    break;
                case 'ratio':
                    let steemPrice;
                    let sbdPrice;
                    axios
                        .get(
                            'https://bittrex.com/api/v1.1/public/getmarketsummary?market=btc-steem'
                        )
                        .then(res => {
                            steemPrice = {
                                low: res.data.result[0].Low,
                                high: res.data.result[0].High
                            };
                            return axios.get(
                                'https://bittrex.com/api/v1.1/public/getmarketsummary?market=btc-sbd'
                            );
                        })
                        .then(res => {
                            sbdPrice = {
                                low: res.data.result[0].Low,
                                high: res.data.result[0].High
                            };
                            console.log(steemPrice);
                            console.log(sbdPrice);
                            let ratio = {
                                low: steemPrice.low / sbdPrice.low,
                                high: steemPrice.high / sbdPrice.high
                            };
                            console.log(ratio);
                            msg.reply(
                                `ratio from bittrex: ${ratio.low} <-> ${
                                    ratio.high
                                } steem/sbd`
                            );
                        });
                    break;
                case 'delete':
                    msg.channel
                        .fetchMessage(args[0])
                        .then(message => {
                            message
                                .delete()
                                .then(msg =>
                                    msg.reply(
                                        `Deleted message from ${msg.author}`
                                    )
                                )
                                .catch(console.error);
                        })
                        .catch(console.error);
                    break;
                case 'fetch':
                    msg.channel
                        .fetchMessages({ limit: 100 })
                        .then(messages => {
                            console.log(`Received ${messages.size} messages`);
                            let {
                                author: {
                                    username: lastUsername,
                                    id: lastUserId
                                },
                                content: lastContent,
                                createdTimestamp: lastCreatedTimestamp,
                                id: lastMessageId
                            } = messages.find(m => {
                                let {
                                    author: { id: lastUserId },
                                    id: lastMessageId
                                } = m;
                                if (lastMessageId === currentMessageId) {
                                    return false;
                                }
                                return currentUserId === lastUserId;
                            });
                            let lastCreatedTime = getDateTimeFromTimestamp(
                                lastCreatedTimestamp
                            );
                            msg.reply(
                                `${lastUsername} on ${lastCreatedTime} says that ${lastContent}`
                            );
                        })
                        .catch(console.error);
                    break;
                default:
                    message = `\`${config.trigger}help\` to get started`;
                    msg.reply(message);
                    break;
            }
        }
    }
});
client.login(process.env.DISCORD_TOKEN); // http //     .createServer(function(request, response) { //         response.writeHead(200, { 'Content-Type': contentType }); //         response.end(content, 'utf-8'); //     }) //     .listen(process.env.PORT || 5000);
