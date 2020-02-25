import React, { Component } from "react";
import styles from "./index.module.css";

export default class Sticky extends Component {
  //填充位引用
  placeholder = React.createRef();

  // 目标组件的引用
  content = React.createRef();

  // 实现吸顶业务处理
  handleScroll = () => {
    // 获取组件的props属性
    const { height } = this.props;
    // 当条件菜单超出顶部可视区边界进行吸顶
    // 获取元素的位置信息
    let content = this.content.current;
    let placeholder = this.placeholder.current;
    // top表示元素到可视区顶部的距离
    let { top } = placeholder.getBoundingClientRect();
    if (top <= 0) {
      // 超出上边界，进行定位(目标组件定位；填充位设置高度)
      content.classList.add(styles.toFix);
      placeholder.style.height = height + "px";
    } else {
      // 进入到可视区，取消定位(目标组件删除类名；填充位高度设置为0)
      content.classList.remove(styles.toFix);
      placeholder.style.height = "0";
    }
  };

  componentDidMount() {
    // 监听页面滚动事件
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    // 组件销毁时，注销事件的绑定
    window.removeEventListener("scroll", this.handleScroll);
  }

  render() {
    return (
      <React.Fragment>
        {/*占位符,防止列表挤上去*/}
        <div ref={this.placeholder}></div>
        {/*内容组件*/}
        <div ref={this.content}>{this.props.children}</div>
      </React.Fragment>
    );
  }
}
