/*
  测试地图
*/
import React from "react";
import { NavBar, Icon } from "antd-mobile";
import "./index.scss";
import getCurrentCity from "../utils/location.js";
import request from "../utils/api.js";
import { IMG_BASE_URL } from "../utils/config";

class MapFind extends React.Component {
  state = {
    mapData: [],
    houseList: [],
    isShow: false
  };

  // 调用后台接口获取所有的聚合数据
  loadData = async () => {
    // 支持城市的切换（获取城市的经纬度数据）
    let city = await getCurrentCity();
    let res = await request({
      method: "get",
      url: "/area/map",
      params: {
        // 城市的唯一编号
        id: city.value
      }
    });
    this.setState({
      mapData: res.body
    });
  };

  // 封装绘制一级覆盖物函数
  drawFirstOverlay = (point, map) => {
    // 设置中心点坐标和地图缩放级别
    map.centerAndZoom(point, 11);
    // 批量绘制
    this.state.mapData.forEach(item => {
      // 绘制单个覆盖物
      this.drawSingleOverlay(item, map, "first");
    });
  };

  // 封装绘制二级覆盖物函数
  drawSecondOverlay = async (data, point, map) => {
    // 点击覆盖物之后，放大地图，先清空原有的覆盖物，再重新绘制二级覆盖物
    // 1、放大地图
    map.centerAndZoom(point, 13);
    // 2、清空原有覆盖物(添加延时函数为了防止地图内部错误)
    setTimeout(() => {
      map.clearOverlays();
    }, 0);
    // 3、绘制二级覆盖物（调用接口获取二级区域数据）
    // 3-1、获取二级覆盖物数据
    let res = await request({
      method: "get",
      url: "/area/map",
      params: {
        id: data.value
      }
    });
    // 3-2、把数据渲染出来
    res.body.forEach(item => {
      this.drawSingleOverlay(item, map, "second");
    });
  };

  // 绘制三级覆盖物
  drawThirdOverlay = async (data, point, map) => {
    // 1、放大地图
    map.centerAndZoom(point, 15);
    // 2、清空二级覆盖物
    setTimeout(() => {
      map.clearOverlays();
    }, 0);
    // 3、调用后台接口获取三级覆盖物数据
    let res = await request({
      method: "get",
      url: "/area/map",
      params: {
        id: data.value
      }
    });
    // 4、绘制三级覆盖物
    res.body.forEach(item => {
      this.drawSingleOverlay(item, map, "third");
    });
  };

  // 封装绘制单个覆盖物方法
  drawSingleOverlay = (data, map, type) => {
    // 根据参数传递的数据生成当前覆盖物的坐标点
    let point = new window.BMap.Point(
      data.coord.longitude,
      data.coord.latitude
    );

    // 添加地图覆盖物
    let opts = {
      // 表示覆盖物绘制的坐标
      position: point,
      // 覆盖物中心点的偏移量
      offset: new window.BMap.Size(-30, -30)
    };
    // 创建地图覆盖物（Label内容支持富文本）
    let overInfo = `
      <div class='map-overlay ${type === "second" ? "map-overlay-second" : ""}'>
        <div>${data.label}</div>
        <div>${data.count}套</div>
      </div>
    `;
    if (type === "third") {
      // 三级覆盖物
      overInfo = `
        <div class='map-overlay-area'>${data.label}(${data.count}套)</div>
      `;
    }
    let label = new window.BMap.Label(overInfo, opts);
    // 给覆盖物绑定事件
    label.addEventListener("click", e => {
      if (type === "first") {
        // 点击一级覆盖物，就绘制二级覆盖物
        this.drawSecondOverlay(data, point, map);
      } else if (type === "second") {
        // 点击二级覆盖物，就绘制三级覆盖物
        this.drawThirdOverlay(data, point, map);
      } else if (type === "third") {
        // 点击三级覆盖物，展示房源列表
        this.getHouseList(data.value);

        // 计算地图移动的距离（x, y）
        // 3-1、地图中心点坐标
        let x0 = window.innerWidth / 2;
        let y0 = (window.innerHeight - 330) / 2;
        // 3-2、鼠标点击位置的坐标
        let x1 = e.changedTouches[0].clientX;
        let y1 = e.changedTouches[0].clientY;
        // 3-3、调用地图API控制地图移动
        map.panBy(x0 - x1, y0 - y1);

        this.setState({
          // 获取数据并显示房源列表
          isShow: true
        });
      }
    });
    // 调整默认的覆盖物样式
    label.setStyle({
      border: 0,
      background: "rgba(0, 0, 0, 0)"
    });
    // 把地图覆盖物添加到地图中
    map.addOverlay(label);
  };

  // 封装获取房源列表数据的方法
  getHouseList = async id => {
    let res = await request({
      method: "get",
      url: "houses",
      params: {
        cityId: id
      }
    });
    this.setState({
      houseList: res.body.list
    });
  };

  // 封装渲染房源列表方法
  rendrhouselist = () => {
    const listTag = this.state.houseList.map(item => (
      <div key={item.houseCode} className="house">
        <div className="img-wrap">
          <img className="img" src={IMG_BASE_URL + item.houseImg} alt="" />
        </div>
        <div className="content">
          <h3 className="title">{item.title}</h3>
          <div className="desc">{item.desc}</div>
          <div>
            <span className="tag1">
              {item.tags.map((item, index) => {
                let tagCls = "tag" + (index + 1);
                return (
                  <span key={index} className={["tag", tagCls].join(" ")}>
                    {item}
                  </span>
                );
              })}
            </span>
          </div>
          <div className="price">
            <span className="price-num">{item.price}</span> 元/月
          </div>
        </div>
      </div>
    ));
    return (
      <div
        className={["house-list", this.state.isShow ? "show" : ""].join(" ")}
      >
        <div className="title-wrap">
          <h1 className="list-title">房屋列表</h1>
          <a className="title-more" href="/house/list">
            更多房源
          </a>
        </div>
        <div className="house-items">
          {/*这里是房源列表*/}
          {listTag}
        </div>
      </div>
    );
  };

  // 初始化地图
  initMap = async () => {
    // 创建地图实例
    let map = new window.BMap.Map("mymap");
    // 获取地图的定位信息
    // let myCity = new window.BMap.LocalCity();
    // 获取当前的城市数据
    let city = await getCurrentCity();
    // 创建点坐标
    let point = new window.BMap.Point(city.lng, city.lat);

    // 批量绘制所有一级覆盖物
    this.drawFirstOverlay(point, map);

    // 监听地图的移动行为
    map.addEventListener("movestart", () => {
      // 地图移动时，隐藏房源列表
      this.setState({
        isShow: false
      });
    });
    // let label = new window.BMap.Label("覆盖物", opts);
  };

  async componentDidMount() {
    // 方法一：
    // 初始化地图功能
    await this.loadData();
    this.initMap();

    // 方法二：保证数据获取到之后再初始化地图
    // this.loadData().then(() => {
    //   this.initMap()
    // })
  }

  render() {
    return (
      <div style={{ height: "100%", background: "#eee" }}>
        <NavBar
          className="navbar"
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            this.props.history.go(-1);
          }}
        >
          地图找房
        </NavBar>
        <div style={{ height: "100%" }} id="mymap"></div>

        {/* 房源列表 */}
        {this.rendrhouselist()}
      </div>
    );
  }
}

export default MapFind;
