


const rp = require('request-promise');
const cheerio = require('cheerio');
const notifier = require('node-notifier');
const config = require('./config.js');
const w00t = 'https://www.woot.com/category/sellout';
let lastItem = ""
let interval = setInterval(async () => {
    try {
        let html = await rp(w00t);
        let $ = cheerio.load(html)
        let current = $(".main-title").text();
        if (lastItem != current) {
            lastItem = current;
            notifier.notify({
                title: 'NEW w00t item detected!',
                message: current,
                wait: config.wait,
                sound: config.sound,
                open: w00t,
                timeout: config.timeout,
                closeLabel: 'Dismiss'
            });
        }
    } catch (e) {
        console.log(e.message)
        console.log("uh oh! something went wrong!")
        clearInterval(interval);
    }
}, config.pollIntervalMS);