import React from "react";

import { Flex } from "antd-mobile";

import styles from "./index.module.css";

// 条件筛选栏标题数组：
const titleList = [
  { title: "区域", type: "area" },
  { title: "方式", type: "mode" },
  { title: "租金", type: "price" },
  { title: "筛选", type: "more" }
];

export default function FilterTitle(props) {
  const { menuStatus, changeStatus } = props;
  let menutag = titleList.map(item => {
    // 获取当前菜单的高亮状态
    let mstatus = menuStatus[item.type];
    let cls = [styles.dropdown, mstatus ? styles.selected : ""].join(" ");
    return (
      <Flex.Item data-type={item.type} key={item.type}>
        <span
          className={cls}
          onClick={() => {
            // 单击时控制菜单选中,控制父组件menuStatus状态变化
            changeStatus(item.type);
          }}
        >
          <span>{item.title}</span>
          <i className="iconfont icon-arrow" />
        </span>
      </Flex.Item>
    );
  });
  return (
    <Flex align="center" className={styles.root}>
      {menutag}
    </Flex>
  );
}
