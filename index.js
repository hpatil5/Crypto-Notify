const axios = require('axios')
//1. Import coingecko-api
const CoinGecko = require('coingecko-api');

//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

const reqObj = require('./preferedCoins.json')

//3. Make calls
var func = async() => {
  let res = await CoinGeckoClient.coins.markets({'vs_currency' : 'inr'});
  let data = res.data;
  const avgBuyPrice = 5;
  const coin = 'zilliqa'
  let ids = reqObj.map(obj => obj.id)
  const reqData = data.filter(tkn => ids.includes(tkn.id))
  reqData.map(data => {
      let {id, current_price, ath, ath_change_percentage, high_24h, low_24h, price_change_24h} = data;
      const history_7days = CoinGeckoClient.coins.fetchMarketChart(id, {'days':'7'}, {'vs_currency' : 'inr'});
      console.log()
      if(avgBuyPrice<current_price){
          const profitPercent = ((current_price-avgBuyPrice)/avgBuyPrice)*100;
        if(id === coin){
          if(profitPercent>=2){
                //call notification api
                axios.post(`https://discord.com/api/webhooks/801667131237859338/y0nH3B-rvhEiq64pMqD3AX2sxSGNlfiqarJrRuwfOpT57OnBtj4FlXYvQwkp973iwC31`,
                    {content : `${id.toUpperCase()} price alert : profit > 2%`})
                .then(res => console.log('no error'))
                .catch(error => console.log('oops error'))
              break;
            }
        }
      }
      console.log(id,current_price,ath,ath_change_percentage,high_24h,low_24h,price_change_24h)
  })
};

func()