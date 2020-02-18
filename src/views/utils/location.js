//封装地理定位方法
import request from './api.js'

export default () => {
  return new Promise((resolve, reject) => {
    // 这里处理异步任务
    // 先判断本地缓存是否有当前城市的数据
    // 如果有数据就直接从缓存获取，否则通过地理定位
    let city = window.localStorage.getItem("hkzf_city");
    if (city) {
      return resolve(JSON.parse(city));
    }
    // 通过地理定位获取当前城市名称
    let myCity = new window.BMap.LocalCity();
    myCity.get(async result => {
      // 根据地理定位获取的城市名称查询城市的详细信息
      const ccity = await request({
        method: "get",
        url: "/area/info",
        params: {
          name: result.name === "全国" ? "北京" : result.name
        }
      });
      resolve(ccity.body);
    });
  });
};