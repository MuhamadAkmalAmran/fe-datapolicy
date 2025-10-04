import { ref, computed, watch } from 'vue'

export function useDropdown(options = {}) {
  const {
    items = [],
    searchKey = 'name',
    displayKey = 'name',
    multiple = false,
    searchable = true
  } = options

  const isOpen = ref(false)
  const search = ref('')
  const selectedItems = ref(multiple ? [] : null)

  const filteredItems = computed(() => {
    if (!searchable || !search.value) return items.value

    const searchTerm = search.value.toLowerCase()
    return items.value.filter(item => {
      const displayValue = item[displayKey] || item[searchKey] || item
      return displayValue.toLowerCase().includes(searchTerm)
    })
  })

  const displayValue = computed(() => {
    if (!multiple) {
      return selectedItems.value ? (selectedItems.value[displayKey] || selectedItems.value[searchKey] || selectedItems.value) : ''
    }

    if (selectedItems.value.length === 0) return ''
    if (selectedItems.value.length === 1) return selectedItems.value[0][displayKey] || selectedItems.value[0][searchKey] || selectedItems.value[0]

    return `${selectedItems.value.length} items selected`
  })

  const isSelected = (item) => {
    if (!multiple) return selectedItems.value === item
    return selectedItems.value.some(selected => selected === item || selected[searchKey] === item[searchKey])
  }

  const selectItem = (item) => {
    if (!multiple) {
      selectedItems.value = item
      isOpen.value = false
      search.value = item[displayKey] || item[searchKey] || item
    } else {
      const index = selectedItems.value.findIndex(selected =>
        selected === item || selected[searchKey] === item[searchKey]
      )

      if (index > -1) {
        selectedItems.value.splice(index, 1)
      } else {
        selectedItems.value.push(item)
      }
    }
  }

  const removeItem = (item) => {
    if (!multiple) {
      selectedItems.value = null
      search.value = ''
    } else {
      const index = selectedItems.value.findIndex(selected =>
        selected === item || selected[searchKey] === item[searchKey]
      )
      if (index > -1) {
        selectedItems.value.splice(index, 1)
      }
    }
  }

  const clearSelection = () => {
    selectedItems.value = multiple ? [] : null
    search.value = ''
  }

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  // Watch for items changes to update filtered items
  watch(() => items.value, () => {
    // Reset search if current selection is not in new items
    if (!multiple && selectedItems.value) {
      const stillExists = items.value.some(item =>
        item === selectedItems.value || item[searchKey] === selectedItems.value[searchKey]
      )
      if (!stillExists) {
        clearSelection()
      }
    } else if (multiple && selectedItems.value.length > 0) {
      selectedItems.value = selectedItems.value.filter(selected =>
        items.value.some(item => item === selected || item[searchKey] === selected[searchKey])
      )
    }
  })

  return {
    // State
    isOpen,
    search,
    selectedItems,

    // Computed
    filteredItems,
    displayValue,

    // Methods
    isSelected,
    selectItem,
    removeItem,
    clearSelection,
    open,
    close,
    toggle
  }
}
