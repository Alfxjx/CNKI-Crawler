// 引入之前爬取的数据，要是没有文件就不引入。
const data2010 = require("../../data/crawler/output2010.json");
const data2011 = require("../../data/crawler/output2011.json");
const data2012 = require("../../data/crawler/output2012.json");
const data2013 = require("../../data/crawler/output2013.json");
const SecondSplit = require('./util')
const fs = require("fs");

let data = [].concat(...data2010.data, ...data2011.data,...data2012.data, ...data2013.data);
// data[i] = '铜铝套管挤压电阻焊接原理及微观结构分析\n赵越;左铁军;凌勇;左轲;王昕;\n101-104+118&HJXB201301025',

let ret = [];
data.forEach((item) => {
  let tmp = SecondSplit(item);
  ret.push(tmp);
});

let jsonObj = {};

jsonObj.data = ret;

let wObj = JSON.stringify(jsonObj, "", "\t");

fs.writeFileSync(`src/rebuild/data/analysis/HJXB.json`, wObj, (err) => {
  console.error(err);
});

console.log('分析完成！')
