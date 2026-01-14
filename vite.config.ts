import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/mindwhack/',
  define: {
    'process.env.API_KEY': JSON.stringify(
      process.env.VITE_API_KEY || process.env.API_KEY || ''
    )
  }
});
