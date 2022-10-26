import { getToken, setToken, removeToken, setTimeStamp } from "@/utils/auth";
import { login } from "@/api/user";
const state = {
  token: getToken(),
};

const actions = {
  login({ commit }, data) {
    return new Promise(function (resolve, reject) {
      login(data)
        .then((result) => {
          commit("setToken", result.token);
          setTimeStamp();
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  loginout({ commit }) {
    commit("removeToken");
  },
};

const mutations = {
  setToken(state, token) {
    state.token = token;
    setToken(token);
  },
  removeToken(state) {
    state.token = null;
    removeToken();
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
