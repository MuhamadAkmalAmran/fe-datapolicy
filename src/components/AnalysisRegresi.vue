<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-4">
        <h1 class="text-3xl font-bold text-gray-900">Analisis Regresi Data</h1>
        <p class="mt-2 text-gray-600">Analisis hubungan antar variabel menggunakan metode regresi statistik</p>
      </div>

      <!-- Loading Overlay -->
      <div v-if="isLoading" class="fixed inset-0 z-50 bg-gray-500/50 backdrop-blur-sm flex items-center justify-center">
        <div class="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
          <svg class="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-700 font-medium">Sedang memproses data...</p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 gap-6 w-full">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <!-- Parameter Analysis Header -->
          <div class="flex items-center space-x-2 mb-6">
            <svg class="w-5 h-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            <h2 class="text-xl font-semibold text-gray-900">Parameter Analisis</h2>
          </div>

          <!-- Form Controls -->
          <div class="space-y-6">
            <!-- Regression Type Toggle -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Regresi</label>
              <div class="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                <button @click="form.regressionType = 'linear'" :class="toggleButtonClass('linear')">Linear</button>
                <button @click="form.regressionType = 'non_linear'" :class="toggleButtonClass('non_linear')">Non-Linear</button>
              </div>
            </div>

            <!-- Region Dropdown -->
            <div class="relative" ref="regionDropdownRef">
              <label class="block text-sm font-medium text-gray-700 mb-2">Wilayah</label>
              <div class="relative">
                <input
                  type="text"
                  v-model="dropdowns.region.search"
                  @focus="openDropdown('region')"
                  placeholder="Pilih Wilayah"
                  class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                  v-if="dropdowns.region.search && form.selectedRegion"
                  type="button"
                  @click="clearSelection('region')"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div
                v-if="dropdowns.region.open"
                class="absolute w-full bg-white border border-gray-300 mt-1 max-h-40 overflow-y-auto rounded-md shadow-lg z-10"
              >
                <div
                  v-for="city in dropdowns.region.filtered"
                  :key="city"
                  @click="selectOption('region', city)"
                  class="px-3 py-2 cursor-pointer hover:bg-blue-100 text-sm"
                  :class="{ 'bg-blue-50': form.selectedRegion === city }"
                >
                  {{ city }}
                </div>
                <div v-if="dropdowns.region.filtered.length === 0" class="px-3 py-2 text-gray-500 text-sm">
                  Tidak ada wilayah ditemukan
                </div>
              </div>
            </div>

            <!-- Analysis Type Toggle -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Analisis</label>
              <div class="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                <button @click="form.analysisType = 'single'" :class="analysisToggleClass('single')">Single Variabel</button>
                <button @click="form.analysisType = 'multi'" :class="analysisToggleClass('multi')">Multi Variabel</button>
              </div>
            </div>

            <!-- Single Variable Analysis -->
            <template v-if="form.analysisType === 'single'">
              <div class="space-y-4">
                <!-- Independent Variable -->
                <div class="relative" ref="independentDropdownRef">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Variabel Independen (X)</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="dropdowns.independent.search"
                      @focus="openDropdown('independent')"
                      placeholder="Pilih Variabel"
                      class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      v-if="dropdowns.independent.search && form.selectedIndependentVar"
                      type="button"
                      @click="clearSelection('independent')"
                      class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>

                  <div
                    v-if="dropdowns.independent.open"
                    class="absolute w-full bg-white border border-gray-300 mt-1 max-h-40 overflow-y-auto rounded-md shadow-lg z-10"
                  >
                    <div
                      v-for="category in dropdowns.independent.filtered"
                      :key="category.id"
                      @click="selectCategory('independent', category)"
                      class="px-3 py-2 cursor-pointer hover:bg-blue-100 text-sm"
                      :class="{ 'bg-blue-50': form.selectedIndependentVar === category.name }"
                    >
                      {{ category.display_name || category.name }}
                    </div>
                    <div v-if="dropdowns.independent.filtered.length === 0" class="px-3 py-2 text-gray-500 text-sm">
                      Tidak ada kategori ditemukan
                    </div>
                  </div>
                </div>

                <!-- Dependent Variable -->
                <div class="relative" ref="dependentDropdownRef">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Variabel Dependen (Y)</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="dropdowns.dependent.search"
                      @focus="openDropdown('dependent')"
                      placeholder="Pilih Variabel"
                      class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      v-if="dropdowns.dependent.search && form.selectedDependentVar"
                      type="button"
                      @click="clearSelection('dependent')"
                      class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>

                  <div
                    v-if="dropdowns.dependent.open"
                    class="absolute w-full bg-white border border-gray-300 mt-1 max-h-40 overflow-y-auto rounded-md shadow-lg z-10"
                  >
                    <div
                      v-for="category in dropdowns.dependent.filtered"
                      :key="category.id"
                      @click="selectCategory('dependent', category)"
                      class="px-3 py-2 cursor-pointer hover:bg-blue-100 text-sm"
                      :class="{ 'bg-blue-50': form.selectedDependentVar === category.name }"
                    >
                      {{ category.display_name || category.name }}
                    </div>
                    <div v-if="dropdowns.dependent.filtered.length === 0" class="px-3 py-2 text-gray-500 text-sm">
                      Tidak ada kategori ditemukan
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- Multi Variable Analysis -->
            <template v-else>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Variabel (min. 2, terakhir adalah dependen)</label>
                <div class="space-y-2 max-h-60 overflow-y-auto rounded-lg border border-gray-200 p-2">
                  <label v-for="category in categories" :key="category.id" class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                    <input
                      type="checkbox"
                      :value="category.name"
                      v-model="form.selectedMultiVars"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="text-sm text-gray-700">{{ category.display_name || category.name }}</span>
                  </label>
                </div>
              </div>
            </template>

            <!-- Submit Button -->
            <button
              @click="performRegression"
              :disabled="!canAnalyze"
              :class="submitButtonClass"
            >
              Mulai Analisis
            </button>

            <div v-if="!canAnalyze" class="mt-2 flex items-center space-x-2 text-amber-600 text-sm">
              <span>Lengkapi semua parameter untuk memulai analisis</span>
            </div>
          </div>
        </div>

        <!-- Results Modal -->
        <div v-if="analysisResults" class="fixed inset-0 z-50 bg-gray-500/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div class="bg-white rounded-xl shadow-lg w-full max-w-6xl max-h-[95vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Hasil Analisis Regresi</h2>
                <p class="text-sm text-gray-600 mt-1">{{ analysisResults.city }} - {{ analysisResults.regression_type === 'linear' ? 'Linear' : 'Non-Linear' }}</p>
              </div>
              <button @click="closeResults" class="text-gray-500 hover:text-gray-700 p-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Results Content -->
            <div class="p-6 space-y-8">
              <!-- Summary -->
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <div class="flex items-center mb-4">
                  <div class="bg-blue-100 p-2 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-blue-900">Ringkasan Analisis</h3>
                </div>
                <div class="bg-white rounded-lg p-4 border border-blue-100">
                  <pre class="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">{{ analysisResults.summary }}</pre>
                </div>
              </div>

              <!-- Key Statistics Cards -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-6 rounded-xl">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="text-sm font-medium text-green-700">R-Squared</h4>
                    <div class="bg-green-100 p-1 rounded">
                      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                      </svg>
                    </div>
                  </div>
                  <p class="text-3xl font-bold text-green-800">{{ formatPercent(analysisResults.details.r_squared) }}</p>
                  <p class="text-xs text-green-600 mt-2">Variasi yang dapat dijelaskan oleh model</p>
                </div>

                <div v-if="analysisResults.details.f_pvalue !== undefined" class="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 p-6 rounded-xl">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="text-sm font-medium text-purple-700">P-value Model</h4>
                    <div class="bg-purple-100 p-1 rounded">
                      <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                  </div>
                  <p class="text-3xl font-bold text-purple-800">{{ analysisResults.details.f_pvalue.toFixed(4) }}</p>
                  <p class="text-xs text-purple-600 mt-2">{{ analysisResults.details.f_pvalue < 0.05 ? 'Model signifikan' : 'Model tidak signifikan' }}</p>
                </div>

                <div class="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-6 rounded-xl">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="text-sm font-medium text-amber-700">Jumlah Data</h4>
                    <div class="bg-amber-100 p-1 rounded">
                      <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                      </svg>
                    </div>
                  </div>
                  <p class="text-3xl font-bold text-amber-800">{{ analysisResults.details.data.years?.length || 'N/A' }}</p>
                  <p class="text-xs text-amber-600 mt-2">Tahun data yang dianalisis</p>
                </div>
              </div>

              <!-- Detailed Interpretation -->
              <div v-if="analysisResults.details.interpretation" class="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
                <div class="flex items-center mb-4">
                  <div class="bg-indigo-100 p-2 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-indigo-900">Interpretasi Detail</h3>
                </div>
                <div class="bg-white rounded-lg p-4 border border-indigo-100">
                  <pre class="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">{{ analysisResults.details.interpretation }}</pre>
                </div>
              </div>

              <!-- Correlation Matrix for Multi-Variable -->
              <div v-if="form.analysisType === 'multi' && analysisResults.details.correlations" class="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div class="flex items-center mb-4">
                  <div class="bg-gray-100 p-2 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900">Matrix Korelasi</h3>
                </div>
                <div class="overflow-x-auto">
                  <table class="min-w-full bg-white rounded-lg border border-gray-200">
                    <thead class="bg-gray-100">
                      <tr>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Variabel</th>
                        <th v-for="variable in Object.keys(analysisResults.details.correlations)" :key="variable" class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                          {{ getCategoryDisplayName(variable) }}
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr v-for="(row, rowVar) in analysisResults.details.correlations" :key="rowVar" class="hover:bg-gray-50">
                        <td class="px-4 py-2 text-sm font-medium text-gray-900">{{ getCategoryDisplayName(rowVar) }}</td>
                        <td v-for="(value, colVar) in row" :key="colVar" class="px-4 py-2 text-center text-sm" :class="getCorrelationColor(value)">
                          {{ typeof value === 'number' ? value.toFixed(3) : 'N/A' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Charts Section -->
              <div class="space-y-8">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="bg-blue-100 p-2 rounded-lg mr-3">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900">Visualisasi Data</h3>
                  </div>
                  <!-- Legend for multi-variable -->
                  <div v-if="form.analysisType === 'multi'" class="text-sm text-gray-600 space-x-4">
                    <span><span class="inline-block w-3 h-3 bg-green-500 rounded mr-1"></span>Diagonal: Distribusi</span>
                    <span><span class="inline-block w-3 h-3 bg-blue-500 rounded mr-1"></span>Bawah: Scatter</span>
                    <span><span class="inline-block w-3 h-3 bg-red-500 rounded mr-1"></span>Atas: Korelasi</span>
                  </div>
                </div>

                <!-- Single Variable Charts -->
                <template v-if="form.analysisType === 'single'">
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Scatter Plot with Regression Line -->
                    <div class="bg-white rounded-xl border border-gray-200 p-4">
                      <h4 class="text-lg font-semibold text-gray-800 mb-3 text-center">Hubungan Variabel & Garis Regresi</h4>
                      <div class="h-80">
                        <canvas id="varVarChart"></canvas>
                      </div>
                    </div>

                    <!-- Time Series Chart -->
                    <div class="bg-white rounded-xl border border-gray-200 p-4">
                      <h4 class="text-lg font-semibold text-gray-800 mb-3 text-center">Perkembangan Waktu</h4>
                      <div class="h-80">
                        <canvas id="timeSeriesChart"></canvas>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- Multi Variable Charts -->
                <template v-else>
                  <!-- Time Series for All Variables -->
                  <div class="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <h4 class="text-lg font-semibold text-gray-800 mb-3 text-center">Perkembangan Semua Variabel</h4>
                    <div class="h-96">
                      <canvas id="timeSeriesChart"></canvas>
                    </div>
                  </div>

                  <!-- ggpairs-style Matrix -->
                  <div class="bg-white rounded-xl border border-gray-200 p-6">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4 text-center">Matrix Analisis Hubungan (ggpairs style)</h4>
                    <div id="pairsMatrix" class="flex justify-center"></div>
                    <div class="mt-4 text-sm text-gray-600 space-y-1">
                      <p><strong>Cara Membaca:</strong></p>
                      <p>• <strong>Diagonal:</strong> Histogram distribusi masing-masing variabel</p>
                      <p>• <strong>Segitiga Bawah:</strong> Scatter plot hubungan antar variabel</p>
                      <p>• <strong>Segitiga Atas:</strong> Koefisien korelasi Pearson (hijau = positif, merah = negatif)</p>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick, onUnmounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import api from '@/api/api'

Chart.register(...registerables)

// Helper functions for ggpairs matrix
function pearsonCorrelation(x, y) {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;

  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / y.length;

  let numerator = 0, sumX = 0, sumY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    sumX += dx * dx;
    sumY += dy * dy;
  }

  return (sumX && sumY) ? numerator / Math.sqrt(sumX * sumY) : 0;
}

function createHistogram(values, bins = 10) {
  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0] || 0;
  const max = sorted[sorted.length - 1] || 1;
  const binWidth = (max - min) / bins || 1;

  const binCounts = Array(bins).fill(0);
  const binCenters = Array(bins).fill(0).map((_, i) => min + (i + 0.5) * binWidth);

  sorted.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
    binCounts[binIndex]++;
  });

  return { centers: binCenters, counts: binCounts };
}

