/*
* 工具库
*
* */

/*
* 格式化 响应对象
* */
const responseBody = (status = '200', mess, data = null, other = null) => {
  return {status, mess, data, other}
}


module.exports = {
  responseBody
}
