import axios, {AxiosInstance} from 'axios';
import envVars from '../validateEnv';

const config = {
     baseURL: envVars.VITE_APP_API_BASE_URL,
     headers: {
          'Content-Type': 'application/json',
     },
};

const http: AxiosInstance = axios.create(config);

export default http;