// 城市列表选择
import React, { Component } from "react";
import { NavBar, Icon } from "antd-mobile";
import request from "../utils/api.js";
import { List, AutoSizer } from "react-virtualized";
import './index.scss'

const list = Array.from(new Array(50)).map(
  (item, index) => `第${index}行数据`
);
console.log(list);

export default class citylist extends Component {
  state = {
    cityList: {}
  };
  // 城市列表数据
  loadcity = async () => {
    let res = await request({
      method: "get",
      url: "/area/city",
      params: {
        level: 1
      }
    });
    console.log(res);
    let ret = this.fordata(res.body);
    console.log(ret);
    this.setState({
      cityList: ret
    });
  };

  // 数据重构
  fordata = list => {
    // data->原始数据数组
    let citylist = {};
    let cityIndex = [];
    list.map(item => {
      const first = item.short.substr(0, 1);
      if (first in citylist) {
        // 判断对象中是否存在属性
        citylist[first].push(item);
      } else {
        citylist[first] = [item];
      }
      cityIndex = Object.keys(citylist).sort();
    });
    return {
      cityIndex,
      cityList: citylist
    };
  };

  componentDidMount() {
    this.loadcity();
    console.log(list);
  }

  // 动态生成城市列表模板
  renderCityList = () => {
    let { cityList, cityIndex } = this.state.cityList;
    let cityTag = [];
    /*
      cityList结构：{a: [{}], b: [{}]}
    */
    cityIndex &&
      cityIndex.forEach(k => {
        // 获取每个条目的标题字符：k
        cityTag.push(<div key={k}>{k}</div>);
        // 获取其中一项数据:城市列表数据
        let city = cityList[k];
        // 遍历城市列表数据
        city.forEach(c => {
          cityTag.push(<div key={c.value}>{c.label}</div>);
        });
      });
    return cityTag;
  };

  rowRenderer = ({key, index, style}) => {
    return (
      <div key={key} style={style}>
        {list[index]}
      </div>
    );
  };
  render() {
    return (
      <div className='city'>
        {/* 导航栏 */}
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

        {/* 城市列表 */}
        {/* {this.renderCityList()} */}
          <AutoSizer>
            {({ height, width }) => (
              <List
                width={width}
                height={height - 45}
                rowCount={list.length}
                rowHeight={20}
                rowRenderer={this.rowRenderer}
              />
            )}
          </AutoSizer>
      </div>
    );
  }
}
