import request from "@/utils/request";

export function getOrders(data) {
  return request({
    url: "orders",
    method: "get",
    params: data,
  });
}

export function getlogistics(id, data) {
  return request({
    url: `orders/${id}`,
    method: "get",
    params: data,
  });
}
