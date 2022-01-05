const DATABASE_VERSION = 1;
const DATABASE_NAME = "OGAME";
const DATABASE_STORE_MESSAGES = "MESSAGES";

const MessageType = {
    EXPEDITION    : 'EXPEDITION',
    ESPIONAGE     : 'ESPIONAGE',
    COMBAT_REPORT : 'COMBAT_REPORT',
    OTHER         : 'OTHER',
}

function formatNumber(num) {
    return num?.toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}
export class DbContext {
    #db = null;

    get db() {
        return this.#db;
    }

    init() {
        return this.#connectDatabase();
    }

    #connectDatabase() {
        const promise = new Promise((resolve, reject) => {
            const request = indexedDB.open(
                DATABASE_NAME,
                DATABASE_VERSION
            );

            request.onsuccess = (event) => {
                console.debug("ACCESSO A DB RIUSCITO");

                this.#db = event.target.result;
                resolve(this.#db);
            }

            request.onerror = (e) => {
                console.error(e);
                reject(e);
            };

            request.onblocked = function (event) {
                alert("Please close all other tabs with this site open!");
            };

            request.onupgradeneeded = (event) => {
                console.debug("ON UPGRADE", event);

                const db = event.target.result;

                if (event.oldVersion < 1) {
                    // Version 1 is the first version of the database.
                    const msgStore = db.createObjectStore(
                        DATABASE_STORE_MESSAGES,
                        { keyPath: "id" }
                    );

                    // Index by type and date
                    msgStore.createIndex(
                        "by_type_date",
                        ["type", "date"],
                        { unique: false }
                    );

                    // Index by type only
                    msgStore.createIndex("by_type", "type", { unique: false });

                    // Index by date only
                    msgStore.createIndex("by_date", "date", { unique: false });
                }

                // if (event.oldVersion < 2) {
                //     console.debug("version 2");
                //     // Version 2 introduces a new index of books by year.
                //     // const bookStore = request.transaction.objectStore("books");
                //     // bookStore.createIndex("by_year", "year");
                // }
            }
        });

        return promise;
    }

    #getStore(store_name, mode) {
        const tx = this.#db.transaction(store_name, mode);
        return tx.objectStore(store_name);
    }

    getMessagesStore(mode) {
        return this.#getStore(DATABASE_STORE_MESSAGES, mode);
    }

    addMessage(message) {
        const tx = this.getMessagesStore('readwrite');
        tx.add(message);
    }

    getMessages(type, date) {
        const store = this.#getStore(DATABASE_STORE_MESSAGES, 'readonly');

        let indexName = "by_type_date"; 
    
        if (type && date || (!type && !date)) {
            indexName = "by_type_date";
        } else if (type) {
            indexName = "by_type";
        } else if (date) {
            indexName = "by_date";
        }

        const key = (type || date) ? [type, date].filter(x => x) : null;

        const index = store.index(indexName);
        const request = index.getAll(key);

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                resolve(event.target.result);
            }

            request.onerror = (e) => {
                reject(e);
            }
        });

    }
}

export class MpMessageDataCollector {

    dbContext = null;

    constructor() {
        this.dbContext = new DbContext();
    }

    async init() {
        await this.dbContext.init();
        this.#observeForChanges();
    }

    #observeForChanges() {
        const config = { attributes: true, childList: true, subtree: true };

        this.observer = new MutationObserver((ml) => {
            const isChildListChange = ml.some(m => m.type === 'childList');

            if (isChildListChange) {
                $('.msg').toArray().forEach(el => {
                    this.dbContext.addMessage(MpMessage.fromElement(el));
                });
            }
        });

        this.observer.observe(document.getElementById('buttonz'), config);
    }
}

export class MpMessage {
    constructor({id, text, title, date, time, type, coords}) {
        this.id     = id;
        this.text   = text;
        this.title  = title;
        this.date   = date;
        this.time   = time;
        this.type   = type;
        this.coords = coords;
    }

    get resources() {
        if (this.type === MessageType.EXPEDITION) {
            const r = /(Cristallo|Metallo|Deuterio)\s(.*)\s(è stato razziato\.)/mg.exec(this.text); 
            const resource = r?.[1];
            const amount = +(r?.[2].replaceAll('.',''));
    
            if (resource) {
                return { resource, amount };
            }
        }
        
        return null;
    }

    static #parseType(text) {
        const types = [
            {
                tokens: ['risultato della spedizione',],
                type: MessageType.EXPEDITION
            },
            {
                tokens: ['azione di spionaggio',],
                type: MessageType.ESPIONAGE
            },
            {
                tokens: ['rapporto di combattimento',],
                type: MessageType.COMBAT_REPORT
            },
        ];

        const r = types.find(t => t.tokens.some(token => text.toLowerCase().includes(token)));

        return r?.type || MessageType.OTHER;
    }

    static fromElement(el) {
        const id    = el.getAttribute('data-msg-id');
        const text  = el.querySelector('.msg_content').textContent;
        const title = el.querySelector('.msg_title ').textContent;

        const textDatetime = el.querySelector('.msg_date.fright').textContent;
        const time = textDatetime.split(' ')[1];
        const date = textDatetime.split(' ')[0].split('.').reverse().join('-');

        const [
            _, galaxy, system, position,
        ] = /\[(\d):(\d{1,3}):(\d{1,2})\]/.exec(title) || [];

        const type = this.#parseType(title);

        return new MpMessage({ 
            id, date, time, type, text, title, 
            coords: { galaxy, system, position } 
        });
    }
}

export class MpMessageStatistics {
    messages = null; 

    constructor(dbContext) {
        this.dbContext = dbContext;
    }

    async loadExpeditionMessages(date) {
        const response = await this.dbContext.getMessages(MessageType.EXPEDITION, date);
        this.messages = response.map(m => new MpMessage(m));
    }

    get resources() {
        const result = {};

        this.messages
            ?.map(m => m.resources)
            ?.filter(r => r)
            ?.forEach(({resource, amount}) => {
                result[resource] = 
                  result[resource] 
                      ? result[resource]+=amount 
                      : amount; 
            });

        return result;
    }
}
