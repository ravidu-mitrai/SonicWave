import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://itunes.apple.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;