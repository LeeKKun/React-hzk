// 城市列表选择
import React, { Component } from "react";
import { NavBar, Icon, Toast } from "antd-mobile";
import request from "../utils/api.js";
import { List, AutoSizer } from "react-virtualized";
import "./index.scss";
import getcurrent from "../utils/location";

const list = Array.from(new Array(50)).map((item, index) => `第${index}行数据`);
console.log(list);

export default class citylist extends Component {
  state = {
    cityList: {},
    activeIndex: 0
  };

  // 构造函数中添加
  listRef = React.createRef();

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
    //添加一线城市
    let ret = this.fordata(res.body);
    const hot = await request({
      method: "get",
      url: "/area/hot"
    });
    console.log(hot);
    console.log(ret);
    ret.cityIndex.unshift("hot");
    ret.cityList.hot = hot.body;
    //添加当前城市(地理位置)
    let ccity = await getcurrent();
    ret.cityIndex.unshift("#");
    ret.cityList["#"] = [ccity];

    this.setState(
      {
        cityList: ret
      },
      () => {
        this.listRef.current.measureAllRows();
      }
    );

    // 隐藏提示
    Toast.hide();

    // let myCity = new window.BMap.LocalCity();
    // myCity.get(async result => {
    //   // 根据地理定位获取的城市名称查询城市的详细信息
    //   const ccity = await request({
    //     method: "get",
    //     url: "/area/info",
    //     params: {
    //       name: result.name === "全国" ? "北京" : result.name
    //     }
    //   });
    //   // 添加当前城市(地理定位)
    //   ret.cityIndex.unshift("#");
    //   ret.cityList["#"] = [ccity.body];
    //   this.setState({
    //     cityList: ret
    //   });
    // });
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

  rowRenderer = ({ key, index, style }) => {
    // 获取每一行渲染的数据
    const { cityList, cityIndex } = this.state.cityList;
    // 根据当前行数据的索引获取分组标题的字符
    let firstLetter = cityIndex[index];
    // 根据分组索引字符获取对应的城市列表数据
    let cities = cityList[firstLetter];
    // 城市列表的模板
    const cityTag = cities.map(item => (
      <div
        onClick={() => {
          //选中城市跳回到主页
          if (["北京", "上海", "广州", "深圳"].includes(item.label)) {
            // 选中该城市,保存到本地缓存
            //获取选择城市的经纬度数据(g根据城市名称)
            let geo = new window.BMap.Geocoder();
            geo.getPoint(item.label, data => {
            console.log(data);
              let info = {
                label: item.label,
                value: item.value,
                lng: data && data.lng,
                lat: data && data.lat
              };
              window.localStorage.setItem("hkzf_city", JSON.stringify(info));
              // 跳回到主页面
              this.props.history.push("/home");
            },'中国');
          } else {
            // 提示一下即可
            Toast.info("只支持一线城市", 1);
          }
        }}
        key={item.value}
        className="name"
      >
        {item.label}
      </div>
    ));
    return (
      <div key={key} style={style} className="row-city">
        <div className="title">{firstLetter.toUpperCase()}</div>
        <div className="name">{cityTag}</div>
      </div>
    );
  };

  // 动态计算列表每一行高度
  calcRowHeight = ({ index }) => {
    // index表示当前行数据的索引
    const { cityIndex, cityList } = this.state.cityList;
    // 根据数据索引获取分组标题的字符
    let firstLetter = cityIndex[index];
    // 根据标题索引获取当前行的城市列表数据
    let cities = cityList[firstLetter];
    // 行高计算公式：标题的高度 + 每个城市的高度 * 城市的数量
    return 36 + 50 * cities.length;
  };

  // 动态填充右侧索引
  renderRightIndex = () => {
    const { cityIndex } = this.state.cityList;
    const { activeIndex } = this.state;
    return (
      cityIndex &&
      cityIndex.map((item, index) => (
        <li
          onClick={() => {
            // console.log('当前索引号：', index)
            this.listRef.current.scrollToRow(index);
          }}
          key={index}
          className="city-index-item"
        >
          <span className={activeIndex === index ? "index-active" : ""}>
            {item === "hot" ? "热" : item.toUpperCase()}
          </span>
        </li>
      ))
    );
  };

  //  滚动列表让对应索引高亮;
  onRowsRendered = ({ startIndex }) => {
    // console.log('startIndex：', startIndex)
    if (this.state.activeIndex !== startIndex) {
      // 跳转不到z解决方案
      if (startIndex === 19) {
        startIndex = 20;
      }
      this.setState({
        activeIndex: startIndex
      });
    }
  };

  componentDidMount() {
    console.log(list);
    // 组件开始加载时进行提示
    Toast.loading("正在加载...", 0, null, false);
    // 调用接口获取数据
    this.loadcity();
  }

  render() {
    const { cityIndex, cityList } = this.state.cityList;
    return (
      <div className="city">
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
        {cityIndex && (
          <AutoSizer>
            {({ height, width }) => (
              <List
                ref={this.listRef}
                onRowsRendered={this.onRowsRendered}
                scrollToAlignment="start"
                width={width}
                height={height - 45}
                rowCount={cityIndex.length}
                rowHeight={this.calcRowHeight}
                rowRenderer={this.rowRenderer}
              />
            )}
          </AutoSizer>
        )}

        {/* 右侧索引 */}
        <ul className="city-index">{this.renderRightIndex()}</ul>
      </div>
    );
  }
}
