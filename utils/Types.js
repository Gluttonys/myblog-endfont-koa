/*
* 用于判断常见的类型
* */
class Types {

  type = ['String', 'Object', 'Function', 'Symbol', 'Undefined', 'Null', 'Number']

  constructor() {
    this.type.forEach(type => {
      this[`is${type}`] = target => typeof target === type.toLowerCase()
    })
  }
}

module.exports = new Types()
