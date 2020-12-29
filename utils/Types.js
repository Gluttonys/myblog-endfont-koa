/*
* 用于判断常见的类型
*
* */
const {firstLetterUpper} = require('./index')
const types = ['number', 'boolean', 'string', 'symbol']

const type = {}

types.forEach(el => {
  type[`is${firstLetterUpper(el)}`] = target => (typeof target === el)
})

module.exports = type
