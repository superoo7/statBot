# steem-discord bot

# What is this?

This is a discord bot that are able to consume Steem API, search Steem Price, use of SteemSQL.

# To Do

* Check delegators and delegatee
* Added Test (Jest)


## Function

* Check convertion rate between crypto to crypto, fiat to crypto and crypto to fiat.
* Check SBD, Steeem Price and ratio of Steem/SBD.
* Check a tag on steemit to get the performance in the past 7 days.
* Check a tag on steemit to get the performance in since 01/01/2017.
* Generate links for delegation

## Command

[OUTDATE, WILL BE UPDATE SOON]

Type `%ping` to get bot reply 'pong'

Type `%tag <tag_name>` to get details on votes, comments, topics and pending payout of that certain tags in past 7 days

Type `%sbd` to get sbd price from coinmarketcap

Type `%steem` to get steem price from coinmarketcap

Type `%s/sbd` to get steem to sbd ratio from coinmarketcap

Type `%convert <value> <from this coin/currency> <to this coin/currency>` to calculate crypto to fiat from coinmarketcap (e.g. %convert 10 steem myr)

Type `%info` to know more about this bot

# Developer Part

* Need subscription to SteemSQL (10 SBD/month)
* Change `.env.sample` to `.env`
* Add your own [Discord Token](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)

# Feel free to file issue and PR

# License

MIT
