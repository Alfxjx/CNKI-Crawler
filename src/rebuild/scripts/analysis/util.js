// 将data里面的数据正规化
module.exports = function SecondSplit(strIn) {
  let str = JSON.stringify(strIn);
  // console.log(str);
  let arr0 = str.split("\\n");
  let res = {};
  res.title = arr0[0].slice(1);
  // let names = '';
  // if (arr0.length == 3) {
  //   names = arr0[1].split(";").slice(0, names.length - 1);
  //   let nameTmp = [];
  //   names.forEach((name) => {
  //     nameTmp.push({
  //       name: name,
  //       field: "",
  //       code: "",
  //     });
  //   });
  //   res.name = nameTmp;
  // }
  let linkArr = arr0[arr0.length - 1].split("&");
  let link = linkArr[1].replace(/\"/i, "");
  let year = link.slice(4,8);
  res.year = year;
  res.link = `http://kns.cnki.net/kcms/detail/detail.aspx?dbcode=CJFD&filename=${link}&dbname=CJFD${year}`;
  let pages = linkArr[0].split("+");
  let pageArr = pages[0].split("-");
  res.start = pageArr[0];
  res.end = pageArr[1];
  return res;
}