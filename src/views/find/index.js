import React, { Component } from "react";
import { Flex, WingBlank, Toast } from "antd-mobile";
import "./index.scss";
import getCurrentCity from "../utils/location";
import Filter from "./components/Filter/index";
import request from "../utils/api";
import {
  List,
  AutoSizer,
  WindowScroller,
  InfiniteLoader
} from "react-virtualized";
import HouseItem from "../../components/HouseItem/index";

import NoHouse from "../../components/NoHouse/index";

import Sticky from "../../components/Sticky/index";

export default class Find extends Component {
  state = {
    currentCity: "",
    count: 0,
    list: [],
    filter: {},
    isFinished: false
  };

  componentDidMount() {
    // 获取当前城市名称
    getCurrentCity().then(res => {
      this.setState({
        currentCity: res.label
      });
    });
    // 页面首次加载调用一次接口
    // this.onFilter({});
    this.loadMoreRows({
      startIndex: 1,
      stopIndex: 10
    });
  }

  // 渲染其中一条数据
  rowRenderer = ({ style, key, index }) => {
    // return <div style={style} key={key}>{'测试数据' + index}</div>
    // 如何获取当前列表数据？
    let { list } = this.state;
    let itemData = list[index];
    if (!itemData) {
      // 当数据没有加载成功
      return (
        <div style={style} key={key}>
          <p className="loading"></p>
        </div>
      );
    }
    return (
      <HouseItem
        key={key}
        onClick={() => {
           this.props.history.push("/detail", { id: itemData.houseCode });
        }}
        style={style}
        {...itemData}
      />
    );
    // return <div style={style} key={key}>{'测试数据' + index}</div>
  };

  // 用于跟踪列表每一行数据的加载状态
  isRowLoaded = ({ index }) => {
    const { list } = this.state;
    // 双叹号用于转化为布尔值
    return !!list[index];
  };

  // 用于跟踪列表每一行数据的加载状态
  isRowLoaded = ({ index }) => {
    const { list } = this.state;
    // 双叹号用于转化为布尔值
    return !!list[index];
  };

  // 用于加载下一页数据
  loadMoreRows = async ({ startIndex, stopIndex }) => {
    // 0表示不会自动关闭
    Toast.loading("加载中", 0);
    // 修改加载状态
    this.setState({
      isLoadFinish: true
    });
    console.log(startIndex, stopIndex);
    // 这里负责调用后台接口获取分页数据
    // 返回的数据结果需要提供Promise对象
    let city = await getCurrentCity();
    return request({
      method: "get",
      url: "houses",
      params: {
        ...this.state.filter,
        cityId: city.value,
        start: startIndex,
        end: stopIndex
      }
    }).then(res => {
      // 获取后台接口数据
      this.setState(
        {
          count: res.body.count,
          // 列表数据不应该覆盖，而是要合并
          list: [...this.state.list, ...res.body.list]
        },
        () => {
          // 获取接口数据后
          Toast.hide();
          this.setState({
            isFinished: false
          });
        }
      );
    });
  };

  // 获取筛选条件参数
  onFilter = async filter => {
    // 调用后台接口发送请求
    // 修改筛选条件后，需要清空之前的数据，然后重新加载新的数据
    this.setState(
      {
        filter: filter,
        count: 0,
        list: []
      },
      () => {
        // 重新加载新的数据
        this.loadMoreRows({
          startIndex: 1,
          stopIndex: 10
        });
      }
    );
  };

  renderList = () => {
    return (
      <WingBlank>
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowCount={this.state.count}
        >
          {({ onRowsRendered, registerChild }) => (
            <WindowScroller>
              {({ height, isScrolling, onChildScroll, scrollTop }) => (
                <AutoSizer>
                  {({ width }) => {
                    return (
                      <List
                        autoHeight
                        className="houseList"
                        isScrolling={isScrolling}
                        onScroll={onChildScroll}
                        scrollTop={scrollTop}
                        onRowsRendered={onRowsRendered}
                        ref={registerChild}
                        width={width}
                        height={height}
                        rowCount={this.state.list.length}
                        rowHeight={120}
                        rowRenderer={this.rowRenderer}
                      />
                    );
                  }}
                </AutoSizer>
              )}
            </WindowScroller>
          )}
        </InfiniteLoader>
      </WingBlank>
    );
  };
  render() {
    return (
      <React.Fragment>
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
        <Sticky>
          <Filter onFilter={this.onFilter} />
        </Sticky>

        {/* 房源列表 */}
        {this.state.list.length > 0 && this.renderList()}

        {!this.state.isFinished && this.state.list.length === 0 && (
          <NoHouse>没有房源数据...</NoHouse>
        )}

        <div
          className="toTop"
          onClick={() => {
            // 点击时控制回到顶部
            window.scrollTo(0, 0);
          }}
        >
          ∧
        </div>
      </React.Fragment>
    );
  }
}
