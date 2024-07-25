import axios from "axios";
const contentTypeJson = "application/json"; //"application/x-www-form-urlencoded"
export const baseURL = import.meta.env.VITE_PROD_BASE_API;

const request = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": contentTypeJson,
  },
});

request.interceptors.request.use(
  (config) => {
    if (config.Authorization) {
      config.headers["Authorization"] = config.Authorization;
    }
    // const token = btoa(`${config.data.username}:${config.data.password}`);
    // config.auth = {
    //   username: config.data.username,
    //   password: config.data.password,
    // };
    // config.headers["Authorization"] = `Basic ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code == 200) {
      return res;
    } else {
      return res;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
