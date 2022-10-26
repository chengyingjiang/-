import request from "@/utils/request";

export function getRight(type) {
  return request({
    url: `rights/${type}`,
    method: "get",
  });
}
