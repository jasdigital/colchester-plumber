import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: { 
      port: 5173, 
      host: true,
      open: true,
    },
    build: { 
      outDir: 'dist' 
    },
    // Make env variables available to the app
    define: {
      __SENDGRID_API_KEY__: JSON.stringify(env.VITE_SENDGRID_API_KEY),
      __BUSINESS_EMAIL__: JSON.stringify(env.VITE_BUSINESS_EMAIL),
      __FROM_EMAIL__: JSON.stringify(env.VITE_FROM_EMAIL),
    }
  };
});