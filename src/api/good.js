import request from "@/utils/request";

export function getGoodsList(data) {
  return request({
    url: "goods",
    method: "get",
    params: data,
  });
}

export function addGoods(data) {
  return request({
    url: "goods",
    method: "post",
    data,
  });
}

export function getGoodsCate(data) {
  return request({
    url: "categories",
    method: "get",
    params: data,
  });
}

export function getParamsList(id, data) {
  return request({
    url: `categories/${id}/attributes`,
    method: "get",
    params: data,
  });
}

export function saveParams(id, data) {
  return request({
    url: `categories/${id}/attributes/${data.attr_id}`,
    method: "put",
    data,
  });
}

export function saveParamsList(id, data) {
  return request({
    url: `categories/${id}/attributes`,
    method: "post",
    data,
  });
}

export function addCate(data) {
  return request({
    url: "categories",
    method: "post",
    data,
  });
}

export function delCate(id) {
  return request({
    url: `categories/${id}`,
    method: "delete",
  });
}
