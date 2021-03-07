### Routes :

1. `/api/buy/:symbol` ==> Symbol it's name of a coin like : ETH
   This endPoint Buy coin with bitcoin
   Example : GET request to `/api/buy/eth`
   it's buy eth with bitcoin
2. `/api/sell/:symbol` ==> Symbol it's name of a coin like : ETH
   Example : GET request to `/api/sell/eth`
   it's sell eth and get bitcoin
3. `/api/balanceOnBTC` ==> Get balance of account on btc
4. `/api/openOrders` ==> Get All open orders
5. `/api/getLasPrice/:symbol` ==> Get last price of coin in binance. Example : GET request to `/api/getLasPrice/ethusdt` return the last price of eth on usdt
