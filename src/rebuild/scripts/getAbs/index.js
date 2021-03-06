const journal = process.argv.slice(2)[0];
const data0 = require(`../../data/analysis/${journal}.json`);
let data = {};
if(process.argv.slice(2).length!==1){
  let year = process.argv.slice(2)[1];
  const data1 = require(`../../data/analysis/${journal}-${year}.json`);
  data = data1;
} else {
  data = data0;
}
const fs = require('fs');
const puppeteer = require('puppeteer');

// let data = obj;
const len = data.data.length;
console.log(`data的长度${len}`);
console.log('开始获取摘要信息...');

puppeteer
	.launch({
		headless: true,
	})
	.then(async (browser) => {
		// TODO from 0
		for (let i = 15; i < len; i++) {
			const res = await getAbstract(data.data[i].link, browser);
			console.log(`${i}: ${res.keywords.slice(0, 5)}-${res.abstract.slice(0, 5)}`);
			data.data[i].abstract = res.abstract;
			data.data[i].keywords = res.keywords;
      data.data[i].author = res.authorInfo;
      data.data[i].school = res.school;
			await save(data);
		}
	})
	.then(() => {
		console.log('获取信息完成！');
		save(data);
		console.log('保存成功！');
	});

// 获取摘要、关键词和对应作者的领域与code
async function getAbstract(link, browser) {
	const page = await browser.newPage();
	await page.goto(link);
	await page.waitFor(3000);
	// 摘要
	let abs = await page.$('#ChDivSummary');
	let abstract = '';
	if (abs) {
		abstract = await page.evaluate((abs) => {
			return abs.innerText;
		}, abs);
	}
	// TODO HAJA期刊有不少没有单位的，所以也保存一下单位列表
	let schoolDOM = await page.$('.orgn');
	let school = '';
	if (schoolDOM) {
		school = await page.evaluate((schoolDOM) => {
			let arr = schoolDOM.querySelectorAll('span > a');
			let res = '';
			arr.forEach((i) => {
				res += i.text + ',';
			});
			return res.slice(0, res.length - 1);
		}, schoolDOM);
	}
	// 关键词
	let keysDOM = await page.$('#catalog_KEYWORD');
	let keys = '';
	if (keysDOM) {
		keys = await page.evaluate((keysDOM) => {
			let arr = keysDOM.parentNode.children;
			let res = '';
			for (let j = 1; j < arr.length; j++) {
				res += arr[j].text.replace(/ /g, '').replace(/\n/g, '');
			}

			return res;
		}, keysDOM);
	}
	// field & code for each author
	let authorDom = await page.$('.author');
	let authorInfo = [];
	if (authorDom) {
		authorInfo = await page.evaluate((authorDom) => {
			let input = [];
			let arr = authorDom.children;
			if (arr.length != 0) {
				for (let i = 0; i < arr.length; i++) {
          // 删掉邮箱
					let name = arr[i].children[0]?arr[i].children[0].text:'';
					const reg = /'(\S+)','([\S\s]+)','(\d+)'/g;
					let str = reg.exec(arr[i].innerHTML);
					let field = '';
					let code = '';
					if (str !== null) {
						field = str[1];
						code = str[3];
					}
					input.push({
						name: name,
						field: field,
						code: code,
					});
				}
			}
			return input;
		}, authorDom);
	}
	await page.waitFor(3000);
	await page.close();
	return {
		abstract: abstract,
		keywords: keys,
		authorInfo: authorInfo,
		school: school,
	};
}

function save(data) {
	let data1 = JSON.stringify(data, '', '\t');
	if(process.argv.slice(2).length!==1){
    let year = process.argv.slice(2)[1];
    fs.writeFileSync(`src/rebuild/data/analysis/${journal}-${year}.json`, data1, (err) => {
      console.log('error: ' + err);
    });
  } else {
    fs.writeFileSync(`src/rebuild/data/analysis/${journal}.json`, data1, (err) => {
      console.log('error: ' + err);
    });
  }
}
