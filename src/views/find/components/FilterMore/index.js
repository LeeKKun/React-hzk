import React, { Component } from "react";

import FilterFooter from "../../../../components/FilterFooter/index.js";

import styles from "./index.module.css";

export default class FilterMore extends Component {
  state = {
    // this.props.defaultValue 从父组件传递过来初始化默认状态
    selectedValues: this.props.defaultValue ? this.props.defaultValue : []
  };

  // 渲染标签
  renderFilters(list) {
    // 高亮类名： styles.tagActive
    const { selectedValues } = this.state;
    return list.map(item => (
      <span
        data-id={item.value}
        key={item.value}
        className={[
          styles.tag,
          selectedValues.includes(item.value) ? styles.tagActive : ""
        ].join(" ")}
      >
        {item.label}
      </span>
    ));
  }

  // 控制标签的选中和反选
  toggleChange = e => {
    // 获取标签的唯一编号
    let id = e.target.dataset.id;
    // 控制id的添加和删除
    // 判断数组中是否已经包含该id,如果没有包含，就添加进去，如果已经包含，就删除该id
    let arr = [...this.state.selectedValues];
    if (arr.includes(id)) {
      // 已经包含,删除id
      let index = arr.findIndex(item => {
        return item === id;
      });
      if (index !== -1) {
        arr.splice(index, 1);
      }
    } else {
      // 不包含，添加id
      arr.push(id);
    }
    this.setState(
      {
        selectedValues: arr
      },
      () => {
        console.log(this.state.selectedValues);
      }
    );
  };

  render() {
    const { roomType, oriented, floor, characteristic } = this.props.data;
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl onClick={this.toggleChange} className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          onCancel={() => {
            // 删除所以选中的标签
            this.setState({
              selectedValues: []
            });
            // 隐藏弹窗
            this.props.onCancel()
          }}
          onSave={() => {
            this.props.onSave(this.props.openType, this.state.selectedValues);
          }}
          className={styles.footer}
        />
      </div>
    );
  }
}
