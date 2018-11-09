# StatBot [Name will be change soon]

Current Version: 2.1.0

[Join our Discord channel!](https://discord.gg/J99vTUS)

# What is this?

This is a discord bot that are able to consume Steem API, search Steem Price, use of SteemSQL and check steemhunt related stuff.

# To Do

-   Added Test (Jest)
-   Prepare new website

## Function

-   Check convertion rate between crypto to crypto, fiat to crypto and crypto to fiat.
-   Check SBD, Steeem Price and ratio of Steem/SBD.
-   Generate links for delegation
-   Check Steemhunt post status

[DEPRECATED]

-   Check a tag on steemit to get the performance in the past 7 days.
-   Check a tag on steemit to get the performance in since 01/01/2017.

## Who uses statBot?

-   TeamMalaysia
-   AUS & NZ
-   Steemph.Cebu
-   Steemhunt

## Command

### Active

|                           Command                          |                                  Functions                                  |
| :--------------------------------------------------------: | :-------------------------------------------------------------------------: |
|                           `%ping`                          |                            Check ping of the bot                            |
| `%convert <value> <from coin/currency> <to coin/currency>` | to calculate crypto to fiat from coinmarketcap (e.g. %convert 10 steem myr) |
|                        `%hunt <url>`                       |                         Check steemhunt post status                         |
|               `%price <coin>`    or `$<coin>`              |                        Get current price of the coin                        |
|    `%delegate <to> <SP>` or `%delegate <from> <to> <SP>`   |                  Generate SteemConnect link for delegation                  |
|                         `%discord`                         |                               Join our Discord                              |
|                           `%info`                          |                         to know more about this bot                         |

### Others

|  Command |                   Functions                  |
| :------: | :------------------------------------------: |
|  `%sbd`  |      to get sbd price from coinmarketcap     |
| `%steem` |     to get steem price from coinmarketcap    |
| `%s/sbd` | to get steem to sbd ratio from coinmarketcap |
| `%sbd/s` | to get sbd to steem ratio from coinmarketcap |

### Deprecated

Unmantained command

|               Command               |                                             Functions                                            |
| :---------------------------------: | :----------------------------------------------------------------------------------------------: |
|          `%tag <tag_name>`          | to get details on votes, comments, topics and pending payout of that certain tags in past 7 days |
|          `%all <tag_name>`          |    Details on votes, comments, topics and pending payout of that certain tags from 01/01/2017    |
| `%query <query_name> <query_input>` |                           Currentl available operation are tag and all                           |

# Developer Part

-   Need subscription to SteemSQL (10 SBD/month)
-   Change `.env.sample` to `.env`
-   Add your own [Discord Token](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)

# Feel free to file issue and PR

# License

MIT
