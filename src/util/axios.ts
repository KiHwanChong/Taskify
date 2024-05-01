import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TASKIFY_API_BASE_URL,
});

const getToken = () => {
  if (typeof window !== undefined) {
    const token = window.localStorage.getItem('accessToken');
    return token;
  }
  return '';
};

instance.interceptors.request.use((config) => {
  const modifiedConfig = { ...config };
  modifiedConfig.headers.Authorization = `Bearer ${getToken()}`;
  return modifiedConfig;
});

export default instance;
