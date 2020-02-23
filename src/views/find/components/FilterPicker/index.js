import React, { Component } from "react";

import { PickerView } from "antd-mobile";

import FilterFooter from "../../../../components/FilterFooter/index";

export default class FilterPicker extends Component {
  state = {
    value: this.props.defaultValue ? this.props.defaultValue : []
  };

  // 表单值的处理：和原生表单的用法不同（参数是实际的数据，而不是事件对象）
  handleChange = value => {
    this.setState({
      value
    });
  };

  componentDidUpdate(prevProps, prevState) {
    // 该生命周期函数触发条件：组件的相关数据（props和state）发生变化
    // 如果父组件defaultValue的props值发生变化时，手动进行更新
    // 必须添加条件判断：只有对应的值更新后才触发状态变更动作
    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.setState({
        value: this.props.defaultValue
      });
    }
  }

  render() {
    return (
      <>
        {/* 选择器组件： */}
        <PickerView
          onChange={this.handleChange}
          data={this.props.data}
          value={this.state.value}
          cols={this.props.cols}
        />

        {/* 底部按钮 */}
        <FilterFooter
          onSave={() => {
            this.props.onSave(this.props.openType, this.state.value);
          }}
          onCancel={this.props.onCancel}
        />
      </>
    );
  }
}
