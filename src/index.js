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

// setting
const triggerBotKey = '!';

// start client
const client = new Discord.Client();

client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    logger.info(msg.content);

    if (msg.content.substring(0, 1) == triggerBotKey) {
        var args = msg.content.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        logger.info(`CMD: ${cmd}`);
        logger.info(`ARGS: ${args}`);
        console.log(args);
        let message;
        switch (cmd) {
            case 'help':
                message = `statBot HELP\n
                Type \`!ping\` to get bot reply 'pong'\n
                Type \`!user <steem_name>\` to get details of that person (without @)\n
                Type \`!power <steem_name>\`
                Type \`!ratio \` to get steem to sbd ratio from Bittrex
                Type \`!tag <tag_name>\` to get details on votes, comments, topics and pending payout of that certain tags in past 7 days
                `;
                msg.reply(message);
                break;
            case 'history':
                steem.api.getAccountReferences(args, function(err, result) {
                    console.log(err, result);
                });
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
                        msg.reply(ratio);
                    });
                break;
            default:
                message = '`!help` to get started';
                msg.reply(message);
                break;
        }
    }
});
client.login(process.env.DISCORD_TOKEN);
http
    .createServer(function(request, response) {
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
    })
    .listen(process.env.PORT || 5000);
