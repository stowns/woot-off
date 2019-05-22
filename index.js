


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
        let currentItem = $(".main-title").text();
        if (lastItem != currentItem) {
            lastItem = currentItem;
            // dig deeper and get the specific item details
            let href = $(".main-title").parent().attr('href');
            let detailHtml = await rp(href);
            $ = cheerio.load(detailHtml);
            let price = $('.price-exact > .price').text();
            let discount = $('.price-exact > .discount > .percentage').text();
            let message = `'${currentItem}' for ${price} (${discount})`;
            if (config.desktopNotification) {
                notifier.notify({
                    title: 'NEW w00t item detected!',
                    message: message,
                    wait: config.wait,
                    sound: config.sound,
                    open: href,
                    timeout: config.timeout,
                    closeLabel: 'Dismiss'
                });
            }
            console.log(`${message} @ ${new Date().toLocaleTimeString()}`);
        }
    } catch (e) {
        console.log(e.message)
        console.log("uh oh! something went wrong!")
        clearInterval(interval);
    }
}, config.pollIntervalMS);