/* 
Конфигурира axios за работа с бекенда. Задава baseURL (http://localhost:8000)
Използва се във всички заявки към бекенда.
*/

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000', 
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Axios request to", config.url, "with token:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default instance;
