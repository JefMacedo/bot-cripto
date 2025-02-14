const axios = require("axios");
const crypto = require("crypto");

const SYMBOL = 'BTCUSDT';
const QUANTITY = "0.0001";
const PERIOD = 14;

//CREDENCIAIS PARA ACESSO A API DE TESTE DA BINANCE
const API_URL = "https://testnet.binance.vision";
const API_KEY = "ZOW8InO3PzoPo2cSSOMQs5UB1Y4GHhQM6FWpKNtwAUFXrTbhP2NcWBDFq96mpwwA";
const SECRET_KEY = "pIfidYCJkGBX5nhVZVRWVoYeseKKStKkzdURX0oMAEIPFzS46fKLsSItDTy9G7Ri";

//CREDENCIAIS PARA ACESSO A API DE PRODUÇÃO DA BINANCE
//const API_URL = "https://api.binance.com/";

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

async function newOrder(symbol, quantity, side){
    const order = { symbol, quantity, side };
    order.type = "MARKET";
    order.timestamp = Date.now();

    const signature = crypto
        .createHmac("sha256", SECRET_KEY)
        .update(new URLSearchParams(order).toString())
        .digest("hex");

    order.signature = signature;

    try{
        const {data} = await axios.post(
            API_URL + "/api/v3/order", 
            new URLSearchParams(order).toString(), 
            {
                headers: { "X-MBX-APIKEY": API_KEY }
            }
        )
        console.log(data);
    }
    catch(err){
        console.error(err.response.data);
    }
}

let isOpened = false;

async function start() {
    console.clear();
    console.log('Checking price...');

    const {data} = await axios.get(`${API_URL}/api/v3/klines?limit=100&interval=1m&symbol=${SYMBOL}`);
    const candle = data[data.length -1];
    const lastPrice = parseFloat(candle[4]);

    console.log(`Price: ${lastPrice}`);

    const prices = data.map(candle => parseFloat(candle[4]));
    const rsi = calcRSI(prices, PERIOD);
    console.log(`RSI: ${rsi}`);

    if(rsi < 35 && isOpened === false) {
        console.log('Sobrevendido, hora de comprar');
        isOpened = true;
        
        newOrder(SYMBOL, QUANTITY, 'BUY');
        console.log('Ordem de compra enviada!');
    }
    else if(rsi > 70 && isOpened === true) {
        console.log('Sobrecomprado, hora de vender!');
        isOpened = false;
        
        newOrder(SYMBOL, QUANTITY, 'SELL');
        console.log('Ordem de venda enviada!');
    }
    else{
        console.log('Aguardar!');
    }
}

setInterval(start, (1000 * 5));

start();
