import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/login",
    method: "post",
    data,
  });
}

export function getUserData(data) {
  return request({
    url: "/users",
    method: "get",
    params: data,
  });
}

export function deleteUser(id) {
  return request({
    url: `users/${id}`,
    method: "delete",
  });
}

export function addUser(data) {
  return request({
    url: "users",
    method: "post",
    data,
  });
}

export function editUser(data) {
  return request({
    url: `users/${data.id}`,
    method: "put",
    data,
  });
}

export function setRoles(id, data) {
  return request({
    url: `users/${id}/role`,
    method: "put",
    data,
  });
}

export function putUserState(data) {
  return request({
    url: `users/${data.id}/state/${data.mg_state}`,
    method: "put",
  });
}
