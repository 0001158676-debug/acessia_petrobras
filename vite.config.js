import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/acessia_petrobras",
  plugins: [react()],
})
