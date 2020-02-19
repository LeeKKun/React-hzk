// 封装地理定位方法

import request from "./api";

export default () => {
  return new Promise((resolve, rejects) => {
    // 这里处理异步任务
    // 先判断本地缓存是否由当地城市数据
    // 如果有数据直接从本地取 否则通过地理定位
    let city = window.localStorage.getItem("hkzf_city");
    if (city) {
      return resolve(JSON.parse(city));
    }
    // 通过地理位置获取当前城市名称
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
      let lng = result.center.lng;
      let lat = result.center.lat;
      if (result.name === "全国") {
        // 默认设置为北京
        lng = "116.404";
        lat = "39.915";
      }
      let info = {
        label: ccity.body.label,
        value: ccity.body.value,
        lng: lng,
        lat: lat
      };
      resolve(info);
    });
  });
};
