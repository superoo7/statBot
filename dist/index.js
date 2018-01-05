'use strict';

var _discord = require('discord.js');

var Discord = _interopRequireWildcard(_discord);

var _winston = require('winston');

var logger = _interopRequireWildcard(_winston);

var _dotenv = require('dotenv');

var dotenv = _interopRequireWildcard(_dotenv);

var _steem = require('steem');

var steem = _interopRequireWildcard(_steem);

var _http = require('http');

var http = _interopRequireWildcard(_http);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

require('babel-polyfill');

var _db = require('./db');

var _sql = require('./sql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

dotenv.config();

// setting
var triggerBotKey = '!';

// start client
var client = new Discord.Client();

client.on('ready', function () {
    logger.info('Logged in as ' + client.user.tag + '!');
});

client.on('message', function (msg) {
    logger.info(msg.content);

    if (msg.content.substring(0, 1) == triggerBotKey) {
        var args = msg.content.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        // CONSOLE LOGGING
        logger.info('CMD: ' + cmd);
        logger.info('ARGS: ' + args);
        console.log(args);
        // END
        var message = void 0;
        switch (cmd) {
            case 'help':
                message = 'statBot HELP\n\n                Type `!ping` to get bot reply \'pong\'\n\n                Type `!user <steem_name>` to get details of that person (without @)\n\n                Type `!ratio ` to get steem to sbd ratio from Bittrex\n\n                Type `!tag <tag_name>` to get details on votes, comments, topics and pending payout of that certain tags in past 7 days\n\n                Type `!delete <message_id>` to delete a message\n                ';
                msg.reply(message);
                break;
            case 'user':
                steem.api.getAccounts(args, function (err, results) {
                    if (!!results[0]) {
                        results.map(function (result) {
                            if (!!result) {
                                console.log(result);
                                var reputation = steem.formatter.reputation(result.reputation);
                                var accountWorth = steem.formatter.estimateAccountValue(result);

                                accountWorth.then(function (worth) {
                                    message = '@' + result.name + ' says "' + JSON.parse(result.json_metadata).profile.about + '"\n                                and reputation: ' + reputation + ' \uD83D\uDD30\n                                and account worth: $' + worth + ' \uD83D\uDCB0\n                                ';
                                    msg.reply(message);
                                }).catch(function (err) {
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
                var query = (0, _sql.searchTag)(args[0]);

                var querying = function () {
                    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(query, tag) {
                        var result;
                        return regeneratorRuntime.wrap(function _callee$(_context) {
                            while (1) {
                                switch (_context.prev = _context.next) {
                                    case 0:
                                        _context.next = 2;
                                        return (0, _db.executeQuery)(query);

                                    case 2:
                                        result = _context.sent;

                                        console.log(result);
                                        result === 'ERROR' ? msg.reply('ERROR ON QUERY-ING') : msg.reply('There is\n                               ' + result[0].Posts + ' posts \uD83D\uDCD8,\n                               ' + result[0].Votes + ' votes \uD83D\uDC4D,\n                               $' + result[0].PendingPayouts + ' steem \uD83D\uDCB5,\n                               ' + result[0].Comments + ' comments \uD83D\uDCAC,\n                               on #' + tag + ' in the past 7 days');

                                    case 5:
                                    case 'end':
                                        return _context.stop();
                                }
                            }
                        }, _callee, this);
                    }));

                    return function querying(_x, _x2) {
                        return _ref.apply(this, arguments);
                    };
                }();

                querying(query, args);
                break;
            case 'ratio':
                var steemPrice = void 0;
                var sbdPrice = void 0;
                _axios2.default.get('https://bittrex.com/api/v1.1/public/getmarketsummary?market=btc-steem').then(function (res) {
                    steemPrice = {
                        low: res.data.result[0].Low,
                        high: res.data.result[0].High
                    };
                    return _axios2.default.get('https://bittrex.com/api/v1.1/public/getmarketsummary?market=btc-sbd');
                }).then(function (res) {
                    sbdPrice = {
                        low: res.data.result[0].Low,
                        high: res.data.result[0].High
                    };
                    console.log(steemPrice);
                    console.log(sbdPrice);
                    var ratio = {
                        low: steemPrice.low / sbdPrice.low,
                        high: steemPrice.high / sbdPrice.high
                    };
                    console.log(ratio);
                    msg.reply('ratio from bittrex: ' + ratio.low + ' <-> ' + ratio.high + ' steem/sbd');
                });
                break;
            case 'delete':
                msg.channel.fetchMessage(args[0]).then(function (message) {
                    message.delete().then(function (msg) {
                        return msg.reply('Deleted message from ' + msg.author);
                    }).catch(console.error);
                }).catch(console.error);
                break;
            default:
                message = '`!help` to get started';
                msg.reply(message);
                break;
        }
    }
});
client.login(process.env.DISCORD_TOKEN);
http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': contentType });
    response.end(content, 'utf-8');
}).listen(process.env.PORT || 5000);
//# sourceMappingURL=index.js.map