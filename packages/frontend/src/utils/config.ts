/// <reference types="vite/client" />

interface Config {
	apiUrl: string;
	previewUrl: string;
	environment: 'development' | 'staging' | 'production';
	googleClientId: string;
}

export const getEnvConfig = (): Config => {
	return {
		apiUrl: import.meta.env.VITE_API_URL,
		previewUrl: import.meta.env.VITE_PREVIEW_URL,
		environment: import.meta.env.VITE_APP_ENV as Config['environment'],
		googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
	};
};

// Validate config to ensure all required variables are present
const validateConfig = (config: Config) => {
	const requiredFields: (keyof Config)[] = [
		'apiUrl',
		'previewUrl',
		'environment',
		'googleClientId',
	];
	const missingFields = requiredFields.filter((field) => !config[field]);

	if (missingFields.length > 0) {
		throw new Error(`Missing required environment variables: ${missingFields.join(', ')}`);
	}

	return config;
};

export const getConfig = (): Config => {
	const config = getEnvConfig();
	return validateConfig(config);
};

export const getStorageKey = (key: string): string => {
	const env = import.meta.env.VITE_APP_ENV || 'development';
	return `${env}_${key}`;
};
