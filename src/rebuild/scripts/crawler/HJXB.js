const puppeteer = require("puppeteer");
const fs = require("fs");

const url = "https://navi.cnki.net/knavi/JournalDetail?pcode=CJFD&pykm=HJXB";
const TIME = 3000;

let yearFromArg = process.argv.slice(2)[0];

// 2010_Year_Issue 返回ID类型
function getID(year) {
  let num = year - 2010;
  return `#\\0032\\0030\\0031\\003${num}\\005f\\0059\\0065\\0061\\0072\\005f\\0049\\0073\\0073\\0075\\0065`;
}

function getNoDotID(year, num) {
  let _num = num < 10 ? `0${num}` : `${num}`;
  return `#yq${year}${_num}`;
}

(async () => {
  const browser = await puppeteer.launch({
    // headless: false, // false浏览器界面启动
    slowMo: 100, // 放慢浏览器执行速度，方便测试观察
    args: [
      // 启动 Chrome 的参数
      "–no-sandbox",
      // '--window-size=1280,960',
    ],
  });

  const page = await browser.newPage();

  await page.goto(url, {
    // 网络空闲说明已加载完毕
    waitUntil: "networkidle2",
  });
  console.log("page加载完成！");
  // 年份点击事件
  let yearNum = yearFromArg;
  const yearBtn = await page.$(getID(yearNum));
  await yearBtn.click();
  // wait
  await page.waitFor(TIME);
  let accNum = 1;
  let output = [];
  while (accNum < 13) {
    let NoDot = await page.$(getNoDotID(yearNum, accNum));
    NoDot.click();
    // const SomePaperList = await page.$('#CataLogContent');
    // 保存所有的信息
    await page.waitFor(TIME);

    console.log("选择列表..." + accNum);
    const list = await page.$("#CataLogContent");
    const items = await list.$$("dd");
    // for (let item of items) {
    // 	let itemBtn = await item.$('.btn-view > a');
    // 	await itemBtn.click();
    // 	await page.waitFor(TIME);
    // 	console.log(browser.pages.length);
    // }
    const res = await page.evaluate((list) => {
      const itemList = list.querySelectorAll("dd");
      let arr = [];
      // console.log(itemList);
      for (let item of itemList) {
        const getPaperId = function (id) {
          let match = /filename=(\w+)&/i.exec(id);
          return match[1];
        };
        let paperID = item.querySelector(".opts > .btn-view >a").href;
        let id = getPaperId(paperID);
        let content = item.innerText + "&" + id;
        arr.push(content);
      }
      return arr;
    }, list);
    output.push(res);
    accNum++;
  }
  console.log(output.length);
  // 直接复制 粘贴到src目录下
  let jsonObj = {};
  jsonObj.data = output;
  fs.writeFileSync(
    `src/rebuild/data/crawler/output${yearNum}.json`,
    JSON.stringify(jsonObj, "", "\t"),
    (err) => {
      console.error("save error");
    }
  );
  console.log('保存成功！')
})();