// Custom Chart.js plugin for correlation text
const correlationTextPlugin = {
  id: 'correlationText',
  afterDraw(chart, args, options) {
    if (!options?.text) return;

    const { ctx, chartArea } = chart;
    const { left, top, right, bottom } = chartArea;

    ctx.save();
    ctx.fillStyle = options.color || '#374151';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText(options.text, (left + right) / 2, (top + bottom) / 2);
    ctx.restore();
  }
};

Chart.register(correlationTextPlugin);

export default {
  name: 'RegressionAnalysis',
  setup() {
    const isLoading = ref(false)
    const analysisResults = ref(null)
    const chartInstances = ref({})
    const categories = ref([])

    // Form data
    const form = ref({
      selectedRegion: '',
      regressionType: 'linear',
      analysisType: 'single',
      selectedIndependentVar: '',
      selectedDependentVar: '',
      selectedMultiVars: []
    })

    // Dropdown refs
    const regionDropdownRef = ref(null)
    const independentDropdownRef = ref(null)
    const dependentDropdownRef = ref(null)

    // Dropdowns state
    const dropdowns = ref({
      region: {
        open: false,
        search: '',
        filtered: []
      },
      independent: {
        open: false,
        search: '',
        filtered: []
      },
      dependent: {
        open: false,
        search: '',
        filtered: []
      }
    })

    // Constants
    const cities = [
      "Kota Yogyakarta",
      "Kulon Progo",
      "Kota Bandung",
      "Kota Surabaya",
      "Banyuwangi"
    ]

    // Computed
    const availableDependentVars = computed(() => {
      return categories.value.filter(cat => cat.name !== form.value.selectedIndependentVar)
    })

    const canAnalyze = computed(() => {
      if (!form.value.selectedRegion || !form.value.regressionType) return false
      if (form.value.analysisType === 'single') {
        return form.value.selectedIndependentVar && form.value.selectedDependentVar
      }
      return form.value.selectedMultiVars.length >= 2
    })

    const toggleButtonClass = computed(() => (type) => [
      'py-2 px-4 rounded-md text-sm font-medium transition-colors',
      form.value.regressionType === type
        ? 'bg-white text-blue-600 shadow-sm'
        : 'text-gray-600 hover:text-gray-900'
    ])

    const analysisToggleClass = computed(() => (type) => [
      'py-2 px-4 rounded-md text-sm font-medium transition-colors',
      form.value.analysisType === type
        ? 'bg-white text-blue-600 shadow-sm'
        : 'text-gray-600 hover:text-gray-900'
    ])

    const submitButtonClass = computed(() => [
      'w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
      canAnalyze.value
        ? 'bg-blue-600 hover:bg-blue-700'
        : 'bg-gray-400 cursor-not-allowed'
    ])

    // Methods
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories')
        categories.value = response.data
        updateDropdownFilters()
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    const updateDropdownFilters = () => {
      // Region filter
      const regionTerm = dropdowns.value.region.search.toLowerCase()
      dropdowns.value.region.filtered = cities.filter(city =>
        city.toLowerCase().includes(regionTerm)
      )

      // Independent variable filter
      const indepTerm = dropdowns.value.independent.search.toLowerCase()
      dropdowns.value.independent.filtered = categories.value.filter(cat =>
        (cat.display_name || cat.name).toLowerCase().includes(indepTerm)
      )

      // Dependent variable filter
      const depTerm = dropdowns.value.dependent.search.toLowerCase()
      dropdowns.value.dependent.filtered = availableDependentVars.value.filter(cat =>
        (cat.display_name || cat.name).toLowerCase().includes(depTerm)
      )
    }

    const openDropdown = (type) => {
      dropdowns.value[type].open = true
      updateDropdownFilters()
    }

    const closeDropdown = (type) => {
      dropdowns.value[type].open = false
    }

    const selectOption = (type, value) => {
      if (type === 'region') {
        form.value.selectedRegion = value
        dropdowns.value.region.search = value
      }
      closeDropdown(type)
    }

    const selectCategory = (type, category) => {
      if (type === 'independent') {
        form.value.selectedIndependentVar = category.name
        dropdowns.value.independent.search = category.display_name || category.name
      } else if (type === 'dependent') {
        form.value.selectedDependentVar = category.name
        dropdowns.value.dependent.search = category.display_name || category.name
      }
      closeDropdown(type)
    }

    const clearSelection = (type) => {
      if (type === 'region') {
        form.value.selectedRegion = ''
        dropdowns.value.region.search = ''
      } else if (type === 'independent') {
        form.value.selectedIndependentVar = ''
        dropdowns.value.independent.search = ''
      } else if (type === 'dependent') {
        form.value.selectedDependentVar = ''
        dropdowns.value.dependent.search = ''
      }
      updateDropdownFilters()
    }

    const handleClickOutside = (event) => {
      const dropdownRefs = [regionDropdownRef, independentDropdownRef, dependentDropdownRef]
      const dropdownTypes = ['region', 'independent', 'dependent']

      dropdownRefs.forEach((ref, index) => {
        if (ref.value && !ref.value.contains(event.target)) {
          closeDropdown(dropdownTypes[index])
        }
      })
    }

    const performRegression = async () => {
      isLoading.value = true
      destroyCharts()
      analysisResults.value = null

      try {
        const payload = {
          city: form.value.selectedRegion,
          regression_type: form.value.regressionType,
          analysis_type: form.value.analysisType,
        }

        if (form.value.analysisType === "single") {
          payload.independent_variable = form.value.selectedIndependentVar
          payload.dependent_variable = form.value.selectedDependentVar
        } else {
          payload.variables = form.value.selectedMultiVars
        }

        const response = await api.post("/analysis", payload)
        analysisResults.value = response.data

        await nextTick()
        renderCharts()
      } catch (error) {
        console.error("Regression analysis error:", error)
        const errorMessage = error.response?.data?.error || "Terjadi kesalahan saat melakukan analisis."
        alert(errorMessage)
      } finally {
        isLoading.value = false
      }
    }

    const closeResults = () => {
      analysisResults.value = null
      destroyCharts()
    }

    const formatPercent = (value) => {
      return (value * 100).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + '%'
    }

    const destroyCharts = () => {
      Object.values(chartInstances.value).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy()
        }
      })
      chartInstances.value = {}

      // Clear matrix container
      const container = document.getElementById('pairsMatrix')
      if (container) {
        container.innerHTML = ''
      }
    }

    const getCategoryDisplayName = (categoryName) => {
      if (analysisResults.value?.category_names?.[categoryName]) {
        return analysisResults.value.category_names[categoryName]
      }
      const category = categories.value.find(cat => cat.name === categoryName)
      return category ? (category.display_name || category.name) : categoryName
    }

    const getCorrelationColor = (value) => {
      if (typeof value !== 'number') return 'text-gray-500'
      const absValue = Math.abs(value)
      if (absValue >= 0.8) return 'text-red-600 font-bold bg-red-50'
      if (absValue >= 0.6) return 'text-orange-600 font-semibold bg-orange-50'
      if (absValue >= 0.4) return 'text-yellow-600 font-medium bg-yellow-50'
      if (absValue >= 0.2) return 'text-blue-600 bg-blue-50'
      return 'text-gray-600 bg-gray-50'
    }

    const renderCharts = () => {
      if (!analysisResults.value?.details?.data) {
        console.error("Invalid analysis results data")
        return
      }

      if (form.value.analysisType === "single") {
        renderSingleVariableCharts()
      } else {
        renderMultiVariableCharts()
      }
    }

    const renderSingleVariableCharts = () => {
      const data = analysisResults.value.details.data
      const independentVarName = analysisResults.value.variables_analyzed.independent[0]
      const dependentVarName = analysisResults.value.variables_analyzed.dependent

      if (!data?.independent_values?.[independentVarName] || !data?.dependent_values) {
        console.error("Data for single variable chart is invalid")
        return
      }

      const independentData = data.independent_values[independentVarName]

      // Enhanced Scatter Plot with Regression Line
      const varVarCtx = document.getElementById("varVarChart")
      if (varVarCtx) {
        chartInstances.value.varVar = new Chart(varVarCtx, {
          type: "scatter",
          data: {
            datasets: [
              {
                label: "Data Aktual",
                data: independentData.map((x, i) => ({ x, y: data.dependent_values[i] })),
                backgroundColor: "rgba(59, 130, 246, 0.6)",
                borderColor: "rgba(59, 130, 246, 0.8)",
                pointRadius: 6,
                pointHoverRadius: 8,
              },
              {
                label: "Garis Regresi",
                data: independentData.map((x, i) => ({ x, y: data.fitted_values[i] })),
                type: "line",
                borderColor: "rgba(239, 68, 68, 0.8)",
                backgroundColor: "transparent",
                pointRadius: 0,
                borderWidth: 3,
                tension: form.value.regressionType === "non_linear" ? 0.4 : 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: `${getCategoryDisplayName(independentVarName)} vs ${getCategoryDisplayName(dependentVarName)}`,
                font: { size: 14, weight: 'bold' }
              },
              legend: {
                position: "top",
                labels: { usePointStyle: true }
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: getCategoryDisplayName(independentVarName),
                  font: { size: 12, weight: 'bold' }
                }
              },
              y: {
                title: {
                  display: true,
                  text: getCategoryDisplayName(dependentVarName),
                  font: { size: 12, weight: 'bold' }
                }
              },
            },
          },
        })
      }

      // Enhanced Time Series Chart
      const timeSeriesCtx = document.getElementById("timeSeriesChart")
      if (timeSeriesCtx) {
        chartInstances.value.timeSeries = new Chart(timeSeriesCtx, {
          type: "line",
          data: {
            labels: data.years,
            datasets: [
              {
                label: getCategoryDisplayName(independentVarName),
                data: independentData,
                borderColor: "rgba(59, 130, 246, 0.8)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                yAxisID: "y1",
                tension: 0.3,
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true,
              },
              {
                label: getCategoryDisplayName(dependentVarName),
                data: data.dependent_values,
                borderColor: "rgba(239, 68, 68, 0.8)",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                yAxisID: "y2",
                tension: 0.3,
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
              title: {
                display: true,
                text: "Tren Perkembangan Variabel",
                font: { size: 14, weight: 'bold' }
              },
              legend: {
                position: 'top',
                labels: { usePointStyle: true }
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Tahun",
                  font: { size: 12, weight: 'bold' }
                }
              },
              y1: {
                type: "linear",
                display: true,
                position: "left",
                title: {
                  display: true,
                  text: getCategoryDisplayName(independentVarName),
                  font: { size: 11, weight: 'bold' }
                }
              },
              y2: {
                type: "linear",
                display: true,
                position: "right",
                title: {
                  display: true,
                  text: getCategoryDisplayName(dependentVarName),
                  font: { size: 11, weight: 'bold' }
                },
                grid: { drawOnChartArea: false }
              },
            },
          },
        })
      }
    }

    const renderMultiVariableCharts = () => {
      const data = analysisResults.value.details.data
      const independentVars = analysisResults.value.variables_analyzed.independent
      const dependentVarName = analysisResults.value.variables_analyzed.dependent

      if (!data?.independent_values || !data?.dependent_values) {
        console.error("Data for multi-variable chart is invalid")
        return
      }

      const allValues = {
        ...data.independent_values,
        [dependentVarName]: data.dependent_values,
      }

      const colors = [
        "rgba(59, 130, 246, 0.8)",   // blue
        "rgba(239, 68, 68, 0.8)",   // red
        "rgba(16, 185, 129, 0.8)",  // green
        "rgba(245, 158, 11, 0.8)",  // amber
        "rgba(139, 92, 246, 0.8)",  // violet
        "rgba(236, 72, 153, 0.8)",  // pink
        "rgba(20, 184, 166, 0.8)",  // teal
      ]

      // Enhanced Time Series Chart for all variables
      const timeSeriesCtx = document.getElementById("timeSeriesChart")
      if (timeSeriesCtx) {
        const timeSeriesDatasets = Object.entries(allValues).map(([varName, values], index) => ({
          label: getCategoryDisplayName(varName),
          data: values,
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length].replace('0.8', '0.1'),
          tension: 0.3,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: false,
        }))

        chartInstances.value.multiTimeSeries = new Chart(timeSeriesCtx, {
          type: "line",
          data: {
            labels: data.years,
            datasets: timeSeriesDatasets,
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
              title: {
                display: true,
                text: "Tren Perkembangan Semua Variabel",
                font: { size: 16, weight: 'bold' }
              },
              legend: {
                position: "top",
                labels: { usePointStyle: true }
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Tahun",
                  font: { size: 12, weight: 'bold' }
                }
              },
              y: {
                title: {
                  display: true,
                  text: "Nilai (Standardized)",
                  font: { size: 12, weight: 'bold' }
                }
              },
            },
          },
        })
      }

      // Create ggpairs-style matrix
      renderGGPairsMatrix(Object.keys(allValues), allValues)
    }

    const renderGGPairsMatrix = (selectedVars, variables) => {
      const container = document.getElementById('pairsMatrix')
      if (!container) return

      const n = selectedVars.length
      const cellSize = Math.max(150, Math.min(220, 1000 / n)) // Adaptive cell size

      // Create grid container
      const grid = document.createElement('div')
      grid.style.display = 'grid'
      grid.style.gridTemplateColumns = `repeat(${n}, ${cellSize}px)`
      grid.style.gap = '4px'
      grid.className = 'bg-gray-100 p-4 rounded-lg shadow-inner'

      const colors = [
        "rgba(59, 130, 246, 0.8)",   // blue
        "rgba(239, 68, 68, 0.8)",   // red
        "rgba(16, 185, 129, 0.8)",  // green
        "rgba(245, 158, 11, 0.8)",  // amber
        "rgba(139, 92, 246, 0.8)",  // violet
      ]

      for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
          const cell = document.createElement('div')
          cell.className = 'bg-white border border-gray-200 rounded-lg p-2 relative shadow-sm hover:shadow-md transition-shadow'
          cell.style.width = `${cellSize}px`
          cell.style.height = `${cellSize}px`

          // Add variable labels
          const label = document.createElement('div')
          label.className = 'absolute top-1 left-1 text-xs text-gray-600 font-medium z-10 bg-white bg-opacity-80 px-1 rounded'
          label.style.fontSize = `${Math.max(8, cellSize / 25)}px`

          const rowVar = selectedVars[row]
          const colVar = selectedVars[col]

          if (row === col) {
            label.textContent = getCategoryDisplayName(rowVar)
          } else {
            label.textContent = `${getCategoryDisplayName(colVar)} × ${getCategoryDisplayName(rowVar)}`
          }

          cell.appendChild(label)

          const canvas = document.createElement('canvas')
          canvas.width = cellSize - 16
          canvas.height = cellSize - 16
          canvas.style.width = '100%'
          canvas.style.height = '100%'
          cell.appendChild(canvas)

          const rowData = variables[rowVar]
          const colData = variables[colVar]

          if (row === col) {
            // Diagonal: histogram
            const hist = createHistogram(rowData, 8)
            const histChart = new Chart(canvas, {
              type: 'bar',
              data: {
                labels: hist.centers.map(c => c.toFixed(1)),
                datasets: [{
                  data: hist.counts,
                  backgroundColor: colors[row % colors.length].replace('0.8', '0.6'),
                  borderColor: colors[row % colors.length],
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: true,
                    grid: { display: true, color: 'rgba(0,0,0,0.1)' },
                    ticks: {
                      font: { size: Math.max(8, cellSize / 30) },
                      maxTicksLimit: 4,
                      color: '#6b7280'
                    }
                  },
                  y: {
                    display: true,
                    beginAtZero: true,
                    grid: { display: true, color: 'rgba(0,0,0,0.1)' },
                    ticks: {
                      font: { size: Math.max(8, cellSize / 30) },
                      maxTicksLimit: 4,
                      color: '#6b7280'
                    }
                  }
                },
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    enabled: true,
                    callbacks: {
                      title: () => `Distribusi ${getCategoryDisplayName(rowVar)}`,
                      label: (context) => `Nilai: ${context.label}, Frekuensi: ${context.parsed.y}`
                    }
                  }
                }
              }
            })
            chartInstances.value[`matrix_${row}_${col}`] = histChart

          } else if (row > col) {
            // Lower triangle: scatter plot
            const scatterData = colData.map((x, i) => ({ x, y: rowData[i] }))
            const scatterChart = new Chart(canvas, {
              type: 'scatter',
              data: {
                datasets: [{
                  data: scatterData,
                  backgroundColor: colors[col % colors.length].replace('0.8', '0.6'),
                  borderColor: colors[col % colors.length],
                  pointRadius: Math.max(2, cellSize / 60),
                  pointHoverRadius: Math.max(4, cellSize / 40)
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: true,
                    grid: { display: true, color: 'rgba(0,0,0,0.1)' },
                    ticks: {
                      font: { size: Math.max(8, cellSize / 30) },
                      maxTicksLimit: 4,
                      color: '#6b7280'
                    },
                    title: {
                      display: cellSize > 180,
                      text: getCategoryDisplayName(colVar),
                      font: { size: Math.max(8, cellSize / 35), weight: 'bold' },
                      color: '#374151'
                    }
                  },
                  y: {
                    display: true,
                    grid: { display: true, color: 'rgba(0,0,0,0.1)' },
                    ticks: {
                      font: { size: Math.max(8, cellSize / 30) },
                      maxTicksLimit: 4,
                      color: '#6b7280'
                    },
                    title: {
                      display: cellSize > 180,
                      text: getCategoryDisplayName(rowVar),
                      font: { size: Math.max(8, cellSize / 35), weight: 'bold' },
                      color: '#374151'
                    }
                  }
                },
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    enabled: true,
                    callbacks: {
                      title: () => `${getCategoryDisplayName(colVar)} vs ${getCategoryDisplayName(rowVar)}`,
                      label: (context) => `X: ${context.parsed.x.toFixed(2)}, Y: ${context.parsed.y.toFixed(2)}`
                    }
                  }
                }
              }
            })
            chartInstances.value[`matrix_${row}_${col}`] = scatterChart

          } else {
            // Upper triangle: correlation coefficient
            const correlation = pearsonCorrelation(colData, rowData)

            // Create a minimal scatter for background grid
            const minX = Math.min(...colData)
            const maxX = Math.max(...colData)
            const minY = Math.min(...rowData)
            const maxY = Math.max(...rowData)

            const corrChart = new Chart(canvas, {
              type: 'scatter',
              data: {
                datasets: [{
                  data: [
                    { x: minX, y: minY },
                    { x: maxX, y: maxY }
                  ],
                  pointRadius: 0,
                  showLine: false
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: true,
                    grid: { display: true, color: 'rgba(0,0,0,0.05)' },
                    ticks: {
                      font: { size: Math.max(8, cellSize / 35) },
                      maxTicksLimit: 3,
                      color: '#9ca3af',
                      callback: function(value) {
                        return value.toFixed(0)
                      }
                    }
                  },
                  y: {
                    display: true,
                    grid: { display: true, color: 'rgba(0,0,0,0.05)' },
                    ticks: {
                      font: { size: Math.max(8, cellSize / 35) },
                      maxTicksLimit: 3,
                      color: '#9ca3af',
                      callback: function(value) {
                        return value.toFixed(0)
                      }
                    }
                  }
                },
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    enabled: true,
                    callbacks: {
                      title: () => `Korelasi: ${getCategoryDisplayName(colVar)} vs ${getCategoryDisplayName(rowVar)}`,
                      label: () => `r = ${correlation.toFixed(3)} (${Math.abs(correlation) > 0.7 ? 'Kuat' : Math.abs(correlation) > 0.5 ? 'Sedang' : 'Lemah'})`
                    }
                  },
                  correlationText: {
                    text: `r = ${correlation.toFixed(3)}`,
                    color: correlation > 0 ? '#16a34a' : '#dc2626'
                  }
                }
              }
            })
            chartInstances.value[`matrix_${row}_${col}`] = corrChart
          }

          grid.appendChild(cell)
        }
      }

      container.appendChild(grid)
    }

    // Watchers
    watch([() => form.value.analysisType, () => form.value.regressionType], () => {
      form.value.selectedIndependentVar = ''
      form.value.selectedDependentVar = ''
      form.value.selectedMultiVars = []
      analysisResults.value = null
      destroyCharts()

      // Clear dropdown searches
      dropdowns.value.independent.search = ''
      dropdowns.value.dependent.search = ''
    })

    watch(() => dropdowns.value.region.search, updateDropdownFilters)
    watch(() => dropdowns.value.independent.search, updateDropdownFilters)
    watch(() => dropdowns.value.dependent.search, updateDropdownFilters)

    // Lifecycle
    onMounted(() => {
      fetchCategories()
      updateDropdownFilters()
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      destroyCharts()
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      isLoading,
      analysisResults,
      form,
      dropdowns,
      categories,
      regionDropdownRef,
      independentDropdownRef,
      dependentDropdownRef,
      canAnalyze,
      toggleButtonClass,
      analysisToggleClass,
      submitButtonClass,
      openDropdown,
      closeDropdown,
      selectOption,
      selectCategory,
      clearSelection,
      performRegression,
      closeResults,
      formatPercent,
      getCategoryDisplayName,
      getCorrelationColor
    }
  }
}
</script>
