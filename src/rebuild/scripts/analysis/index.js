const journal = process.argv.slice(2)[0];
// 引入之前爬取的数据，要是没有文件就不引入。
const data2010 = require(`../../data/crawler/output-${journal}-2010.json`);
const data2011 = require(`../../data/crawler/output-${journal}-2011.json`);
const data2012 = require(`../../data/crawler/output-${journal}-2012.json`);
const data2013 = require(`../../data/crawler/output-${journal}-2013.json`);
const SecondSplit = require('./util')
const fs = require("fs");
let data = [];

if(process.argv.slice(2).length!==1){
  let year = process.argv.slice(2)[1];
  const data1 = require(`../../data/crawler/output-${journal}-${year}.json`);
  data = [].concat(...data1.data);
} else {
  data = [].concat(...data2010.data, ...data2011.data,...data2012.data, ...data2013.data);
}
// let data = [].concat(...data2010.data, ...data2011.data,...data2012.data, ...data2013.data);
// data[i] = '铜铝套管挤压电阻焊接原理及微观结构分析\n赵越;左铁军;凌勇;左轲;王昕;\n101-104+118&HJXB201301025',
console.log(`数据长度${data.length}`);
let ret = [];
data.forEach((item) => {
  let tmp = SecondSplit(item);
  ret.push(tmp);
});

let jsonObj = {};

jsonObj.data = ret;

let wObj = JSON.stringify(jsonObj, "", "\t");

if(process.argv.slice(2).length!==1){
  let year = process.argv.slice(2)[1];
  fs.writeFileSync(`src/rebuild/data/analysis/${journal}-${year}.json`, wObj, (err) => {
    console.error(err);
  });
} else {
  fs.writeFileSync(`src/rebuild/data/analysis/${journal}.json`, wObj, (err) => {
    console.error(err);
  });
}

console.log('分析完成！')
