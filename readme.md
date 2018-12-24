## 该demo基于vue-cli3.0，可以用于移动端的多页面开发
> vue-cli3.0 是当前最新版本的vue官方脚手架，和vue-cli2 相比文件夹更为精简同时功能也更多详情可参见[官方文档](https://cli.vuejs.org/zh/guide/)
> 
> 同时在阅读了大漠老师的文章[《如何在Vue项目中使用vw实现移动端适配》](https://www.w3cplus.com/mobile/vw-layout-in-vue.html)后，该脚手架使用了vw布局，具体详情可参见上文

### 构建步骤
```
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run serve

# build for production with minification
npm run build

```

### 如何完成自动编译输出多页面

> 主要依靠于循环递归遍历获取js文件目录，之后再输出相同的html目录格式 


**核心代码(vue.config.js)**

```js
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

```

> 附录: 因为目录结构过多，且没有做主页面，npm run serve 后打开
> `localhost:8080/customer/activity/activity_detail/activity_detail.html`
> 可查看效果
