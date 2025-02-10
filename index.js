const axios = require("axios");

const SYMBOL = 'BTCUSDT';
const BUY_PRICE = 97400;
const SELL_PRICE = 98200;

const API_URL = 'https://testnet.binance.vision/';//https://api.binance.com/';

let isOpened

async function start() {
    console.clear();
    console.log('Checking price...');

    const {data} = await axios.get(`${API_URL}api/v3/klines?limit=21&interval=15m&symbol=${SYMBOL}`);
    const candle = data[data.length -1];
    const price = parseFloat(candle[4]);

    console.log(`Price: ${price}`);

    if(price <= BUY_PRICE && isOpened === false) {
        console.log('Buy!');
    } else if(price >= SELL_PRICE && isOpened === true) {
        console.log('Sell!');
    } else{
        console.log('Hodl!');
    }
}

setInterval(start, 3000);

start();
