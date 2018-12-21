const fs = require('fs')
const path = require("path");

// console.log(pages)

// 如何遍历所有js文件输出
// 1.根据 src/pages 获取根目录
// 2.根据根目录 fs.readdirSync 方法获取所有目录下子目录
// 3.递归使用 fs.readdirSync 方法获取所有目录

// 检索静态资源下的脚本
const jsPathRoot = 'src/pages'
// 参数为,获取根路径 D:\xx\yy\...
// 读取js文件目录,获取所有js文件
const allJs = readJSFile(jsPathRoot)
console.log(allJs)
const pages  = returnPages(allJs)
console.log(pages)
function returnPages(htmlWithJs) {
  const pages = {}
// 格式化生成入口
  Object.keys(htmlWithJs).forEach((file) => {
    // file字符串为 src/pages/.../index.css
    const fileSplit = file.split('/')
    const pageName = fileSplit[fileSplit.length-2]
    pages[pageName] = {
      entry: htmlWithJs[file],
      filename: file,
      template: 'public/index.html',
      title: `${pageName}页面`,
      chunks: ['chunk-vendors', 'chunk-common', pageName]
    }
  })
  return pages
}

function readJSFile(jsPathRoot) {
  const dirRoot = path.join(__dirname, jsPathRoot)
  const allJs = {}
  // 内部递归循环
  return (function copy(dir) {
    let scriptss = fs.readdirSync(dir)
    scriptss.forEach(function (file) {
      // 确定当前文件夹或js文件的根路径 D:\x\y\...
      let currentPath = path.join(dir, file);
      let stat = fs.lstatSync(currentPath);
      // 确定该路径是文件还是文件夹
      if (stat.isDirectory()) {
        copy(currentPath);
      } else {
        // 字符串是js文件地址时
        if (currentPath.includes('.js')) {
          // 根据 pages的根路径 和 js文件的根路径确定相对路径
          let resrcpath = path.relative(dirRoot, currentPath);
          // 上一行代码路径为 '\' ,转成 '/',以便读取
          resrcpath = resrcpath.replace(/\\/g, "/");
          const htmlRePath = resrcpath.replace('.js','.html')
          const lastRelativePath = jsPathRoot + '/' + resrcpath
          allJs[htmlRePath] = lastRelativePath
        }
      }
    })
    return allJs
  })(dirRoot)
}

module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? '/dist' : '/',
  pages,
  configureWebpack: config => {
    require('vux-loader').merge(config, {
      options: {},
      plugins: ['vux-ui']
    })
  }
}