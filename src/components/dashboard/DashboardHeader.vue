<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/dashboard'

const store = useDashboardStore()
const { showFilters, cryptos, currencies, selectedPeriod, selectedCurrency, selectedCrypto } =
  storeToRefs(store)

const headerHeight = computed(() => {
  return showFilters.value ? 'h-[160px]' : 'h-16'
})

const toggleFilters = () => {
  store.toggleFilters()
}
</script>

<template>
  <header class="bg-white shadow fixed top-0 left-0 right-0 z-50">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Main Row -->
      <div class="flex h-16 justify-between items-center">
        <div class="flex lg:flex-1">
          <a href="#" class="-m-1.5 p-1.5">
            <span>Cripto Monitor</span>
          </a>
        </div>

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
            {{ showFilters ? 'Ocultar Filtros' : 'Exibir Filtros' }}
          </button>
        </div>
      </div>

      <!-- Filters Section -->
      <div v-show="showFilters" class="py-4 border-t border-gray-200 transition-all duration-300">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700">Período</label>
            <select
              v-model="selectedPeriod"
              class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="24h">Ultimas 24 horas</option>
              <option value="7d">Ultimos 7 dias</option>
              <option value="30d">Ultimos 30 dias</option>
              <option value="90d">Ultimos 90 dias</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Moeda de Cotação</label>
            <select
              v-model="selectedCurrency"
              class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option v-for="item in currencies" :key="item" :value="item">
                {{ item.toUpperCase() }}
              </option>
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

          <div>
            <button
              @click="store.applyFilters()"
              class="w-full rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Spacer for fixed header -->
  <div :class="[headerHeight]"></div>
</template>
