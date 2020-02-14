import React, { Component } from "react";
import { Carousel } from "antd-mobile";

export default class Index extends Component {
  state = {
    swiperData: [{
        imgSrc: "AiyWuByWklrrUDlFignR"
      },{
        imgSrc: "TekJlZRVCjLFexlOCuWn"
      },{
        imgSrc: "IJOtIlfsYdTyaDTRVrLI"
      }]
  }

  renderSwiper = () => {
    return this.state.swiperData.map((item, index) => (
      // eslint-disable-next-line jsx-a11y/alt-text
      <img
        src={`https://zos.alipayobjects.com/rmsportal/${item.imgSrc}.png`}
        key={index}
      />
    ));
  };
  render() {
    return (
      <div>
        {/* 顶部轮播图 */}
        <Carousel
        autoplay
        infinite
        >
          {this.renderSwiper()}
        </Carousel>
      </div>
    );
  }
}
