# 写给大家看的README

**本项目仅供学习使用！！！**

**gitee更新的快一点，项目地址**：[https://gitee.com/alfxjx/CNKI-HJXB-Crawler](https://gitee.com/alfxjx/CNKI-HJXB-Crawler)

## 环境安装

本爬虫需要的环境包括 [git](https://npm.taobao.org/mirrors/git-for-windows/v2.27.0.windows.1/),[Node.js](https://nodejs.org/en/), 点击直接下载。直接安装即可。
推荐在[VS code](https://code.visualstudio.com/)中对本项目进行编辑。

在vs code中，按ctrl+\`, 打开命令行，选择`terminal`, 在命令行中输入 npm i, 安装依赖项。

使用 nrm 切换到淘宝的镜像安装 相关的依赖。

安装nrm的方法： 在命令行中输入`npm i -g nrm`。

> 推荐用 cnpm 避免下载源被墙 `cnpm i`

```bash
# 展示有哪些源镜像
nrm ls
# 选择镜像
nrm use taobao
```
> 推荐不自己安装依赖，因为exceljs有一个性能问题会导致生成大表excel文件时会报错，我的node_modules目录中已经修改了这个问题，但是直接安装的话需要修改一下，详见[#418](https://github.com/exceljs/exceljs/issues/418)

## 如何使用

在 package.json 中，有scripts对象，里面的语句对应了不同的爬虫操作。

1. `npm run crawler`
2. `npm run analysis`
3. `npm run abstract`
4. `npm run school`
5. `npm run excel`

使用时直接在后面添加参数 第一个参数是期刊缩写（见下面），第二个参数是可选参数，不写就直接是2010-2013年的，如果写参数就是对应的某一年。

### examples

1. `npm run crawler HJXB` 表示爬取2010-2013 的焊接学报
2. `npm run abstract HJXB 2019` 表示获取2019年的焊接学报的摘要等信息

### 缩写

HJXB 焊接学报
HAJA 焊接
HSJJ 焊接技术
DHJI 电焊机
HGZZ 焊管

## Q&A

要是报错了不用紧张，看一下报错信息，检查一下具体的报错内容，然后百度一下原因，90%的问题可以百度解决，99%搜谷歌可以解决。

## BUG

1. 焊接技术有S1期(2010,2011年 不能覆盖到)
