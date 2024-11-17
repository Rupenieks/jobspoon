import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
	plugins: [react(), dts()],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'index.ts'),
			formats: ['cjs', 'es'],
			fileName: (format) => `index.${format === 'cjs' ? 'cjs' : 'js'}`,
		},
		rollupOptions: {
			external: ['react', 'react-dom', '@react-email/components', '@react-email/render'],
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
				},
			},
		},
	},
});
