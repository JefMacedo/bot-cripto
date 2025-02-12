const axios = require("axios");

const SYMBOL = 'BTCUSDT';

const PERIOD = 14;

const API_URL = "https://api.binance.com/";

function averages(prices, period, startIndex) {
    let gains = 0, losses = 0;

    for (let i = 0; i < period && (i + startIndex) < prices.length; i++) {
        const diff = prices[i + startIndex] - prices[i + startIndex - 1];
        if (diff >= 0)
            gains += diff;
        else
            losses += Math.abs(diff);
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;
    
    return { avgGain, avgLoss };
}

function calcRSI(prices, period) {
    let avgGains = 0, avgLosses = 0;

    for(let i = 1; i < prices.length; i++){
        let newAverages = averages(prices, period, i);

        if(i <= 3){
            avgGains = newAverages.avgGain;
            avgLosses = newAverages.avgLoss;
            continue;
        }

        avgGains = (avgGains * (period -1) + newAverages.avgGain) / period;
        avgLosses = (avgLosses * (period -1) + newAverages.avgLoss) / period;
    }

    const rs = avgGains / avgLosses;
    return 100 - (100 / (1 + rs));
}

let isOpened = false;

async function start() {
    console.clear();
    console.log('Checking price...');

    const {data} = await axios.get(`${API_URL}api/v3/klines?limit=100&interval=1m&symbol=${SYMBOL}`);
    const candle = data[data.length -1];
    const lastPrice = parseFloat(candle[4]);

    console.log(`Price: ${lastPrice}`);

    const prices = data.map(candle => parseFloat(candle[4]));
    const rsi = calcRSI(prices, PERIOD);
    console.log(`RSI: ${rsi}`);

    if(rsi < 40 && isOpened === false) {
        console.log('Sobrevendido, hora de comprar');
        isOpened = true;
    }
    else if(rsi > 70 && isOpened === true) {
        console.log('Sobrecomprado, hora de vender!');
        isOpened = false;
    }
    else{
        console.log('Aguardar!');
    }
}

setInterval(start, (1000 * 35));

start();
