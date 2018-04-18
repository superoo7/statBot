import * as Discord from 'discord.js';
import * as logger from 'winston';
import dotenv from 'dotenv';
import * as steem from 'steem';
import * as http from 'http';
import axios from 'axios';

import 'babel-polyfill';

dotenv.config();

import { executeQuery } from './db';
import { searchTag } from './sql';
import { getDateTimeFromTimestamp } from './util';
import { getPrice, getOnlyPrice, countRatio } from './api';

import crypto from './crypto.json';
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
        author: {
            username: currentUsername,
            id: currentUserId
        },
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

        if (
            currentContent.substring(0, 1) == config.trigger
        ) {
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
                    msg.channel.send({embed: {
                        color: 3007003,
                        author: {
                            name: currentUsername,
                            icon_url: msg.author.avatarURL
                        },
                        description: "Created by @superoo7",
                        fields: [
                            {
                                name: "License",
                                value: "on 2017-2018 (MIT LICENSE)"
                            },
                            {
                                name: "GitHub Repository",
                                value: "https://github.com/superoo7/steem-discord"
                            },
                            {
                                name: "Donation",
                                value: "Consider donation to me for me to sustain this project in terms of server cost."
                            },
                            {
                                name: "steem",
                                value: "@superoo7"
                            }, 
                            {
                                name: "dogecoin 🐶",
                                value: "DQzS5W8hPy2d9pw3AgM8sVed31vap8PzUe"
                            },
                            {
                                name: "Ethereum",
                                value: "0x2bd5e79a753ebdf8cb83aaf4d417aa549625a192"
                            }
                        ],
                        timestamp: new Date(),
                        footer: {
                          icon_url: client.user.avatarURL,
                          text: "© superoo7"
                        }
                    }});

                    break;
                case 'help':
                msg.channel.send({embed: {
                    color: 3007003,
                    author: {
                        name: currentUsername,
                        icon_url: msg.author.avatarURL
                    },
                    description: "BEEP BEEP 🤖, statBot HELP (V2.0.0 alpha)",
                    fields: [
                        {
                            name:  `\`${config.trigger}ping\``,
                            value: "Bot reply 'pong'."
                        },
                        {
                            name: `\`${config.trigger}tag <tag_name>\``,
                            value: "Details on votes, comments, topics and pending payout of that certain tags in past 7 days"
                        },
                        {
                            name: `\`${config.trigger}sbd\``,
                            value: `SBD price from coinmarketcap`
                        },
                        {
                            name: `\`${config.trigger}steem\` or \`${config.trigger}s\``,
                            value: `Steem price from coinmarketcap`
                        },
                        {
                            name: `\`${config.trigger}s/sbd\` or \`${config.trigger}sbd/s\``,
                            value: `Steem to SBD ratio or SBD to Steem ratio from coinmarketcap`
                        },
                        {
                            name: `\`${config.trigger}convert <value> <from this coin/currency> <to this coin/currency>\``,
                            value: `To calculate crypto to fiat from coinmarketcap (e.g. \`${config.trigger}convert 10 steem myr\`)`
                        },
                        {
                            name: `\`${config.trigger}info\``,
                            value: `To know more about this bot`
                        },
                        {
                            name: "Donation",
                            value: "Consider donation to me for me to sustain this project in terms of server cost."
                        },
                        {
                            name: "steem",
                            value: "@superoo7"
                        }, 
                        {
                            name: "dogecoin 🐶",
                            value: "DQzS5W8hPy2d9pw3AgM8sVed31vap8PzUe"
                        },
                        {
                            name: "Ethereum",
                            value: "0x2bd5e79a753ebdf8cb83aaf4d417aa549625a192"
                        }
                    ],
                    timestamp: new Date(),
                    footer: {
                      icon_url: client.user.avatarURL,
                      text: "© superoo7"
                    }
                }});
                    break;
                case 'ping':
                    // msg.reply('Pong!');
                    msg.channel.send({embed: {
                        color: 3447003,
                        author: {
                            name: currentUsername,
                            icon_url: msg.author.avatarURL
                          },
                        description: "Pong!",
                        timestamp: new Date(),
                        footer: {
                          icon_url: client.user.avatarURL,
                          text: "© superoo7"
                        }
                      }});
                    break;
                case 'tag':
                    msg.channel.send({embed: {
                        color: 3007003,
                        author: {
                            name: currentUsername,
                            icon_url: msg.author.avatarURL
                          },
                        description: "Connecting to database",
                    }});
                    const query = searchTag(args[0]);
                    async function querying(query, tag) {
                        let result = await executeQuery(
                            query
                        );
                        console.log(result);
                        result === 'ERROR'
                            ? errorMsg(msg,'ERROR ON QUERY-ING')
                            : msg.channel.send({embed: {
                                color: 3447003,
                                author: {
                                    name: currentUsername,
                                    icon_url: msg.author.avatarURL
                                  },
                                description: `#${tag} in the past 7 days`,
                                fields: [{
                                    name: "Posts 📘",
                                    value: `${result[0].Posts}`
                                  },
                                  {
                                    name: "Votes 👍",
                                    value: `${result[0].Votes}`
                                  },
                                  {
                                    name: "Pending Payout 💵",
                                    value: `$${result[0].PendingPayouts}`
                                  },
                                  {
                                      name: "Comments 💬",
                                      value: `${result[0].Comments}`
                                  },
                                  {
                                      name: "Profitability 💰",
                                      value: `$${result[0].PendingPayouts/result[0].Posts}`
                                  }
                                ],
                                timestamp: new Date(),
                                footer: {
                                  icon_url: client.user.avatarURL,
                                  text: "© superoo7"
                                }
                              }});
                    }
                    querying(query, args);
                    break;
                case 'sbd':
                    getPrice('steem-dollars', 'USD')
                        .then(data => {
                            msg.channel.send({embed: {
                                color: 3447003,
                                author: {
                                    name: currentUsername,
                                    icon_url: msg.author.avatarURL
                                  },
                                description: `SBD Price is at ${data}`,
                                timestamp: new Date(),
                                footer: {
                                  icon_url: client.user.avatarURL,
                                  text: "© superoo7"
                                }
                              }});
                        })
                        .catch(err =>
                            errorMsg(msg,'Server down')
                        );
                    break;
                case 's':
                    getPrice('steem', 'USD')
                    .then(data => {
                        msg.channel.send({embed: {
                            color: 3447003,
                            author: {
                                name: currentUsername,
                                icon_url: msg.author.avatarURL
                                },
                            description: `${data}`,
                            timestamp: new Date(),
                            footer: {
                                icon_url: client.user.avatarURL,
                                text: "© superoo7"
                            }
                            }});
                        })
                    .catch(err =>
                        errorMsg(msg,'Server down')
                    );
                    break;    
                case 'steem':
                    getPrice('steem', 'USD')
                        .then(data => {
                            msg.channel.send({embed: {
                                color: 3447003,
                                author: {
                                    name: currentUsername,
                                    icon_url: msg.author.avatarURL
                                  },
                                description: `${data}`,
                                timestamp: new Date(),
                                footer: {
                                  icon_url: client.user.avatarURL,
                                  text: "© superoo7"
                                }
                              }});
                            })
                        .catch(err =>
                            errorMsg(msg,'Server down')
                        );
                    break;
                case 's/sbd':
                    countRatio('steem', 'sbd')
                        .then(data => {
                            msg.reply(
                                `Steem to SBD ratio is ${data}`
                            );
                        })
                        .catch(err =>
                            errorMsg(msg,'Invalid Coin')
                        );
                    break;
                case 'sbd/s':
                    countRatio('sbd', 'steem')
                        .then(data => {
                            msg.reply(
                                `SBD to Steem ratio is ${data}`
                            );
                        })
                        .catch(err =>
                            errorMsg(msg,'Invalid Coin')
                        );
                    break;
                case 'convert':
                    if (
                        args.length === 3 &&
                        !!parseFloat(args[0])
                    ) {
                        const number = parseFloat(args[0]);
                        const coin1 = args[1].toLowerCase();
                        const coin2 = args[2].toLowerCase();
                        const isCoin1Crypto =
                            coin1 in crypto;
                        const isCoin2Crypto =
                            coin2 in crypto;
                        console.log(
                            `${isCoin1Crypto} ${isCoin2Crypto}`
                        );
                        if (
                            isCoin1Crypto &&
                            isCoin2Crypto
                        ) {
                            // Crypto to Crypto
                            countRatio(coin1, coin2).then(
                                data => {
                                    if (data === '-') {
                                        errorMsg(msg,'Invalid coin/currency');
                                    } else {
                                        msg.channel.send({embed: {
                                            color: 3447003,
                                            author: {
                                                name: currentUsername,
                                                icon_url: msg.author.avatarURL
                                              },
                                            description: `${coin1} -> ${coin2}`,
                                            fields: [
                                                {
                                                    name: `${coin1}`,
                                                    value: `${number}`,
                                                },
                                                {
                                                    name: `${coin2}`,
                                                    value: `${parseFloat(data) * number }`
                                                }
                                            ],
                                            timestamp: new Date(),
                                            footer: {
                                              icon_url: client.user.avatarURL,
                                              text: "© superoo7"
                                            }
                                          }});
                                        
                                    }
                                }
                            );
                        } else if (isCoin1Crypto) {
                            // Crypto to Fiat
                            // crypto, currency
                            getOnlyPrice(coin1, coin2)
                                .then(data => {
                                    if (data === '-') {
                                        errorMsg(msg,'Invalid coin/currency');
                                    } else {
                                        msg.channel.send({embed: {
                                            color: 3447003,
                                            author: {
                                                name: currentUsername,
                                                icon_url: msg.author.avatarURL
                                              },
                                            description: `${coin1} -> ${coin2}`,
                                            fields: [
                                                {
                                                    name: `${coin1}`,
                                                    value: `${number}`,
                                                },
                                                {
                                                    name: `${coin2}`,
                                                    value: `${parseFloat(data) * number }`
                                                }
                                            ],
                                            timestamp: new Date(),
                                            footer: {
                                              icon_url: client.user.avatarURL,
                                              text: "© superoo7"
                                            }
                                          }});
                                    
                                    }
                                })
                                .catch(err =>
                                    errorMsg(msg,'Wrong Coin')
                                );
                        } else if (isCoin2Crypto) {
                            // Fiat to Crypto
                            getOnlyPrice(coin2, coin1)
                                .then(data => {
                                    if (data === '-') {
                                        msg.reply(
                                            'Invalid coin/currency'
                                        );
                                    } else {
                                        msg.channel.send({embed: {
                                            color: 3447003,
                                            author: {
                                                name: currentUsername,
                                                icon_url: msg.author.avatarURL
                                              },
                                            description: `${coin1} -> ${coin2}`,
                                            fields: [
                                                {
                                                    name: `${coin1}`,
                                                    value: `${number}`,
                                                },
                                                {
                                                    name: `${coin2}`,
                                                    value: `${number / parseFloat(data)}`
                                                }
                                            ],
                                            timestamp: new Date(),
                                            footer: {
                                              icon_url: client.user.avatarURL,
                                              text: "© superoo7"
                                            }
                                          }});
                                    }
                                })
                                .catch(err =>
                                    errorMsg(msg, 'Wrong Coin')
                                );
                        } else {
                            // error
                            errorMsg(msg, 'Invalid coin/currency');
                        }
                    } else {
                        errorMsg(msg,`Please follow the format: "${config.trigger}convert <number> <CryptoCurrencyName> <CurrencyName>" (e.g. ${
                                config.trigger}convert 1 eth myr)`
                        );
                    }
                    break;
                default:
                    msg.reply(
                        `\`${
                            config.trigger
                        }help\` to get started`
                    );
                    break;
            }
        }
    }
});

function errorMsg(msg, m) {
    msg.channel.send({embed: {
        color: 15158332,
        description: m,
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "© superoo7"
        }
      }});
}

client.login(process.env.DISCORD_TOKEN); // http //     .createServer(function(request, response) { //         response.writeHead(200, { 'Content-Type': contentType }); //         response.end(content, 'utf-8'); //     }) //     .listen(process.env.PORT || 5000);
