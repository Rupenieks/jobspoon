import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [react()],
		root: path.resolve(__dirname, 'src/resume-viewer/src'),
		base: '/',
		server: {
			port: 3001,
			cors: true,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Cross-Origin-Opener-Policy': 'same-origin',
				'Cross-Origin-Embedder-Policy': 'require-corp',
			},
			strictPort: true,
			host: '0.0.0.0',
		},
		build: {
			outDir: path.resolve(__dirname, 'dist/resume-viewer'),
			emptyOutDir: true,
		},
		define: {
			__APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
		},
	};
});
