const fs = require('fs')
/*
* 博客地址 ：
* https://www.jmjc.tech/less/120
* */

module.exports = {
  loadRouter(path, router, app, rootPath) {
    let urls = fs.readdirSync(rootPath + `/${path}`)
    urls.forEach(element => {
      let module = require(rootPath + `/${path}/` + element)
      router.use('/' + element.replace('.js', ''), module.routes(), module.allowedMethods())
    })
    app.use(router.routes())
  }
}




