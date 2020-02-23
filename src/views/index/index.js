import React, { Component } from "react";
import { Carousel, Flex, Grid, WingBlank, NavBar, Icon } from "antd-mobile";
import "./index.scss";
// import axios from "axios";
import request from "../utils/api.js";

// 菜单图标
import nav1 from "../assets/images/nav-1.png";
import nav2 from "../assets/images/nav-2.png";
import nav3 from "../assets/images/nav-3.png";
import nav4 from "../assets/images/nav-4.png";

import { IMG_BASE_URL } from "../utils/config.js";

import getcurrent from '../utils/location'

// axios.defaults.baseURL = "http://localhost:8080";

export default class Index extends Component {
  state = {
    swiperData: [],
    isloaded: false,
    groupData: [],
    newsData: [],
    currentCity: ""
  };

  // 轮播图数据
  loadSwiper = async () => {
    // let res = await axios.get("/home/swiper");
    let res = await request({
      method: "get",
      url: "/home/swiper"
    });
    console.log(res);
    this.setState({
      swiperData: res.body
    });
  };

  // 加载租房小组数据
  loadGroup = async () => {
    // let res = await axios.get("/home/groups");
    let res = await request({
      method: "get",
      url: "/home/groups"
    });
    console.log(res);
    this.setState({
      groupData: res.body
    });
  };

  // 加载资讯数据
  loadNews = async () => {
    // let res = await axios.get("/home/news");
    let res = await request({
      method: "get",
      url: "/home/news"
    });
    console.log(res);
    this.setState({
      newsData: res.body
    });
  };

  // 轮播图
  renderSwiper = () => {
    return this.state.swiperData.map((item, index) => (
      // eslint-disable-next-line jsx-a11y/alt-text
      <img
        src={`${IMG_BASE_URL}${item.imgSrc}`}
        key={item.id}
        onLoad={() => {
          // 窗口尺寸变化时->触发resize事件->重新设置动态高
          window.dispatchEvent(new Event("resize"));
          // this.setState({ imgHeight: 'auto', isLoaded: true})
          this.setState({
            isloaded: true
          });
        }}
      />
    ));
  };

  // 菜单
  rendercaidan = () => {
    const navs = [
      {
        id: 1,
        img: nav1,
        title: "整租",
        path: "/home/list"
      },
      {
        id: 2,
        img: nav2,
        title: "合租",
        path: "/home/list"
      },
      {
        id: 3,
        img: nav3,
        title: "地图找房",
        path: "/map"
      },
      {
        id: 4,
        img: nav4,
        title: "去出租",
        path: "/rent/add"
      }
    ];
    const navtag = navs.map(item => (
      <Flex.Item key={item.id}>
        <img src={item.img} alt="图片无法显示" />
        <p>{item.title}</p>
      </Flex.Item>
    ));
    return <Flex>{navtag}</Flex>;
  };

  // 租房小屋
  rendGroup = () => {
    return (
      <div className="group">
        <Flex className="group-title" justify="between">
          <h3>租房小组</h3>
          <span>更多</span>
        </Flex>

        <Grid
          data={this.state.groupData}
          columnNum={2}
          square={false}
          renderItem={item => {
            return (
              <Flex className="grid-item" justify="between">
                <div className="desc">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <img src={`${IMG_BASE_URL}${item.imgSrc}`} alt="" />
              </Flex>
            );
          }}
        />
      </div>
    );
  };

  // 资讯
  rendnews = () => {
    const newstag = this.state.newsData.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img className="img" src={`${IMG_BASE_URL}${item.imgSrc}`} alt="" />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ));
    return (
      <div className="news">
        <h3 className="group-title">最新资讯</h3>
        <WingBlank size="md">{newstag}</WingBlank>
      </div>
    );
  };

  // 顶部导航
  renderhome = () => {
    return (
      <NavBar
        mode="dark"
        icon={this.state.currentCity}
        onLeftClick={() => {
          // 跳转到选择城市页面
          this.props.history.push("/citylist");
        }}
        rightContent={[<Icon onClick={() => {
          this.props.history.push('/map')
        }} key="1" type="ellipsis" />]}
      >
        主页
      </NavBar>
    );
  };

  componentDidMount() {
    this.loadSwiper();
    this.loadGroup();
    this.loadNews();
    // 获取当前城市名称
     getcurrent().then(city => {
       this.setState({
        currentCity: city.label
      });
     })
    // let city = localStorage.getItem("hkzf_city");
    // if (city) {
    //   city = JSON.parse(city);
    //   this.setState({
    //     currentCity: city.label
    //   });
    // }
  }
  render() {
    return (
      <div className="tabbar menu">
        {/* 顶部导航 */}
        {this.renderhome()}

        {/* 顶部轮播图 */}
        <Carousel autoplay={this.state.isloaded} infinite>
          {this.renderSwiper()}
        </Carousel>

        {/* 菜单图标 */}
        {this.rendercaidan()}

        {/* 租房小组 */}
        {this.rendGroup()}

        {/* 最新资讯 */}
        {this.rendnews()}
      </div>
    );
  }
}
