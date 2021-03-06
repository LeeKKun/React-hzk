// 封装通用的接口调用方法

import axios from "axios";
// 基准路径
// axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
// 封装响应拦截器
axios.interceptors.response.use(
  function(response) {
    return response.data
  },
  function(error) {
    return Promise.reject(error);
  }
);

export default ({ method, url, data, params }) => {
  return axios({
    method,
    url,
    data,
    params
  });
};
