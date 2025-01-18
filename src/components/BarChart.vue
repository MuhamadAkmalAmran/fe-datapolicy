<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import { defineComponent, onMounted, onUnmounted, watch, ref } from 'vue'

// Register Chart.js components
Chart.register(...registerables)

export default defineComponent({
  name: 'BarChart',
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const chartCanvas = ref(null)
    let chart = null

    const createChart = () => {
      const ctx = chartCanvas.value.getContext('2d')

      // Destroy existing chart if it exists
      if (chart) {
        chart.destroy()
      }

      // Create new chart
      chart = new Chart(ctx, {
        type: 'bar',
        data: props.chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            title: {
              display: true,
              text: props.chartOptions?.title?.text || '',
              font: {
                size: 16
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                drawBorder: false
              },
              ticks: {
                padding: 10
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                padding: 10
              }
            }
          },
          ...props.chartOptions
        }
      })
    }

    const updateChart = () => {
      if (!chart) {
        createChart()
        return
      }

      chart.data = props.chartData
      chart.options = {
        ...chart.options,
        ...props.chartOptions
      }
      chart.update('none') // Use 'none' for better performance
    }

    // Watch for changes in props
    watch(() => props.chartData, (newData) => {
      if (newData) {
        updateChart()
      }
    }, { deep: true })

    watch(() => props.chartOptions, (newOptions) => {
      if (newOptions) {
        updateChart()
      }
    }, { deep: true })

    // Lifecycle hooks
    onMounted(() => {
      createChart()
    })

    onUnmounted(() => {
      if (chart) {
        chart.destroy()
        chart = null
      }
    })

    return {
      chartCanvas
    }
  }
})
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 400px !important;
}
</style>
