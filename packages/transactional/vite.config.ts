import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
	plugins: [
		react(),
		dts({
			insertTypesEntry: true,
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'index.ts'),
			name: 'transactional',
			formats: ['es', 'cjs'],
			fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
		},
		rollupOptions: {
			external: ['react', 'react/jsx-runtime', '@react-email/components'],
			output: {
				globals: {
					react: 'React',
					'react/jsx-runtime': 'jsx',
					'@react-email/components': 'reactEmailComponents',
				},
			},
		},
	},
});
