import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // or @vitejs/plugin-react

// https://vitejs.dev/config/
export default defineConfig({
  // The plugins array is one property of the config object
  plugins: [react()],
  
  // The server block is another property, so it must be inside the curly braces {}
  // and separated by a comma.
  server: {
    proxy: {
      '/api': {
        // This is the public URL that points to your backend teammate's compu ter
        target: 'https://dff5038b5e80.ngrok-free.app/',
       // https://b69d88014c71.ngrok-free.app/
        // This is a very important setting for ngrok
        changeOrigin: true,
        
        // This helps prevent certain SSL/CORS issues with ngrok
        secure: false,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', // We will create this file next
  },
})