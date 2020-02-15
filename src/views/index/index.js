import React, { Component } from "react";
import { Carousel } from "antd-mobile";
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080'

export default class Index extends Component {
  state = {
    swiperData: [],
    isloaded: false
  };

  loadSwiper = async () => {
    let res = await axios.get('/home/swiper')
    console.log(res);
    this.setState({
      swiperData: res.data.body
    });
  }

  componentDidMount () {
    this.loadSwiper()
  }

  renderSwiper = () => {
    return this.state.swiperData.map((item, index) => (
      // eslint-disable-next-line jsx-a11y/alt-text
      <img
        src={`http://localhost:8080${item.imgSrc}`}
        key={item.id}
        onLoad={() => {
          // 窗口尺寸变化时->触发resize事件->重新设置动态高
          window.dispatchEvent(new Event("resize"));
          // this.setState({ imgHeight: 'auto', isLoaded: true})
          this.setState({
            isloaded: true
          })
        }}
      />
    ));
  };
  render() {
    return (
      <div>
        {/* 顶部轮播图 */}
        <Carousel autoplay={this.state.isloaded} infinite>
          {this.renderSwiper()}
        </Carousel>
      </div>
    );
  }
}
