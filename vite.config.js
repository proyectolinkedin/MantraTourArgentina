import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@mui/icons-material/Close',
      '@mui/icons-material/Facebook',
      '@mui/icons-material/Twitter',
      '@mui/icons-material/Instagram'
    ]
  }
});
