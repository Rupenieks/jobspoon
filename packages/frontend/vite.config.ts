import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	// Load env file based on `mode` in the current working directory.
	// Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [
			react(),
			svgr({
				include: '**/*.svg?react',
			}),
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
		server: {
			port: 5173,
			host: true,
		},
		build: {
			outDir: 'dist',
			sourcemap: mode !== 'production',
			rollupOptions: {
				output: {
					manualChunks: {
						vendor: ['react', 'react-dom'],
					},
				},
			},
		},
		define: {
			// Expose environment variables to your application
			__APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
		},
	};
});
