/**
 * Mengembalikan satuan (unit) berdasarkan nama kategori.
 * @param {string} categoryName - Nama kategori dari data.
 * @returns {string} Satuan yang sesuai atau string kosong.
 */
export const getUnit = (categoryName) => {
  switch (categoryName) {
    case 'Indeks Pembangunan Manusia':
    case 'Prevalensi Stunting':
      return '%'; //
    case 'Jumlah Penduduk Miskin':
      return 'Ribu'; //
    case 'APBD':
      return 'Miliar'; //
    default:
      return ''; //
  }
};

// Anda juga bisa menambahkan fungsi format lainnya di sini
export const formatNumber = (value) => {
  if (typeof value !== 'number') return value;
  return value.toLocaleString('id-ID', {
    maximumFractionDigits: 2
  });
};
