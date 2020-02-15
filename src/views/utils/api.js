// 封装通用的接口调用方法

import axios from "axios";
// 基准路径
axios.defaults.baseURL = "http://localhost:8080";

// 封装响应拦截器
axios.interceptors.response.use(
  function(response) {
    return response.data
  },
  function(error) {
    return Promise.reject(error);
  }
);

export default ({ method, url, data }) => {
  return axios({
    method,
    url,
    data
  });
};
