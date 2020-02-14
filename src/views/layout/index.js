// 主页整体布局
import React from "react";
import { Route,Redirect, Switch } from "react-router-dom";
import { TabBar } from "antd-mobile";
import "./index.css";

import Index from '../index/index.js'
import Find from "../find/index.js";
import Info from "../info/index.js";
import My from "../my/index.js";

const tabItems = [
  {
    title: "首页",
    icon: "icon-house",
    id: "index"
  },
  {
    title: "找房",
    icon: "icon-findHouse",
    id: "find"
  },
  {
    title: "资讯",
    icon: "icon-myinfo",
    id: "info"
  },
  {
    title: "我的",
    icon: "icon-my",
    id: "my"
  }
];

class layout extends React.Component {
  state = {
    selectedTab: "index"
  };

  renderTabBarItem() {
    return tabItems.map(item => (
      <TabBar.Item
        title={item.title}
        key={item.id}
        icon={<i className={`iconfont ${item.icon}`} />}
        selectedIcon={<i className={`iconfont ${item.icon}`} />}
        selected={this.state.selectedTab === item.id}
        onPress={() => {
          // 菜单点击触发的事件
          this.setState({
            selectedTab: item.id
          });
          this.props.history.push("/home/" + item.id);
        }}
      >
        <div>{item.title}</div>
      </TabBar.Item>
    ));
  }

  render() {
    return (
      <div className="tabbar menu">
        {/* 菜单相应显示内容的填充位 */}
        <Switch>
          <Redirect exact from="/home" to="/home/index" />
          <Route path="/home/index" component={Index} />
          <Route path="/home/find" component={Find} />
          <Route path="/home/info" component={Info} />
          <Route path="/home/my" component={My} />
        </Switch>

        <TabBar
          noRenderContent={true}
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
        >
          {this.renderTabBarItem()}
        </TabBar>
      </div>
    );
  }
}

export default layout;
