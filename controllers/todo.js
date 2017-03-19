const Telegram = require('telegram-node-bot');

class TodoController extends Telegram.TelegramBaseController {
    /**
     * @param {Scope} $
     */
    addHandler($) {
        const todo = $.message.text.split(' ').slice(1).join(' ');
        if (!todo) {
            $.sendMessage('Error! Please type a todo item.');
        }
        $.getUserSession('todos')
            .then(todos => {
                if (!Array.isArray(todos)) {
                    $.setUserSession('todos', [todo])
                } else {
                    $.setUserSession('todos', todos.concat(todo));
                }

                $.sendMessage(`New todo: "${todo}" is added!`);
            })
            .catch(err => console.log('Error:', err));
    }

    /**
     * @param {Scope} $
     */
    listHandler($) {
        $.getUserSession('todos')
            .then(todos => {
                $.sendMessage(this._serializeList(todos), { parse_mode: 'Markdown'});
            })

            .catch(err => console.log('Error:', err));
    }

    checkHandler($) {
        const index = parseInt($.message.text.split(' ').slice(1)[0]);

        if(isNaN(index)) {
            $.sendMessage(`Error! Please, type a valid index`);
        }

        $.getUserSession('todos')
            .then(todos => {
                if (index >= todos.length) {
                    return $.sendMessage(`Error! Please, type a valid index`);
                }
                const checked = todos.splice(index, 1);
                $.setUserSession('todos', todos);
                $.sendMessage(`Checked todo! *${checked}*`)
            })
            .catch(err => console.log('Error', err));
    }

    /**
     * @param {Array} todoList
     */
    _serializeList(todoList) {
        if (!todoList || !todoList.length) {
            return 'Todos list is empty.';
        }
        let serialize = `*Todos list:*\n\n`;
        todoList.forEach((t, i) => {
            serialize += `*${i}*: ${t}\n`;
        });
        return serialize;
    }

    get routes() {
        return {
            'addCommand': 'addHandler',
            'listCommand': 'listHandler',
            'checkCommand': 'checkHandler'
        }
    }
}

module.exports = TodoController;