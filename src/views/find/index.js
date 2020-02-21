import React, { Component } from "react";
import { Flex } from "antd-mobile";
import "./index.scss";
import getCurrentCity from "../utils/location";
import Filter from "./components/Filter/index";

export default class Find extends Component {
  state = {
    currentCity: ""
  };

  componentDidMount() {
    // 获取当前城市名称
    getCurrentCity().then(res => {
      this.setState({
        currentCity: res.label
      });
    });
  }

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
        <Filter/>
      </div>
    );
  }
}
