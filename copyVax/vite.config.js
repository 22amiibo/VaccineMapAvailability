import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({  
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react'
    })
  ],
  base: '/IrProj/',
  optimizeDeps: {
    include: ['react/jsx-runtime', 'topojson-client', 'd3', 'd3-scale', 'leaflet']
  },
  build: {
    commonjsOptions: {
      include: [/topojson-client/, /d3/, /d3-scale/, /leaflet/, /node_modules/],
      transformMixedEsModules: true
    }
  },
  resolve: { alias: { '@': '/src' } }
});
