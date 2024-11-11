import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { pdfjs } from 'react-pdf';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './auth/AuthProvider';
import { Toaster } from './components/ui/toaster';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const queryClient = new QueryClient();

ReactDOM.render(
	<React.StrictMode>
		<GoogleOAuthProvider clientId="946613478264-hhi5t3lt4fjlvpcfd8qqpk0pe9a8fb3c.apps.googleusercontent.com">
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<App />
					<Toaster />
				</AuthProvider>
			</QueryClientProvider>
		</GoogleOAuthProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
