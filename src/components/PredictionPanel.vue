<!-- PredictionPanel.vue -->
<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-bold mb-4">Prediksi Nilai</h2>

    <!-- Year Input -->
    <!-- <div class="mb-4">
      <label class="block text-sm font-medium mb-2">Tahun Prediksi</label>
      <input
        v-model="predictionYear"
        type="number"
        class="w-full p-2.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        :min="currentYear"
        :max="currentYear + 10"
      />
    </div> -->

    <!-- Independent Variable Value Input -->
    <div v-if="analysisType === 'single'" class="mb-4">
      <label class="block text-sm font-medium mb-2">
        Nilai {{ getCategoryDisplayName(independentVar) }}
      </label>
      <input
        v-model="independentValue"
        type="number"
        step="0.01"
        class="w-full p-2.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <!-- Predict Button -->
    <button
      @click="makePrediction"
      :disabled="!canPredict"
      class="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 disabled:bg-gray-400"
    >
      Buat Prediksi
    </button>

    <!-- Prediction Results -->
    <div v-if="predictionResults" class="mt-6">
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="font-medium mb-2">Hasil Prediksi:</h3>
        <div v-if="analysisType === 'single'">
          <p class="mb-2">
            Berdasarkan {{ getCategoryDisplayName(independentVar) }}:
            {{ formatNumber(independentValue) }}
          </p>
          <p class="mb-2">
            Prediksi {{ getCategoryDisplayName(dependentVar) }}:
            {{ formatNumber(predictionResults.predictions.dependent_variable.predicted_value) }}
          </p>
          <p class="text-sm text-gray-600">
            R-squared: {{ formatPercent(predictionResults.predictions.confidence_metrics.r_squared) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import axios from 'axios'

export default {
  props: {
    analysisType: {
      type: String,
      required: true
    },
    selectedRegion: {
      type: String,
      required: true
    },
    independentVar: {
      type: String,
      default: ''
    },
    dependentVar: {
      type: String,
      default: ''
    },
    getCategoryDisplayName: {
      type: Function,
      required: true
    }
  },

  setup(props) {
    const currentYear = new Date().getFullYear()
    const predictionYear = ref(currentYear + 1)
    const independentValue = ref('')
    const predictionResults = ref(null)
    const isLoading = ref(false)

    const canPredict = computed(() => {
      if (!props.selectedRegion || !predictionYear.value) return false
      if (props.analysisType === 'single') {
        return props.independentVar && props.dependentVar && independentValue.value
      }
      return true
    })

    const formatNumber = (value) => {
      return Number(value).toLocaleString('id-ID', {
        maximumFractionDigits: 2
      })
    }

    const formatPercent = (value) => {
      return (value * 100).toLocaleString('id-ID', {
        maximumFractionDigits: 1
      }) + '%'
    }

    const makePrediction = async () => {
      if (!canPredict.value) return
      isLoading.value = true

      try {
        const payload = {
          city: props.selectedRegion,
          analysis_type: props.analysisType,
          prediction_year: predictionYear.value
        }

        if (props.analysisType === 'single') {
          payload.independent_variable = props.independentVar
          payload.dependent_variable = props.dependentVar
          payload.independent_value = parseFloat(independentValue.value)
        }

        const response = await axios.post('https://api.datapolicy.jogjacode.id/predict', payload)
        predictionResults.value = response.data
      } catch (error) {
        console.error('Prediction error:', error)
      } finally {
        isLoading.value = false
      }
    }

    return {
      currentYear,
      predictionYear,
      independentValue,
      predictionResults,
      isLoading,
      canPredict,
      makePrediction,
      formatNumber,
      formatPercent
    }
  }
}
</script>
