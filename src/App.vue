<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ApiService from '@/services/api.services'

onMounted(async () => {
  await getCryptos()
})

const cryptos = ref<any>([])

const showFilters = ref(false)
const selectedPeriod = ref('7d')
const selectedMetric = ref('price')
const selectedCrypto = ref('')

const headerHeight = computed(() => {
  return showFilters.value ? 'h-[160px]' : 'h-16'
})

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const getCryptos = async () => {
  try {
    const apiService = new ApiService()
    cryptos.value = await apiService.getAll(`list`)
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

import VueApexCharts from 'vue3-apexcharts'

// Dados de exemplo
const lineChartData = {
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
    stroke: {
      curve: 'smooth',
    },
    colors: ['#4f46e5'],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    },
  },
}

const areaChartData = {
  series: [
    {
      name: 'Volume',
      data: [44, 55, 41, 67, 22, 43, 21],
    },
  ],
  options: {
    chart: {
      type: 'area',
      toolbar: { show: false },
    },
    colors: ['#06b6d4'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
  },
}

const barChartData = {
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

const donutChartData = {
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

const candlestickData = {
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

const radarChartData = {
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

const charts = [
  { title: 'Price Trend', type: 'line', data: lineChartData, change: '+5.23%' },
  { title: 'Trading Volume', type: 'area', data: areaChartData, change: '-2.15%' },
  { title: 'Daily Returns', type: 'bar', data: barChartData, change: '+1.87%' },
  { title: 'Market Distribution', type: 'donut', data: donutChartData, change: '+0.54%' },
  { title: 'Price Action', type: 'candlestick', data: candlestickData, change: '-0.92%' },
  { title: 'Market Metrics', type: 'radar', data: radarChartData, change: '+3.45%' },
]
</script>
<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header Fixo -->
    <header class="bg-white shadow fixed top-0 left-0 right-0 z-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header Main Row -->
        <div class="flex h-16 justify-between items-center">
          <!-- Logo -->
          <div class="flex lg:flex-1">
            <a href="#" class="-m-1.5 p-1.5">
              <span>Cripto Monitor</span>
              <!-- <img class="h-8 w-auto" src="@/assets/logo.svg" alt="" /> -->
            </a>
          </div>

          <!-- Filter Button -->
          <div class="flex items-center gap-4">
            <button
              @click="toggleFilters"
              class="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.487A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
            </button>
          </div>
        </div>

        <!-- Expandable Filter Section -->
        <div v-show="showFilters" class="py-4 border-t border-gray-200 transition-all duration-300">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <!-- Period Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Período</label>
              <select
                v-model="selectedPeriod"
                class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>

            <!-- Metric Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Moeda de Cotação</label>
              <select
                v-model="selectedMetric"
                class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="price">Price</option>
                <option value="volume">Volume</option>
                <option value="marketCap">Market Cap</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Nome da Criptomoeda</label>
              <select
                v-model="selectedCrypto"
                class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option v-for="crypto in cryptos" :key="crypto.id" :value="crypto.id">
                  {{ crypto.name }}
                </option>
              </select>
            </div>

            <!-- Apply Button -->
            <div>
              <button
                class="w-full rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Spacer para compensar o header fixo -->
    <div :class="['h-16', showFilters ? 'md:h-40' : '']"></div>

    <!-- Main Content Scrollável -->
    <main class="flex-1 w-full py-8 overflow-auto bg-gray-50">
      <div class="px-4 sm:px-6 lg:px-8 mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
          <!-- Chart Cards -->
          <div
            v-for="(chart, i) in charts"
            :key="i"
            class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div class="p-4 h-full flex flex-col">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900">{{ chart.title }}</h3>
                <button class="text-gray-400 hover:text-gray-500">
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"
                    />
                  </svg>
                </button>
              </div>

              <!-- Chart -->
              <div class="flex-1 min-h-[300px]">
                <apexchart
                  :type="chart.data.options.chart.type"
                  :options="chart.data.options"
                  :series="chart.data.series"
                  height="100%"
                />
              </div>

              <!-- Chart metadata -->
              <div class="mt-4">
                <div class="flex justify-between text-sm text-gray-500">
                  <span>Updated 5m ago</span>
                  <span
                    :class="{
                      'text-green-500': chart.change.startsWith('+'),
                      'text-red-500': chart.change.startsWith('-'),
                    }"
                  >
                    24h Change: {{ chart.change }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<!-- <div class="min-h-screen flex flex-col">
    <header class="bg-white-600 text-white p-4 flex items-center justify-between">
      <div class="flex items-center">
        <img alt="Vue logo" class="h-12 w-12" src="@/assets/logo.svg" />
        <h1 class="text-2xl ml-4">Crypto Dashboard</h1>
      </div>

      <div class="flex items-center space-x-4">
        <input
          type="text"
          class="px-3 py-2 border rounded-md"
          placeholder="Search..."
          @input="handleFilterChange"
        />
        <nav class="hidden md:flex space-x-4">
          <RouterLink to="/" class="hover:underline">Home</RouterLink>
          <RouterLink to="/about" class="hover:underline">About</RouterLink>
        </nav>
      </div>
    </header>

    <main class="flex-1 p-6 bg-gray-100">
      <RouterView />
    </main>

    <footer class="bg-gray-800 text-white p-4 text-center">&copy; 2024 Crypto Dashboard</footer>
  </div> -->
