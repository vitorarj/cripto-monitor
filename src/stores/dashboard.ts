import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import ApiService from '@/services/api.services'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const showFilters = ref(false)
  const selectedPeriod = ref('7d')
  const selectedMetric = ref('price')
  const selectedCrypto = ref('01coin')
  const selectedCurrency = ref('usd')
  const cryptos = ref([])
  const currencies = ref([])
  const tradingVolumeData = ref([])
  const isLoading = ref(false)

  // Fetch functions
  const getCryptos = async () => {
    try {
      isLoading.value = true
      const apiService = new ApiService()
      cryptos.value = await apiService.getAll(`coins/list`)
    } catch (error) {
      console.error('Error fetching cryptos:', error)
    } finally {
      isLoading.value = false
    }
  }

  const getCurrencies = async () => {
    try {
      isLoading.value = true
      const apiService = new ApiService()
      currencies.value = await apiService.getAll(`simple/supported_vs_currencies`)
    } catch (error) {
      console.error('Error fetching currencies:', error)
    } finally {
      isLoading.value = false
    }
  }

  const getTradingVolume = async () => {
    if (!selectedCrypto.value) return

    try {
      isLoading.value = true
      const apiService = new ApiService()
      const data = await apiService.getAll(`coins/${selectedCrypto.value}/tickers`)
      updateTradingVolumeData(data.tickers)
    } catch (error) {
      console.error('Error fetching trading volume:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Initialize function
  const initializeData = async () => {
    await Promise.all([getCryptos(), getCurrencies(), getTradingVolume()])
  }

  // Chart configurations
  const charts = ref([
    { title: 'Preço da Criptomoeda', type: 'line', data: getLineChartData(), change: '+5.23%' },
    { title: 'Trading Volume', type: 'area', data: getAreaChartData(), change: '-2.15%' },
    { title: 'Daily Returns', type: 'bar', data: getBarChartData(), change: '+1.87%' },
    { title: 'Market Distribution', type: 'donut', data: getDonutChartData(), change: '+0.54%' },
    { title: 'Price Action', type: 'candlestick', data: getCandlestickData(), change: '-0.92%' },
    { title: 'Market Metrics', type: 'radar', data: getRadarChartData(), change: '+3.45%' },
  ])

  // Actions
  const toggleFilters = () => {
    showFilters.value = !showFilters.value
  }

  const updateTradingVolumeData = (tickers: any[]) => {
    tradingVolumeData.value = tickers.map((ticker: any) => ({
      time: ticker.timestamp,
      volume: ticker.volume,
    }))
    updateChartData()
  }

  const updateChartData = () => {
    // Atualiza charts com os novos dados
    const volumeChart = charts.value.find((chart) => chart.title === 'Trading Volume')
    if (volumeChart) {
      volumeChart.data.series[0].data = tradingVolumeData.value.map((d) => d.volume)
      volumeChart.data.options.xaxis.categories = tradingVolumeData.value.map((d) =>
        new Date(d.time * 1000).toLocaleTimeString(),
      )
    }
  }

  const applyFilters = async () => {
    await getTradingVolume()
    // Implement additional filter application logic here
  }

  return {
    // State
    showFilters,
    selectedPeriod,
    selectedMetric,
    selectedCrypto,
    selectedCurrency,
    cryptos,
    currencies,
    charts,
    isLoading,

    // Actions
    toggleFilters,
    updateTradingVolumeData,
    applyFilters,
    initializeData,
    getCryptos,
    getCurrencies,
    getTradingVolume,
  }
})

// Chart data configuration functions
function getLineChartData() {
  return {
    series: [
      {
        name: 'Price',
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
    options: {
      chart: {
        type: 'line',
        toolbar: { show: false },
      },
      stroke: { curve: 'smooth' },
      colors: ['#4f46e5'],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      },
    },
  }
}

function getAreaChartData() {
  return {
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
  }
}

function getBarChartData() {
  return {
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
  }
}

function getDonutChartData() {
  return {
    series: [44, 55, 13, 33],
    options: {
      chart: {
        type: 'donut',
        toolbar: { show: false },
      },
      labels: ['BTC', 'ETH', 'XRP', 'Others'],
      colors: ['#f59e0b', '#3b82f6', '#ec4899', '#6366f1'],
    },
  }
}

function getCandlestickData() {
  return {
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
  }
}

function getRadarChartData() {
  return {
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
  }
}
