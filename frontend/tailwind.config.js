// tailwind.config.js
module.exports = {
    content: [
      './index.html', // or the appropriate paths for your Vite project
      './src/**/*.{html,js,ts,jsx,tsx}'
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/line-clamp')
    ],
  }
  