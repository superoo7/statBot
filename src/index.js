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
import { getDateTimeFromTimestamp, getRatio, getSteem, getSBD } from './util';

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
Type \`${config.trigger}user <steem_name>\` to get details of that person\n
Type \`${config.trigger}ratio\` to get steem to sbd ratio from coinmarketcap\n
Type \`${config.trigger}steem\` to get steem price from coinmarketcap\n
Type \`${config.trigger}sbd\` to get sbd price from coinmarketcap\n
Type \`${
                        config.trigger
                    }tag <tag_name>\` to get details on votes, comments, topics and pending payout of that certain tags in past 7 days\n
Type \`${config.trigger}info\` to know more about this bot
                `);
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
                                            msg.reply(`@${result.name} says "${
                                                JSON.parse(result.json_metadata)
                                                    .profile.about
                                            }"
                                and reputation: ${reputation} 🔰
                                and account worth: $${worth} 💰
                                `);
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
                case 'sbd':
                    getSBD().then(data =>
                        msg.reply(`SBD Price at ${data} USD`)
                    );
                    break;
                case 'steem':
                    getSteem().then(data =>
                        msg.reply(`Steem Price at ${data} USD`)
                    );
                    break;
                case 'ratio':
                    getRatio().then(data =>
                        msg.reply(`steem/sbd ratio: ${data}`)
                    );
                    break;
                default:
                    msg.reply(`\`${config.trigger}help\` to get started`);
                    break;
            }
        }
    }
});
client.login(process.env.DISCORD_TOKEN); // http //     .createServer(function(request, response) { //         response.writeHead(200, { 'Content-Type': contentType }); //         response.end(content, 'utf-8'); //     }) //     .listen(process.env.PORT || 5000);
