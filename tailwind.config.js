/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors : {
        "dark-purple" : "#081A51",
        "light-white" : "rgba(255,255,255,0.17)"
      },
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

