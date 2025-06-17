import axios from 'axios';

const minute = 60_000;

type IPrice = { usd: number; usd_24h_change: number };

type Cache = {
  value: Record<string, IPrice>;
  timestamp: number;
};

class PriceService {
  private _loading: boolean = false;
  private _cache: Cache = JSON.parse(
    localStorage.getItem('price_cache') ||
      JSON.stringify({
        value: {},
        timestamp: 0,
      })
  );

  private _url = 'https://api.coingecko.com/api/v3';
  private _supported_tokens = {
    eth: 'ethereum',
    usdc: 'usd-coin',
  };
  private _tockens = Object.values(this._supported_tokens).join(',');
  private _timeout = minute;

  async fetchPrice() {
    if (this._loading) {
      return { value: 0, timestamp: 0 };
    }
    if (this._cache.timestamp + this._timeout > Date.now()) {
      return this._cache;
    }
    this._loading = true;

    const response = await axios.get(
      `${this._url}/simple/price?ids=${this._tockens}&vs_currencies=usd&include_24hr_change=true`
    );
    const fetchedPrice: Record<string, IPrice> = {};

    for (const [key, value] of Object.entries(this._supported_tokens)) {
      fetchedPrice[key] = response.data[value];
    }
    this._loading = false;

    this._cache = { value: fetchedPrice, timestamp: Date.now() };
    localStorage.setItem(
      'price_cache',
      JSON.stringify({ value: fetchedPrice, timestamp: Date.now() })
    );
    return this._cache;
  }

  get(symbol: string) {
    symbol = symbol.toLowerCase();
    const isTokenExist = Object.keys(this._supported_tokens).includes(symbol);

    if (!isTokenExist) {
      return { usd: 0, usd_24h_change: 0 };
    }
    this.fetchPrice();

    const tokenPrice = this._cache.value[symbol];

    return tokenPrice || { usd: 0, usd_24h_change: 0 };
  }
}

export const priceService = new PriceService();
