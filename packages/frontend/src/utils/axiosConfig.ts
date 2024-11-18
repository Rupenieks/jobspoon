import axios from 'axios';
import { getEnvConfig } from './config';

const axiosInstance = axios.create({
	baseURL: getEnvConfig().apiUrl,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers['Authorization'] = `Bearer ${token}`;
						return axiosInstance(originalRequest);
					})
					.catch((err) => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const refreshToken = localStorage.getItem('refresh_token');
				if (!refreshToken) {
					throw new Error('No refresh token available');
				}

				const response = await axios.post('http://localhost:3000/auth/refresh', {
					refresh_token: refreshToken,
				});

				const { access_token, refresh_token } = response.data;
				localStorage.setItem('token', access_token);
				localStorage.setItem('refresh_token', refresh_token);

				axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
				processQueue(null, access_token);

				return axiosInstance(originalRequest);
			} catch (err) {
				processQueue(err, null);
				localStorage.removeItem('token');
				localStorage.removeItem('refresh_token');
				return Promise.reject(err);
			} finally {
				isRefreshing = false;
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
