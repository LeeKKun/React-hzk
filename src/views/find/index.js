import React, { Component } from "react";
import { Flex } from "antd-mobile";
import "./index.scss";
import getCurrentCity from "../utils/location";
import Filter from "./components/Filter/index";
import request from '../utils/api'

export default class Find extends Component {
  state = {
    currentCity: "",
    count: 0,
    list: []
  };

  componentDidMount() {
    // 获取当前城市名称
    getCurrentCity().then(res => {
      this.setState({
        currentCity: res.label
      });
    });
  }

  // 获取筛选条件参数
  onFilter = async filter => {
    // 调用后台接口发送请求
    let city = await getCurrentCity();
    let res = await request({
      method: "get",
      url: "houses",
      params: {
        ...filter,
        cityId: city.value,
        start: 1,
        end: 10
      }
    });
    this.setState({
      count: res.body.count,
      list: res.body.list
    });
  };

  render() {
    return (
      <div>
        {/* //顶部搜索栏 */}
        <Flex className="header">
          <i className="iconfont icon-back" />
          <Flex className="search-box searchHeader">
            {/* 左侧白色区域 */}
            <Flex className="search">
              {/* 位置 */}
              <div className="location">
                <span className="name">{this.state.currentCity}</span>
                <i className="iconfont icon-arrow" />
              </div>

              {/* 搜索表单 */}
              <div className="form">
                <i className="iconfont icon-seach" />
                <span className="text">请输入小区或地址</span>
              </div>
            </Flex>
            {/* 右侧地图图标 */}
            <i className="iconfont icon-map" />
          </Flex>
        </Flex>

        {/* 筛选菜单 */}
        <Filter onFilter={this.onFilter} />
      </div>
    );
  }
}
