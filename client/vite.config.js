import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   server: {
//     proxy: {
//       '/api': 'https://eventure-4z44.onrender.com'
//     }
//   },
//   plugins: [react()],
// })

export default defineConfig({
  plugins: [react()],
})
