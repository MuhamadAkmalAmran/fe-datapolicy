<template>
  <div class="overflow-hidden w-full p-6 bg-white">
    <!-- Loading Indicator -->
    <div v-if="isLoading" class="fixed inset-0 z-50 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div class="bg-white rounded">
      <h1 class="text-2xl font-semibold mb-6">Visualisasi Data</h1>
      <!-- Form -->
      <form>
        <div class="grid gap-6 grid-cols-1 md:grid-cols-2 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select v-model="selectedCategory" class="select select-bordered w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option disabled>Pilih Kategori</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Wilayah</label>
            <select v-model="selectedCity" class="select select-bordered w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Semua Wilayah</option>
              <option v-for="city in cities" :key="city" :value="city">
                {{ city }}
              </option>
            </select>
          </div>
        </div>
      </form>
    </div>

    <!-- Charts Section -->
    <div class="mt-6">
      <div class="grid gap-6 grid-cols-1 md:grid-cols-2">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">{{ chartTitle }}</h2>
          <div class="border-t border-gray-200 my-4"></div>
          <BarChartComponent :chartData="chartData" :chartOptions="chartOptions" />
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">{{ chartTitle }}</h2>
          <div class="border-t border-gray-200 my-4"></div>
          <LineChartComponent :chartData="chartData" :chartOptions="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import BarChartComponent from "@/components/BarChart.vue"
import LineChartComponent from "@/components/LineChart.vue"

export default {
  components: {
    BarChartComponent,
    LineChartComponent
  },

  setup() {
    // Reactive state
    const selectedCategory = ref(null)
    const selectedCity = ref('')
    const rawData = ref([])
    const categories = ref([])
    const isLoading = ref(false)

    // Constants
    const cities = [
      "Kota Yogyakarta",
      "Kulon Progo",
      "Kota Bandung",
      "Kota Surabaya",
      "Banyuwangi"
    ]

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://api.datapolicy.jogjacode.id/api/categories')
        categories.value = response.data
        // Set default category if not set
        if (!selectedCategory.value && categories.value.length > 0) {
          selectedCategory.value = categories.value[0].id
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    // Fetch data
    const fetchData = async () => {
      isLoading.value = true
      if (!selectedCategory.value) return

      try {
        const params = { category_id: selectedCategory.value }
        if (selectedCity.value) params.city = selectedCity.value

        const response = await axios.get('https://api.datapolicy.jogjacode.id/api/data', { params })
        rawData.value = response.data
      } catch (error) {
        console.error('Error fetching data:', error)
        rawData.value = []
      } finally {
        isLoading.value = false
      }
    }

    // Computed properties
    const chartData = computed(() => {
      const labels = [...new Set(rawData.value.map((row) => row.year))].sort()
      const regionsToDisplay = selectedCity.value === ''
        ? cities
        : [selectedCity.value]

      const datasets = regionsToDisplay.map((city) => {
        const cityData = rawData.value.filter((row) => row.city === city)
        cityData.sort((a, b) => a.year - b.year)

        return {
          label: city,
          data: cityData.map((row) => row.amount),
          backgroundColor: getRegionColor(city),
          borderColor: getRegionColor(city, true),
          borderWidth: 1,
        }
      })

      return { labels, datasets }
    })

    const chartTitle = computed(() => {
      const categoryName = categories.value.find(c => c.id === selectedCategory.value)?.name || 'Data'
      const cityText = selectedCity.value || "Semua Wilayah"
      return `${categoryName} ${cityText}`
    })

    const chartOptions = computed(() => ({
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    }))

    // Helper method for colors
    const getRegionColor = (region, isBorder = false) => {
      const colors = {
        "Kota Yogyakarta": "rgba(54, 162, 235, 0.6)",
        "Kulon Progo": "rgba(255, 99, 132, 0.6)",
        "Kota Bandung": "rgba(75, 192, 192, 0.6)",
        "Kota Surabaya": "rgba(255, 0, 0, 0.6)",
        "Banyuwangi": "rgba(0, 0, 255, 0.6)",
      }

      const color = colors[region] || "rgba(201, 203, 207, 0.6)"
      return isBorder ? color.replace("0.6", "1") : color
    }

    // Watchers
    watch([selectedCategory, selectedCity], () => {
      fetchData()
    })

    // Lifecycle hooks
    onMounted(() => {
      fetchCategories()
    })

    return {
      // State
      selectedCategory,
      selectedCity,
      cities,
      categories,
      isLoading,
      // Computed
      chartData,
      chartOptions,
      chartTitle,
    }
  }
}
</script>
