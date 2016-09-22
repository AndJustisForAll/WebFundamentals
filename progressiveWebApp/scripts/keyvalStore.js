(function () {
    'use strict';
    var dbPromise = idb.open('keyval-store', 1, function (upgradeDB) {
        upgradeDB.createObjectStore('keyval');
    });

    var idbKeyval = {
        get: function (key) {
            return dbPromise.then(function (db) {
                return db.transaction('keyval').objectStore('keyval').get(key);
            });
        },

        set: function (key, val) {
            return dbPromise.then(function (db) {
                var tx = db.transaction('keyval', 'readwrite');
                tx.objectStore('keyval').put(val, key);
                return tx.complete;
            });
        },

        delete: function (key) {
            return dbPromise.then(function (db) {
                var tx = db.transaction('keyval', 'readwrite');
                tx.objectStore('keyval').delete(key);
                return tx.complete;
            });
        },

        clear: function () {
            return dbPromise.then(function (db) {
                var tx = db.translaction('keyval', 'readwrite');
                tx.objectStore('keyval').clear(key);
                return tx.complete;
            });
        },

        keys: function () {
            return dbPromise.then(function (db) {
                var tx = db.transaction('keyval');
                var keys = [];
                var store = tx.objectStore('keyval');
                (store.iterateKeyCursor || store.iterateCursor).call(store, function (cursor) {
                    if (!cursor) return;
                    cursor.continue();
                });
                return tx.complete.then(function () {
                    return keys;
                });
            });
        }
    };

    Window.idbKeyval = idbKeyval;
})();
