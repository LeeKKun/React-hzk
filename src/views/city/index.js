// 城市列表选择
import React, { Component} from 'react'
import {NavBar, Icon } from "antd-mobile";

export default class citylist extends Component {

  render() {
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            // 跳回到主页
            // this.props.history.push('/home')
            // this.props.history.goBack()
            this.props.history.go(-1);
          }}
        >
          城市选择
        </NavBar>
      </div>
    ); 
  } 
}