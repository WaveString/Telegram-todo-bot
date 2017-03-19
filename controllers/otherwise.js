const Telegram = require('telegram-node-bot');

class OtherwiseController extends Telegram.TelegramBaseController {
    /**
     * @param {Scope} $
     */
    handle($) {
        $.sendMessage('Error! Please, type a right command.')
    }
}

module.exports = OtherwiseController;