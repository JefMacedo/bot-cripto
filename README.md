# Bot Cripto

A cryptocurrency trading bot using the Binance API to monitor the market and execute trades based on RSI (Relative Strength Index) technical indicator.

## Overview

This project is designed primarily as a learning tool to understand how to:

- Connect to the Binance API
- Retrieve cryptocurrency market data
- Calculate technical indicators (specifically RSI)
- Execute automated trading decisions
- Implement a simple trading bot architecture

⚠️ **Note**: This project is intended for testing and educational purposes only. It is not designed for production use with real funds.

## Features

- Connects to Binance testnet API
- Calculates RSI (Relative Strength Index) in real-time
- Makes buy/sell decisions based on RSI values
- Executes market orders automatically
- Implements a simple trading strategy

## Setup

### Prerequisites

- Node.js installed
- Binance testnet account
- API keys from Binance testnet

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JefMacedo/bot-cripto.git
cd bot-cripto
```
2. Install dependencies:
```bash
npm install
```
3. Create a .env file with your Binance API credentials:
```bash
API_KEY=your_api_key_here
SECRET_KEY=your_secret_key_here
```
4. Start the bot:
```bash
node index.js
```

## How It Works

### Configuration

The bot uses these default settings in index.js:

- Trading pair: BTCUSDT (Bitcoin/USDT)
- Trade quantity: 0.0001 BTC
- RSI period: 14 (standard)
- Check interval: Every 5 seconds

### Trading Strategy
The bot implements a simple RSI-based strategy:

1. Retrieves the latest 100 1-minute candles from Binance
2. Calculates the RSI using the closing prices
3. Makes trading decisions based on RSI values:
    - Buy when RSI < 35 (oversold condition)
    - Sell when RSI > 70 (overbought condition)

### RSI Calculation

The Relative Strength Index is calculated using the standard formula:

1. First calculates average gains and losses over the specified period
2. Then applies the RSI formula: `100 - (100 / (1 + RS))` where RS = Average Gains / Average Losses

### API Connection

The bot connects to the Binance testnet by default. To use the production API (not recommended for testing), uncomment the production API URL in index.js.

### Disclaimer

This bot is designed for educational purposes and to explore the Binance API. It is not optimized for actual trading and lacks many features needed for a production-ready trading system, such as:

- Proper error handling
- Sophisticated risk management
- Performance optimization
- Security features
**Never use API keys with withdrawal permissions for automated trading bots.**

### License
This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

### Contributing
Feel free to fork this repository and use it as a starting point for your own cryptocurrency trading bot experiments. Pull requests with improvements or bug fixes are welcome. 
