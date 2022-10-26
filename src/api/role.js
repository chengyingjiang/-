import request from "@/utils/request";

export function getRole() {
  return request({
    url: "roles",
    method: "get",
  });
}

export function delRoleRight(data) {
  return request({
    url: `roles/${data.roleid}/rights/${data.rightid}`,
    method: "delete",
  });
}

export function setRoleRight(roleid, data) {
  return request({
    url: `roles/${roleid}/rights`,
    method: "post",
    data,
  });
}
