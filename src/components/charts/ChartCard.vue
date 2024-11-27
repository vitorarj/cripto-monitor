<script setup lang="ts">
import { defineProps } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  change: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
    <div class="p-4 h-full flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <button class="text-gray-400 hover:text-gray-500">
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"
            />
          </svg>
        </button>
      </div>

      <div class="flex-1 min-h-[300px]">
        <apexchart
          :type="data.options.chart.type"
          :options="data.options"
          :series="data.series"
          height="100%"
        />
      </div>

      <div class="mt-4">
        <div class="flex justify-between text-sm text-gray-500">
          <span>Updated 5m ago</span>
          <span
            :class="{
              'text-green-500': change.startsWith('+'),
              'text-red-500': change.startsWith('-'),
            }"
          >
            24h Change: {{ change }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
