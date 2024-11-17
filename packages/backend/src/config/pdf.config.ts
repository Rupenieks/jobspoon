export interface PDFConfig {
  mode: 'server' | 'client';
  previewUrl: string;
}

export const getPDFConfig = (): PDFConfig => {
  const environment = process.env.NODE_ENV || 'development';

  if (environment === 'development') {
    return {
      mode: 'server',
      previewUrl: process.env.PREVIEW_URL || 'http://host.docker.internal:3001',
    };
  }

  return {
    mode: 'client',
    previewUrl: process.env.PREVIEW_URL || 'https://preview.yourapp.com',
  };
};
