<template>
  <div class="overflow-hidden w-full p-6 bg-white">
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 z-50 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div class="bg-white rounded">
      <h1 class="text-2xl font-semibold mb-6">Visualisasi Data</h1>

      <!-- Filters -->
      <form class="grid gap-6 grid-cols-1 md:grid-cols-2 mb-6">
        <!-- Kategori dengan Search -->
        <div class="relative" ref="categoryDropdownRef">
          <label class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
          <div class="relative">
            <input type="text" v-model="filters.categorySearch" @focus="openCategoryDropdown"
              placeholder="Pilih Kategori"
              class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500" />
            <!-- Clear button -->
            <button v-if="filters.categorySearch && filters.selectedCategory" type="button" @click="clearCategory"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <!-- Category Dropdown -->
          <div v-if="categoryDropdown.open"
            class="absolute w-full bg-white border border-gray-300 mt-1 max-h-72 overflow-y-auto rounded-md shadow-lg z-10">
            <div v-for="category in categoryDropdown.filtered" :key="category.id" @click="selectCategory(category)"
              class="px-3 py-2 cursor-pointer hover:bg-blue-100 text-sm"
              :class="{ 'bg-blue-50': filters.selectedCategory === category.id }">
              {{ category.name }}
            </div>
            <div v-if="categoryDropdown.filtered.length === 0" class="px-3 py-2 text-gray-500 text-sm">
              Tidak ada kategori ditemukan
            </div>
          </div>
        </div>

        <!-- Wilayah -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Wilayah</label>
          <select v-model="filters.selectedCity"
            class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Semua Wilayah</option>
            <option v-for="city in cities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </div>
      </form>
    </div>

    <!-- Charts -->
    <div class="mt-6 grid gap-6 grid-cols-1 md:grid-cols-2">
      <ChartCard :title="chartTitle">
        <BarChartComponent :chartData="chartData" :chartOptions="chartOptions" />
      </ChartCard>
      <ChartCard :title="chartTitle">
        <LineChartComponent :chartData="chartData" :chartOptions="chartOptions" />
      </ChartCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { getCategories, getData } from "@/api/api";
import { CITIES, REGION_COLORS } from "@/constants/index";
import BarChartComponent from "@/components/BarChart.vue";
import LineChartComponent from "@/components/LineChart.vue";
import ChartCard from "@/components/ChartCard.vue";

// State
const isLoading = ref(false);
const categoryDropdownRef = ref(null);

// Data
const rawData = ref([]);
const categories = ref([]);

// Filters
const filters = ref({
  selectedCategory: null,
  selectedCity: '',
  categorySearch: ''
});

// Category Dropdown
const categoryDropdown = ref({
  open: false,
  filtered: []
});

// Constants
const cities = CITIES;

// Computed
const filteredCategories = computed(() => {
  if (!filters.value.categorySearch) {
    return categories.value;
  }
  const term = filters.value.categorySearch.toLowerCase();
  return categories.value.filter(cat =>
    cat.name.toLowerCase().includes(term)
  );
});

const chartTitle = computed(() => {
  const categoryName = categories.value.find(c => c.id === filters.value.selectedCategory)?.name || 'Data';
  const cityText = filters.value.selectedCity || "Semua Wilayah";
  return `${categoryName} di ${cityText}`;
});

const chartData = computed(() => {
  const labels = [...new Set(rawData.value.map(row => row.year))].sort();
  const regionsToDisplay = filters.value.selectedCity ? [filters.value.selectedCity] : cities;

  const datasets = regionsToDisplay.map(city => {
    const cityData = rawData.value
      .filter(row => row.city === city)
      .sort((a, b) => a.year - b.year);

    const color = getRegionColor(city);

    return {
      label: city,
      data: labels.map(year => cityData.find(d => d.year === year)?.amount ?? null),
      backgroundColor: color,
      borderColor: color.replace("0.6", "1"),
      borderWidth: 1,
    };
  });

  return { labels, datasets };
});

const chartOptions = computed(() => ({
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}));

// Methods
const fetchCategories = async () => {
  try {
    const response = await getCategories();
    categories.value = response.data;
    categoryDropdown.value.filtered = response.data;

    // Auto select first category if none selected
    if (!filters.value.selectedCategory && categories.value.length > 0) {
      const firstCategory = categories.value[0];
      selectCategory(firstCategory);
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const fetchData = async () => {
  if (!filters.value.selectedCategory) return;

  isLoading.value = true;
  try {
    const params = { category_id: filters.value.selectedCategory };
    if (filters.value.selectedCity) {
      params.city = filters.value.selectedCity;
    }

    const response = await getData(params);
    rawData.value = response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    rawData.value = [];
  } finally {
    isLoading.value = false;
  }
};

const filterCategories = () => {
  categoryDropdown.value.filtered = filteredCategories.value;
};

const selectCategory = (category) => {
  filters.value.selectedCategory = category.id;
  filters.value.categorySearch = category.name;
  closeCategoryDropdown();
};

const clearCategory = () => {
  filters.value.selectedCategory = null;
  filters.value.categorySearch = '';
  categoryDropdown.value.filtered = categories.value;
};

const openCategoryDropdown = () => {
  categoryDropdown.value.open = true;
  filterCategories();
};

const closeCategoryDropdown = () => {
  categoryDropdown.value.open = false;
};

const handleClickOutside = (event) => {
  if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(event.target)) {
    closeCategoryDropdown();
  }
};

const getRegionColor = (region) => {
  return REGION_COLORS[region] || REGION_COLORS.default;
};

// Watchers
watch([() => filters.value.selectedCategory, () => filters.value.selectedCity], fetchData);
watch(() => filters.value.categorySearch, filterCategories);

// Lifecycle
onMounted(() => {
  fetchCategories();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
