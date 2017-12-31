import * as Discord from 'discord.js';
import * as logger from 'winston';
import * as dotenv from 'dotenv';
import * as steem from 'steem';

import 'babel-polyfill';

dotenv.config();

import { executeQuery } from './db';

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
        let message;
        switch (cmd) {
            case 'help':
                message = `statBot HELP\n
                Type \`!ping\` to get bot reply 'pong'\n
                Type \`!user <steem_name>\` to get details of that person (without @)\n
                Type \`!tag <tag_name>\` to get details on votes, comments, topics and pending payout of that certain tags in past 7 days
                `;
                msg.reply(message);
                break;
            case 'user':
                steem.api.getAccounts(args, function(err, result) {
                    if (!!result[0]) {
                        console.log(result[0]);
                        console.log(JSON.parse(result[0].json_metadata));

                        message = `@${result[0].name} has ${
                            result[0].voting_power
                        }💪 and his about said that "${
                            JSON.parse(result[0].json_metadata).profile.about
                        }"`;
                        msg.reply(message);
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
                const query = `
select
 SUM(net_votes) as Votes,
 SUM(pending_payout_value) as PendingPayouts,
 SUM(children) as Comments,
 COUNT(*) as Posts
from
 Comments (NOLOCK)
where
 dirty = 'False' and
 json_metadata LIKE('%"malaysia"%') and
  parent_author = '' and
 datediff(day, created, GETDATE()) between 0 and 7
order by
 Votes desc


                     `;
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
            default:
                message = '`!help` to get started';
                msg.reply(message);
                break;
        }
    }
});
client.login(process.env.DISCORD_TOKEN);
