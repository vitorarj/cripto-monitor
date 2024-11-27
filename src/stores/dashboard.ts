import { defineStore } from 'pinia'
import { ref } from 'vue'
import ApiService from '@/services/api.services'

const CACHE_KEYS = {
  CRYPTOS: 'dashboard_cryptos_cache',
  CURRENCIES: 'dashboard_currencies_cache',
  TRADING_VOLUME: 'dashboard_trading_volume_cache',
  PRICE_HISTORY: 'dashboard_price_history_cache',
  CURRENT_PRICE: 'dashboard_current_price_cache',
}

const getCache = (key: string) => {
  const cached = localStorage.getItem(key)
  try {
    return cached ? JSON.parse(cached) : null
  } catch {
    return null
  }
}

const setCache = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to cache:', error)
  }
}

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const showFilters = ref(false)
  const selectedPeriod = ref('7d')
  const selectedMetric = ref('price')
  const selectedCrypto = ref('bitcoin')
  const selectedCurrency = ref('usd')
  const cryptos = ref([])
  const currencies = ref([])
  const tradingVolumeData = ref([])
  const priceHistoryData = ref([])
  const isLoading = ref(false)

  // Chart base configurations
  const chartConfigs = {
    currentPrice: {
      series: [
        {
          name: 'Preço',
          data: [],
        },
      ],
      options: {
        chart: {
          type: 'line',
          height: 350,
          zoom: {
            enabled: true,
            type: 'x',
            autoScaleYaxis: true,
          },
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true,
            },
          },
        },
        stroke: { curve: 'smooth', width: 2 },
        colors: ['#00A83E'],
        markers: { size: 0 },
        grid: { borderColor: '#f1f1f1' },
        xaxis: {
          type: 'datetime',
          labels: {
            datetimeFormatter: {
              year: 'yyyy',
              month: "MMM 'yy",
              day: 'dd MMM',
              hour: 'HH:mm',
            },
          },
        },
        yaxis: {
          labels: { formatter: (val) => val.toFixed(2) },
          title: { text: `Preço (${selectedCurrency.value.toUpperCase()})` },
        },
        tooltip: { x: { format: 'dd MMM yyyy HH:mm' } },
      },
    },

    tradingVolume: {
      series: [
        {
          name: 'Volume',
          data: [],
        },
      ],
      options: {
        chart: {
          type: 'line',
          toolbar: { show: false },
        },
        stroke: { curve: 'stepline' },
        colors: ['#06b6d4'],
        xaxis: { categories: [] },
      },
    },

    dailyReturns: {
      series: [
        {
          data: [44, 55, 41, 64, 22, 43, 21],
        },
      ],
      options: {
        chart: {
          type: 'bar',
          toolbar: { show: false },
        },
        colors: ['#10b981'],
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
          },
        },
      },
    },

    priceHistory: {
      series: [
        {
          name: 'Price',
          data: [],
        },
      ],
      options: {
        chart: {
          type: 'line',
          height: 350,
          zoom: {
            enabled: true,
            type: 'x',
            autoScaleYaxis: true,
          },
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true,
            },
          },
        },
        stroke: { curve: 'smooth', width: 2 },
        colors: ['#4f46e5'],
        dataLabels: { enabled: false },
        markers: { size: 0 },
        grid: { borderColor: '#f1f1f1' },
        xaxis: {
          type: 'datetime',
          labels: {
            datetimeFormatter: {
              year: 'yyyy',
              month: "MMM 'yy",
              day: 'dd MMM',
              hour: 'HH:mm',
            },
          },
        },
        yaxis: {
          title: { text: `Preço (${selectedCurrency.value.toUpperCase()})` },
        },
        tooltip: { x: { format: 'dd MMM yyyy HH:mm' } },
      },
    },

    priceAction: {
      series: [
        {
          data: [
            { x: new Date(2024, 1, 1), y: [6629.81, 6650.5, 6623.04, 6633.33] },
            { x: new Date(2024, 1, 2), y: [6632.01, 6643.59, 6620, 6630.11] },
            { x: new Date(2024, 1, 3), y: [6630.71, 6648.95, 6623.34, 6635.65] },
            { x: new Date(2024, 1, 4), y: [6635.65, 6651, 6629.67, 6638.24] },
          ],
        },
      ],
      options: {
        chart: {
          type: 'candlestick',
          toolbar: { show: false },
        },
      },
    },

    marketMetrics: {
      series: [
        {
          name: 'Metric',
          data: [45, 52, 38, 24, 33, 10],
        },
      ],
      options: {
        chart: {
          type: 'radar',
          toolbar: { show: false },
        },
        xaxis: {
          categories: ['Volatility', 'Volume', 'Liquidity', 'Market Cap', 'Supply', 'Demand'],
        },
      },
    },
  }

  const charts = ref([
    {
      title: 'Preço da Criptomoeda',
      type: 'line',
      data: { ...chartConfigs.currentPrice },
      change: '+5.23%',
    },
    {
      title: 'Volume em Tempo Real',
      type: 'area',
      data: { ...chartConfigs.tradingVolume },
      change: '-2.15%',
    },
    {
      title: ' Variação Percentual',
      type: 'candlestick',
      data: { ...chartConfigs.priceAction },
      change: '-0.92%',
    },
    {
      title: 'Histórico de Preços',
      type: 'line',
      data: { ...chartConfigs.priceHistory },
      change: '+5.23%',
    },
    {
      title: 'Comparação de Market Cap',
      type: 'slope-multi',
      data: { ...chartConfigs.dailyReturns },
      change: '+1.87%',
    },
    {
      title: 'Moedas com Maior Valorização',
      type: 'slope-basic',
      data: { ...chartConfigs.marketMetrics },
      change: '+3.45%',
    },
  ])

  const getCryptos = async () => {
    const cachedData = getCache(CACHE_KEYS.CRYPTOS)
    if (cachedData) {
      cryptos.value = cachedData
    }

    try {
      isLoading.value = true
      const apiService = new ApiService()
      const data = await apiService.getAll('coins/list')
      cryptos.value = data
      setCache(CACHE_KEYS.CRYPTOS, data)
    } catch (error) {
      console.error('Error fetching cryptos:', error)
      if (!cachedData) {
        alert('Erro ao carregar criptomoedas. Por favor, tente novamente mais tarde.')
      }
    } finally {
      isLoading.value = false
    }
  }

  const getCurrencies = async () => {
    const cachedData = getCache(CACHE_KEYS.CURRENCIES)
    if (cachedData) {
      currencies.value = cachedData
    }

    try {
      isLoading.value = true
      const apiService = new ApiService()
      const data = await apiService.getAll('simple/supported_vs_currencies')
      currencies.value = data
      setCache(CACHE_KEYS.CURRENCIES, data)
    } catch (error) {
      console.error('Error fetching currencies:', error)
      if (!cachedData) {
        alert('Erro ao carregar moedas. Por favor, tente novamente mais tarde.')
      }
    } finally {
      isLoading.value = false
    }
  }

  const getCurrentPrice = async () => {
    if (!selectedCrypto.value) return

    const cacheKey = `${CACHE_KEYS.CURRENT_PRICE}_${selectedCrypto.value}_${selectedCurrency.value}`
    const cachedData = getCache(cacheKey)

    if (cachedData) {
      updateCurrentPriceChart(cachedData.prices)
    }

    try {
      isLoading.value = true
      const apiService = new ApiService()
      const fromDate = Math.floor(Date.now() / 1000) - 24 * 60 * 60
      const toDate = Math.floor(Date.now() / 1000)

      // const endpoint = `coins/${selectedCrypto.value}/market_chart/range?vs_currency=${selectedCurrency.value}&from=${fromDate}&to=${toDate}`
      const endpoint = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1&interval=minutely`
      const data = await apiService.getAll(endpoint)

      if (data?.prices) {
        updateCurrentPriceChart(data.prices)
        setCache(cacheKey, data)
      }
    } catch (error) {
      console.error('Error fetching current price:', error)
      if (!cachedData) {
        alert('Erro ao carregar preço atual. Exibindo dados em cache.')
      }
    } finally {
      isLoading.value = false
    }
  }

  const updateCurrentPriceChart = (prices) => {
    const priceData = prices.map(([timestamp, price]) => ({
      x: timestamp,
      y: Number(price.toFixed(2)),
    }))

    const currentPriceChart = charts.value.find((chart) => chart.title === 'Preço da Criptomoeda')
    if (currentPriceChart) {
      currentPriceChart.data.series[0].data = priceData
      currentPriceChart.data.options.yaxis.title.text = `Preço (${selectedCurrency.value.toUpperCase()})`
    }
  }

  const getTradingVolume = async () => {
    if (!selectedCrypto.value) return

    const cacheKey = `${CACHE_KEYS.TRADING_VOLUME}_${selectedCrypto.value}_${selectedCurrency.value}`
    const cachedData = getCache(cacheKey)

    if (cachedData) {
      updateTradingVolumeChart(cachedData.tickers)
    }

    try {
      isLoading.value = true
      const apiService = new ApiService()
      const data = await apiService.getAll(
        `coins/ethereum/market_chart?vs_currency=usd&days=1&interval=minutely`,
      )

      if (data && data.tickers) {
        updateTradingVolumeChart(data.tickers)
        setCache(cacheKey, data)
      }
    } catch (error) {
      console.error('Error fetching trading volume:', error)
      if (!cachedData) {
        alert('Erro ao carregar volume de negociações. Exibindo dados em cache.')
      }
    } finally {
      isLoading.value = false
    }
  }

  const updateTradingVolumeChart = (tickers) => {
    const volumeData = tickers.map((ticker) => ({
      time: new Date(ticker.timestamp).getTime(),
      volume: ticker.volume,
    }))

    const volumeChart = charts.value.find((chart) => chart.title === 'Trading Volume')
    if (volumeChart) {
      volumeChart.data.series[0].data = volumeData.map((d) => d.volume)
      volumeChart.data.options.xaxis.categories = volumeData.map((d) =>
        new Date(d.time).toLocaleTimeString(),
      )
    }
  }

  const getPriceHistory = async () => {
    if (!selectedCrypto.value) return

    const cacheKey = `${CACHE_KEYS.PRICE_HISTORY}_${selectedCrypto.value}_${selectedCurrency.value}`
    const cachedData = getCache(cacheKey)

    if (cachedData) {
      updatePriceHistoryChart(cachedData.prices)
    }

    try {
      isLoading.value = true
      const apiService = new ApiService()
      const fromDate = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60
      const toDate = Math.floor(Date.now() / 1000)

      const endpoint = `coins/${selectedCrypto.value}/market_chart/range?vs_currency=${selectedCurrency.value}&from=${fromDate}&to=${toDate}`
      const data = await apiService.getAll(endpoint)

      if (data && data.prices) {
        updatePriceHistoryChart(data.prices)
        setCache(cacheKey, data)
      }
    } catch (error) {
      console.error('Error fetching price history:', error)
      if (!cachedData) {
        alert('Erro ao carregar histórico de preços. Exibindo dados em cache.')
      }
    } finally {
      isLoading.value = false
    }
  }

  const updatePriceHistoryChart = (prices) => {
    const priceData = prices.map(([timestamp, price]) => ({
      x: timestamp,
      y: Number(price.toFixed(0)),
    }))

    const priceHistoryChart = charts.value.find((chart) => chart.title === 'Histórico de Preços')
    if (priceHistoryChart) {
      priceHistoryChart.data.series[0].data = priceData
    }
  }

  const toggleFilters = () => {
    showFilters.value = !showFilters.value
  }

  const initializeData = async () => {
    await Promise.all([
      getCryptos(),
      getCurrencies(),
      getCurrentPrice(),
      getPriceHistory(),
      getTradingVolume(),
    ])
  }

  return {
    showFilters,
    selectedPeriod,
    selectedMetric,
    selectedCrypto,
    selectedCurrency,
    cryptos,
    currencies,
    charts,
    isLoading,
    getCryptos,
    getCurrencies,
    getPriceHistory,
    getCurrentPrice,
    getTradingVolume,
    initializeData,
    toggleFilters,
  }
})
