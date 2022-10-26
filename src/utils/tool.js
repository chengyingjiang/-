// 递归查找所有的三级子节点的key值
// row--node 当前角色（该角色下所有的权限）  arr用来保存所有三级子节点的key值
export function getLeafkeys(node, arr) {
  // 如果node节点没有children属性，它就是三级子节点
  if (!node.children) {
    arr.push(node.id); //将当前节点的idpush到数组中
  } else {
    //不是三级子节点
    node.children.forEach((item) => {
      getLeafkeys(item, arr);
    });
  }
}
