import React, { Component } from "react";
import { Flex, WingBlank, WhiteSpace, NavBar, Toast } from "antd-mobile";
import { Link } from "react-router-dom";
import styles from "./index.module.css";
import request from "../utils/api.js";
import { withFormik } from "formik";

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  // state = {
  //   username: '',
  //   password: ''
  // }

  // handleItem = (e) => {
  //   this.setState({
  //     [e.target.name]: e.target.value
  //   })
  // }

  // handleSubmit = async (e) => {
  //   // 禁止表单的默认提交行为
  //   e.preventDefault()
  //   const res = await request({
  //     method: 'post',
  //     url: '/user/login',
  //     data: {
  //       username: this.state.username,
  //       password: this.state.password
  //     }
  //   })
  //   if (res.status === 200) {
  //     // 登录成功，缓存token,跳转到主页
  //     sessionStorage.setItem('mytoken', res.body.token)
  //     this.props.history.push('/home')
  //   } else {
  //     // 登录失败
  //     Toast.info(res.description, 1)
  //   }
  // }

  render() {
    // const { username, password } = this.state
    let { values, handleChange, handleSubmit } = this.props;
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavBar className={styles.navHeader} mode="dark">
          账号登录
        </NavBar>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form>
            <div className={styles.formItem}>
              <input
                value={values.username}
                onChange={handleChange}
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <input
                value={values.password}
                onChange={handleChange}
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button
                onClick={handleSubmit}
                className={styles.submit}
                type="button"
              >
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    );
  }
}

// export default Login
export default withFormik({
  mapPropsToValues: () => ({ username: "", password: "" }),
  handleSubmit: async (values, login) => {
    // 参数一表示表单数据；参数二表示组件的实例对象
    // 提交表单
    const res = await request({
      method: "post",
      url: "/user/login",
      data: {
        username: values.username,
        password: values.password
      }
    });
    if (res.status === 200) {
      // 登录成功，缓存token,跳转到主页
      sessionStorage.setItem("mytoken", res.body.token);
      login.props.history.push("/home");
    } else {
      // 登录失败
      Toast.info(res.description, 1);
    }
  }
})(Login);
