import axios from "axios";
import store from "@/store";
import { getTimeStamp } from "@/utils/auth";
import router from "@/router";
import { Message } from "element-ui";
const TimeOut = 3600;

function isCheckTimeOut() {
  var currentTime = Date.now();
  var timeStamp = getTimeStamp();
  return (currentTime - timeStamp) / 1000 > TimeOut;
}

const request = axios.create({
  baseURL: "http://123.57.143.201:8888/api/private/v1/",
  timeout: 3000,
});

request.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      if (isCheckTimeOut()) {
        store.dispatch("user/loginout");
        router.push("/login");
        return Promise.reject(new Error("token超时了"));
      }
      config.headers["Authorization"] = store.getters.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    // axios默认加了一层data
    const {
      data,
      meta: { msg, status },
    } = response.data;

    if (status == 200 || status == 201) {
      // 响应成功的数据
      return data;
    } else {
      Message.error(msg);
      // 不进then直接进catch
      return Promise.reject(new Error(msg));
    }
  },
  (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.status == 10002
    ) {
    } else {
      Message.error(error.message); //提示错误信息
    }
    return Promise.reject(error); //返回执行错误，让当前的执行链跳出成功，直接进入catch
  }
);

export default request;
