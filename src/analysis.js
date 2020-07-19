const out2010S = require("./output2010");
const out2011S = require("./output2011");
const out2012S = require("./output2012");
const out2013S = require("./output2013");
const fs = require("fs");
// console.log(out2014.length);
// console.log(out2015.length);

// let arr = out2014.concat(out2015);
let out2010 = out2010S;
let out2011 = out2011S;
let out2012 = out2012S;
let out2013 = out2013S;

while (out2010.some(Array.isArray)) {
  out2010 = [].concat(...out2010);
}

while (out2011.some(Array.isArray)) {
  out2011 = [].concat(...out2011);
}

while (out2012.some(Array.isArray)) {
  out2012 = [].concat(...out2012);
}

while (out2013.some(Array.isArray)) {
  out2013 = [].concat(...out2013);
}

console.log("type: " + typeof out2010); // TODO object????
console.log("typeof arr[0]: " + typeof out2010[0]);
console.log(out2010.length);
console.log("arr[0] = " + JSON.stringify(out2010[0]));

// fs.writeFileSync('data.txt', JSON.stringify(out2010), () => {});

// const url2014 = `http://kns.cnki.net/kcms/detail/detail.aspx?dbcode=CJFD&filename=${paperID}&dbname=CJFD2014`;
// const url2015 = `http://kns.cnki.net/kcms/detail/detail.aspx?dbcode=CJFD&filename=${paperID}&dbname=CJFDLAST2015`;

// const sample = '5052铝合金/镀锌钢涂粉CO2激光熔钎焊工艺特性\n樊丁;蒋锴;余淑荣;张健;\n1-4+113&HJXB201401001';

function SecondeSplit(arr, year) {
  let str = JSON.stringify(arr);
  console.log("str" + str);

  let nArr = str.split("\\n");
  console.log("nArr" + nArr);

  // 0 title
  // 1 string authors
  // 2 pages and link
  let res = {};
  res.title = nArr[0].replace(/\"/i, "");
  let names = nArr[1].split(";");
  res.name = names.slice(0, names.length - 1);
  if (nArr[2]) {
    let linkArr = nArr[2].split("&");
    let link = linkArr[1].replace(/\"/i, "");
    if (year === 2010) {
      res.link = `http://kns.cnki.net/kcms/detail/detail.aspx?dbcode=CJFD&filename=${link}&dbname=CJFD2010`;
    }
    if (year === 2015) {
      res.link = `http://kns.cnki.net/kcms/detail/detail.aspx?dbcode=CJFD&filename=${link}&dbname=CJFDLAST2015`;
    } else {
      res.link = `http://kns.cnki.net/kcms/detail/detail.aspx?dbcode=CJFD&filename=${link}&dbname=CJFD${year}`;
    }
    let pages = linkArr[0].split("+");
    let pageArr = pages[0].split("-");
    res.start = pageArr[0];
    res.end = pageArr[1];
  }
  return res;
}
// console.log(SecondeSplit(arr[0]));

// 保存的数据
let ret2010 = [];
out2010.forEach((i) => {
  let tmp = SecondeSplit(i, 2010);
  ret2010.push(tmp);
});
let ret2011 = [];
out2011.forEach((i) => {
  let tmp = SecondeSplit(i, 2011);
  ret2010.push(tmp);
});
let ret2012 = [];
out2012.forEach((i) => {
  let tmp = SecondeSplit(i, 2012);
  ret2010.push(tmp);
});
let ret2013 = [];
out2013.forEach((i) => {
  let tmp = SecondeSplit(i, 2013);
  ret2010.push(tmp);
});

console.log(ret2010[0]);

let ret = ret2010.concat(ret2011, ret2012, ret2013);

fs.writeFileSync("ret.txt", ret, (err) => {
  console.log(err);
});

let jsonObj = {};

jsonObj.data = ret;

let wObj = JSON.stringify(jsonObj, "", "\t");

fs.writeFile("data2010to2013.json", wObj, (err) => {
  console.log(err);
});
