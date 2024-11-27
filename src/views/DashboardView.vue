<script setup lang="ts">
import { onMounted, watch } from 'vue'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import ChartCard from '@/components/charts/ChartCard.vue'
import { useDashboardStore } from '@/stores/dashboard'

const store = useDashboardStore()

onMounted(() => {
  store.initializeData()
})

// Watch for changes in crypto or currency selection
watch([() => store.selectedCrypto.value, () => store.selectedCurrency.value], () => {
  store.getPriceHistory()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <DashboardHeader />
    <main class="flex-1 w-full py-8 overflow-auto bg-gray-50">
      <div class="px-4 sm:px-6 lg:px-8 mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
          <ChartCard
            v-for="(chart, i) in store.charts"
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
