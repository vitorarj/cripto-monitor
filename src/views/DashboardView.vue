<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ApiService from '@/services/api.services'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import ChartCard from '@/components/charts/ChartCard.vue'
import { useDashboardStore } from '@/stores/dashboard'

const store = useDashboardStore()
const { charts, selectedPeriod, selectedCrypto, selectedCurrency } = store

onMounted(async () => {
  await getCryptos()
  await getCurrencies()
  await getTradingVolume()
})

const getCryptos = async () => {
  try {
    const apiService = new ApiService()
    store.cryptos = await apiService.getAll(`coins/list`)
  } catch (error) {
    console.error('Error fetching cryptos:', error)
  }
}

const getCurrencies = async () => {
  try {
    const apiService = new ApiService()
    store.currencies = await apiService.getAll(`simple/supported_vs_currencies`)
  } catch (error) {
    console.error('Error fetching currencies:', error)
  }
}

const getTradingVolume = async () => {
  if (!selectedCrypto.value) return

  try {
    const apiService = new ApiService()
    const data = await apiService.getAll(`coins/${selectedCrypto.value}/tickers`)
    store.updateTradingVolumeData(data.tickers)
  } catch (error) {
    console.error('Error fetching trading volume:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <DashboardHeader />

    <!-- Main Content -->
    <main class="flex-1 w-full py-8 overflow-auto bg-gray-50">
      <div class="px-4 sm:px-6 lg:px-8 mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
          <ChartCard
            v-for="(chart, i) in charts"
            :key="i"
            :title="chart.title"
            :type="chart.type"
            :data="chart.data"
            :change="chart.change"
          />
        </div>
      </div>
    </main>
  </div>
</template>
