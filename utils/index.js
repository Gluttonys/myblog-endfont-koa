/*
* 工具库
*
* */

/*
* 首字母大写
* */

const firstLetterUpper = target => (
  typeof target === 'string' && target.slice(0, 1).toUpperCase() + target.slice(1)
)


module.exports = {
  firstLetterUpper
}
