/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
import flowbite from 'flowbite/plugin';

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [flowbite, daisyui],
  daisyui: {
    themes: ['light'], // Atur tema sesuai kebutuhan
    style: true, // Aktifkan styling DaisyUI
  },
};
