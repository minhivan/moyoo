import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'vite'

// `npm run dev:https` serves over HTTPS on the LAN so a phone can open the camera and install the app.
const https = process.env.MOYOO_HTTPS === '1'

export default defineConfig({
  plugins: [react(), tailwindcss(), ...(https ? [basicSsl({ name: 'moyoo-dev' })] : [])],
})
