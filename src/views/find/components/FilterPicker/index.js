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
