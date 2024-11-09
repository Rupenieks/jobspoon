import { spawn } from 'child_process';
import waitOn from 'wait-on';

// Start main app
const mainApp = spawn('npm', ['run', 'dev:main'], { stdio: 'inherit' });

// Wait for main app to be ready
waitOn({
	resources: ['http://localhost:5173'],
	timeout: 30000,
})
	.then(() => {
		// Start resume viewer app
		const previewApp = spawn('npm', ['run', 'dev:preview'], { stdio: 'inherit' });

		previewApp.on('error', (err) => {
			console.error('Failed to start preview app:', err);
			process.exit(1);
		});
	})
	.catch((err) => {
		console.error('Error waiting for main app:', err);
		process.exit(1);
	});

// Handle cleanup
process.on('SIGINT', () => {
	mainApp.kill();
	process.exit();
});
