import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:4444/api/"
});

const setAuthHeader = token => {
  instance.defaults.headers["Authorization"] = `JWT ${token}`;
};

const deleteAuthHeader = () => {
  instance.defaults.headers["Authorization"] = undefined;
};

const getMe = () => {
  return instance.get("accounts/me").then(res => res.data.account.user);
};

const login = user => {
  return instance.post(`accounts/login`, user).then(res => res.data);
};

const register = user => {
  return instance.post(`accounts/register`, user);
};

const confirm = id => {
  return instance.put(`confirmations/${id}/register`).then(res => res.data);
};

const fetchApps = () => {
  return instance.get("devery").then(res => res.data);
};

const fetchAppByAddress = address => {
  return instance.get(`devery/${address}`).then(res => res.data);
};

export default {
  setAuthHeader,
  login,
  deleteAuthHeader,
  register,
  confirm,
  getMe,
  fetchAppByAddress,
  fetchApps
};
