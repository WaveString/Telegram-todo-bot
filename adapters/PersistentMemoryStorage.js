const Telegram = require('telegram-node-bot');
const fs = require('fs');

class PersistentMemoryStorage extends Telegram.BaseStorage {
    constructor(userDataPath, chatDataPath) {
        super();

        this._userDataPath = userDataPath;
        this._chatDataPath = chatDataPath;

        this._storage = {
            userStorage: require(userDataPath),
            chantStorage: require(chatDataPath)
        };
    }

    get (storage, key) {
        return new Promise((resolve, reject) => {
            resolve(this._storage[storage][key] || {});
        })
    }

    set(storage, key, data) {
        return new Promise((resolve, reject) => {
            this._storage[storage][key] = data;
            resolve();
        });
    }

    remove(storage, key) {
        return new Promise((resolve, reject) => {
            delete this._storage[storage][key];
            resolve();
        })
    }

    flush() {
        fs.writeFileSync(this._userDataPath, JSON.stringify(this._storage.userStorage));
        fs.writeFileSync(this._chatDataPath, JSON.stringify(this._storage.chantStorage));
    }
}

module.exports = PersistentMemoryStorage;