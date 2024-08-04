import request from "./request";
import Api from "./api";
const Authorization = `Bearer ${localStorage.getItem("token")}`;
export const login = (data) => {
  return request({
    url: Api.login,
    method: "post",
    auth: data,
    data: data,
  });
};

export const region = () => {
  return request({
    baseURL: Api.prodApi,
    url: Api.region,
    method: "post",
    Authorization: Authorization,
  });
};
export const vehicleCountTime = (data) => {
  return request({
    baseURL: Api.prodApi,
    url: Api.vehicleCountTime,
    method: "post",
    data: data,
    Authorization: Authorization,
  });
};

export const vehicleType = () => {
  return request({
    baseURL: Api.prodApi,
    url: Api.vehicleType,
    method: "get",
    Authorization: Authorization,
  });
};

export const vehicleCountAll = (params) => {
  return request({
    baseURL: Api.prodApi,
    url: Api.vehicleCountAll,
    method: "get",
    Authorization: Authorization,
    params: params,
  });
};

export const vehicleCountGroup = (data) => {
  return request({
    baseURL: Api.prodApi,
    url: Api.vehicleCountGroup,
    method: "post",
    Authorization: Authorization,
    data,
  });
};

export const eventLog = (params) => {
  return request({
    baseURL: Api.prodApi,
    url: Api.log,
    method: "get",
    Authorization: Authorization,
    params,
  });
};
