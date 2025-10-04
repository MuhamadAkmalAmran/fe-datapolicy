import { ref, computed, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import api from '@/api/api'

Chart.register(...registerables)

// Constants
export const CITIES = [
  "Kota Yogyakarta",
  "Kulon Progo",
  "Kota Bandung",
  "Kota Surabaya",
  "Banyuwangi"
]

export const CHART_COLORS = [
  "rgba(59, 130, 246, 0.8)",   // blue
  "rgba(239, 68, 68, 0.8)",   // red
  "rgba(16, 185, 129, 0.8)",  // green
  "rgba(245, 158, 11, 0.8)",  // amber
  "rgba(139, 92, 246, 0.8)",  // violet
  "rgba(236, 72, 153, 0.8)",  // pink
  "rgba(20, 184, 166, 0.8)",  // teal
]

export function useRegressionAnalysis() {
  const isLoading = ref(false)
  const analysisResults = ref(null)
  const chartInstances = ref({})
  const categories = ref([])

  // Form data
  const form = ref({
    selectedRegions: [],
    regressionType: 'linear',
    selectedIndependentVars: [],
    selectedDependentVar: ''
  })

  // Computed
  const availableIndependentVars = computed(() => {
    if (!Array.isArray(categories.value)) return []
    return categories.value.filter(cat => cat && cat.name !== form.value.selectedDependentVar)
  })

  const availableDependentVars = computed(() => {
    if (!Array.isArray(categories.value)) return []
    return categories.value.filter(cat => cat && !form.value.selectedIndependentVars.includes(cat.name))
  })

  const currentAnalysisType = computed(() => {
    return form.value.selectedIndependentVars.length === 1 ? 'Single Variable' : 'Multi Variable'
  })

  const canAnalyze = computed(() => {
    return form.value.selectedRegions.length >= 1 &&
      form.value.regressionType &&
      form.value.selectedIndependentVars.length >= 1 &&
      form.value.selectedDependentVar
  })

  const validationMessage = computed(() => {
    if (form.value.selectedRegions.length < 1) {
      return 'Pilih minimal 1 wilayah untuk analisis'
    }
    if (form.value.selectedIndependentVars.length === 0) {
      return 'Pilih minimal 1 variabel independen'
    }
    if (!form.value.selectedDependentVar) {
      return 'Pilih variabel dependen'
    }
    return 'Lengkapi semua parameter untuk memulai analisis'
  })

  // Methods
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      categories.value = Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const performRegression = async () => {
    isLoading.value = true
    destroyCharts()
    analysisResults.value = null

    try {
      const payload = {
        regression_type: form.value.regressionType,
        analysis_type: currentAnalysisType.value === 'Single Variable' ? 'single' : 'multi',
        cities: form.value.selectedRegions
      }

      if (currentAnalysisType.value === 'Single Variable') {
        payload.independent_variable = form.value.selectedIndependentVars[0]
        payload.dependent_variable = form.value.selectedDependentVar
      } else {
        payload.variables = [...form.value.selectedIndependentVars, form.value.selectedDependentVar]
      }

      const response = await api.post("/analysis", payload)
      analysisResults.value = response.data

      await nextTick()
      // renderCharts() will be called from the main component
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

  const destroyCharts = () => {
    Object.values(chartInstances.value).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy()
      }
    })
    chartInstances.value = {}

    // Clear containers
    const containers = ['pairsMatrix', 'regionStatistics']
    containers.forEach(id => {
      const container = document.getElementById(id)
      if (container) {
        container.innerHTML = ''
      }
    })
  }

  const getCategoryDisplayName = (categoryName) => {
    if (analysisResults.value?.category_names?.[categoryName]) {
      return analysisResults.value.category_names[categoryName]
    }
    const category = categories.value.find(cat => cat.name === categoryName)
    return category ? (category.display_name || category.name) : categoryName
  }

  const formatPercent = (value) => {
    return (value * 100).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + '%'
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

  // renderCharts will be implemented in the main component

  // Chart rendering functions (will be implemented)
  // Chart rendering functions will be implemented in the main component
  // or moved to separate chart utilities

  return {
    // State
    isLoading,
    analysisResults,
    chartInstances,
    categories,
    form,

    // Computed
    availableIndependentVars,
    availableDependentVars,
    currentAnalysisType,
    canAnalyze,
    validationMessage,

    // Methods
    fetchCategories,
    performRegression,
    closeResults,
    destroyCharts,
    getCategoryDisplayName,
    formatPercent,
    getCorrelationColor
  }
}
