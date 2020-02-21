import React, { Component } from "react";

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";

import styles from "./index.module.css";

export default class Filter extends Component {
  // 父组件Filter注入高亮状态数据
  state = {
    menuStatus: {
      area: false,
      mode: true,
      price: false,
      more: false
    },
    openType: ""
  };

  // 修改高亮状态
  changeStatus = type => {
    // 修改菜单状态
    console.log("菜单类型" + type);
    let obj = { ...this.state.menuStatus };
    obj[type] = !obj[type];
    this.setState({
      menuStatus: obj,
      openType: type
    });
    // this.setState({
    //   menuStatus: {
    //     ...this.state.menuStatus,
    //     [type]: true
    //   }
    // })
  };

  // 关闭对话框
  onCancel = () => {
    this.setState({
      openType: ""
    });
  };

  render() {
    const { openType } = this.state;
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {(openType === "area" ||
          openType === "mode" ||
          openType === "price") && <div className={styles.mask} />}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            changeStatus={this.changeStatus}
            menuStatus={this.state.menuStatus}
          />

          {/* 前三个菜单对应的内容： 下拉列表 */}
          {(openType === "area" ||
            openType === "mode" ||
            openType === "price") && <FilterPicker onCancel={this.onCancel} />}

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    );
  }
}
