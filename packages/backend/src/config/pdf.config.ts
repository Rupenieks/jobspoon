export interface PDFConfig {
  mode: 'server' | 'client';
  previewUrl: string;
  chromeUrl: string;
  chromeToken: string;
}

export const getPDFConfig = (): PDFConfig => {
  const environment = process.env.NODE_ENV || 'development';
  const chromeToken = process.env.CHROME_TOKEN || 'your-secret-token';

  if (environment === 'development') {
    return {
      mode: 'server',
      previewUrl: process.env.PREVIEW_URL || 'http://host.docker.internal:3001',
      chromeUrl: process.env.CHROME_URL || 'ws://localhost:3002',
      chromeToken,
    };
  }

  return {
    mode: 'client',
    previewUrl:
      process.env.PREVIEW_URL ||
      'https://redundant-preview-staging.onrender.com',
    chromeUrl:
      process.env.CHROME_URL || 'wss://redundant-chrome-staging.onrender.com',
    chromeToken,
  };
};
