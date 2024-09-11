import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'   
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
      alias: {
        '@' : fileURLToPath(new URL('./src', import.meta.url))  // Cuando haya un @ quiere decir que ser va a usar fileURLToPath  donde por ejemplo en el archivo AppLayout.tsx   se usa   import Logo from '@/components/Logo'     este seria el @    el base y path
      }
  }
})
