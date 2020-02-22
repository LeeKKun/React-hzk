import React, { Component } from "react";

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";
import request from "../../../utils/api.js";
import styles from "./index.module.css";
import getCurrentCity from "../../../utils/location.js";

export default class Filter extends Component {
  state = {
    // 保存选中的所有的条件值
    menuValue: {
      area: null,
      mode: null,
      price: null,
      more: null
    },
    // 菜单高亮控制
    menuStatus: {
      area: false,
      mode: false,
      price: false,
      more: false
    },
    // 表示当前打开的菜单类型
    openType: "",
    // 筛选条件数据
    filterData: []
  };

  // 调用后台接口获取下拉列表条件数据
  loadData = async () => {
    let city = await getCurrentCity();
    let res = await request({
      method: "get",
      url: "/houses/condition",
      params: {
        id: city.value
      }
    });
    this.setState({
      filterData: res.body
    });
  };

  componentDidMount() {
    this.loadData();
  }

  // 修改高亮状态
  changeStatus = type => {
    if (!type) {
      return;
    }
   
    // 判断菜单是否高亮
    const { menuValue, menuStatus, openType } = this.state;
    // 复制一份状态数据
    const newMenuStatus = { ...menuStatus };
    // arr = ['area', 'mode', 'price', 'more']
    Object.keys(newMenuStatus).forEach(item => {
      // 分别判断四个条件菜单是否高亮
      if (item === type) {
        // 1、判断是否为当前菜单
        newMenuStatus[item] = true;
      } else if (
        item === "area" &&
        menuValue.area &&
        menuValue.area.length === 3
      ) {
        // 2、判断区域高亮
        newMenuStatus.area = true;
      } else if (
        item === "mode" &&
        menuValue.mode &&
        menuValue.mode.length === 1 &&
        menuValue.mode[0] !== "null"
      ) {
        // 3、判断租房高亮
        newMenuStatus.mode = true;
      } else if (
        item === "price" &&
        menuValue.price &&
        menuValue.price.length === 1 &&
        menuValue.price[0] !== "null"
      ) {
        // 4、判断价格高亮
        newMenuStatus.price = true;
      } else if (
        item === "more" &&
        menuValue.more &&
        menuValue.more.length > 0
      ) {
        // 5、判断筛选按钮高亮
        console.log(menuValue.more);
        newMenuStatus.more = true;
      } else {
        // 其他情况不高亮
        newMenuStatus[item] = false;
      }
    });

    // 方法二：实现状态更新
    this.setState({
      menuStatus: newMenuStatus,
      openType: type
    });
  };

  // 关闭下拉列表
  onCancel = () => {
    this.setState({
      openType: ""
    });
  };

  // 获取下拉列表值并隐藏弹窗
  onSave = (type, value) => {
    this.setState(
      {
        openType: "",
        menuValue: {
          ...this.state.menuValue,
          [type]: value
        }
      },
      () => {
        const { menuValue } = this.state;
        let filter = {};
        if (menuValue.area && menuValue.area.length === 3) {
          // 有效数据
          let keyName = menuValue.area[0]; // 取值只能是area或者subway
          let keyValue = menuValue.area;
          if (keyValue[2] === "null") {
            // 选择了两项
            filter[keyName] = keyValue[1];
          } else {
            // 选择了三项
            filter[keyName] = keyValue[2];
          }
        }
      
        // 2、出租方式
        if (
          menuValue.mode &&
          menuValue.mode.length === 1 &&
          menuValue.mode[0] !== "null"
        ) {
          filter.rentType = menuValue.mode[0];
        }

        // 3、房屋租金
        if (
          menuValue.price &&
          menuValue.price.length === 1 &&
          menuValue.price[0] !== "null"
        ) {
          filter.price = menuValue.price[0];
        }

        // 4、筛选更多条件
        if (menuValue.more && menuValue.more.length > 0) {
          // 多个id拼接为逗号分隔的字符串
          filter.more = menuValue.more.join(",");
        }
        // 将组合好的参数传递到父组件
        this.props.onFilter(filter);
      }
    );
  };

  // 渲染FilterPicker方法
  renderFilterPicker = () => {
    const {
      openType,
      filterData: { area, subway, rentType, price },
      menuValue
    } = this.state;
    // 从filterData中解构出如下四个属性
    // const { area, subway, rentType, price } = filterData;

    if (!(openType === "area" || openType === "mode" || openType === "price")) {
      // 如果条件不成立，就不渲染
      return null;
    }

    // 根据当前点击的菜单，填充不同的数据
    let pickerData = [];
    let cols = 3;
    // 获取原来选择的值（默认值）
    let defaultValue = menuValue[openType];

    switch (openType) {
      case "area":
        // 支持区域找房和地铁找房
        pickerData = [area, subway];
        cols = 3;
        break;
      case "mode":
        // 租房模式
        pickerData = rentType;
        cols = 1;
        break;
      case "price":
        // 租房价格
        pickerData = price;
        cols = 1;
        break;
      default:
        break;
    }

    return (
      <FilterPicker
        defaultValue={defaultValue}
        openType={openType}
        cols={cols}
        data={pickerData}
        onSave={this.onSave}
        onCancel={this.onCancel}
      />
    );
  };

  // 渲染FilterMore方法
  renderFilterMore = () => {
    const {
      openType,
      menuValue,
      filterData: { roomType, oriented, floor, characteristic }
    } = this.state;

    if (openType !== "more") {
      // 阻止渲染
      return null;
    }

    let moreData = { roomType, oriented, floor, characteristic };
    // 获取之前选择的值（默认值）
    let defaultValue = menuValue[openType];
    return (
      <FilterMore
        defaultValue={defaultValue}
        openType={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={moreData}
      />
    );
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

          {/* 前三个菜单对应的内容：下拉列表 */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    );
  }
}
