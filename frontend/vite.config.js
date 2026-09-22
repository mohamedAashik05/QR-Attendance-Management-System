import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  if (!env.VITE_BACKEND_URL) {
    throw new Error("VITE_BACKEND_URL is required");
  }

  return {
    plugins: [react(), tailwindcss(), basicSsl()],
    server: {
      host: true,
      https: true,
      proxy: {
        "/api": env.VITE_BACKEND_URL,
      },
    },
  };
})