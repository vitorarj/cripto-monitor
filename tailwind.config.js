/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './node_modules/preline/dist/*.js', // Inclua o Preline aqui
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {}, // Suas customizações aqui
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('preline/plugin'),
  ],
}
