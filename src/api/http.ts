import axios, {AxiosInstance} from 'axios';

const config = {
     baseURL: import.meta.env.VITE_APP_API_BASE_URL,
     headers: {
          'Content-Type': 'application/json',
     },
};

const http: AxiosInstance = axios.create(config);

export default http;