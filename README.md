# 写个大家看的README

项目地址：[https://gitee.com/alfxjx/CNKI-HJXB-Crawler](https://gitee.com/alfxjx/CNKI-HJXB-Crawler)

## 环境安装

本爬虫需要的环境包括 [git](https://git-scm.com/downloads),[Node.js](https://nodejs.org/en/), 点击直接下载。直接安装即可。
推荐在[VS code](https://code.visualstudio.com/)中对本项目进行编辑。

在vs code中，按ctrl+\`, 打开命令行，选择`terminal`, 在命令行中输入 npm i, 安装依赖项。

> 推荐使用 nrm 切换到淘宝的镜像安装 相关的依赖。

安装nrm的方法： 在命令行中输入`npm i -g nrm`。

```bash
# 展示有哪些源镜像
nrm ls
# 选择镜像
nrm use taobao
```
> 推荐不自己安装依赖，因为exceljs有一个性能问题会导致生成大表excel文件时会报错，我的node_modules目录中已经修改了这个问题，但是直接安装的话需要修改一下，详见[#418](https://github.com/exceljs/exceljs/issues/418)

## 如何使用

在 package.json 中，有scripts对象，里面的语句对应了不同的爬虫操作。

### HJXB

使用`npm run HJXB` 爬取焊接学报的内容， 打开package.json可以看到对应的命令，最后的参数2013就是爬取2013年的数据了。

结束之后在命令行界面Ctrl+c即可退出。

`npm run HJXB:analysis`对之前爬取的信息进行分析,`npm run HJXB:getAbs` 获取对应文章的摘要和作者知网节信息；

最后调用`npm run HJXB:out` 将所得的数据导出成excel。