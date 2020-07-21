const data = require('../../data/analysis/HJXB.json');
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
		for (let i = 0; i < 2; i++) {
      const res = await getAbstract(data.data[i].link, browser);
      console.log(`${i}: ${res.keywords.slice(0,5)}-${res.abstract.slice(0,5)}`);
			data.data[i].abstract = res.abstract;
			data.data[i].keywords = res.keywords;
		}
	})
	.then(() => {
		console.log('获取信息完成！');
    save(data);
    console.log('保存成功！')
	});

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
	await page.waitFor(3000);
	await page.close();
	return {
		abstract: abstract,
		keywords: keys,
	};
}

function save(data) {
	let data1 = JSON.stringify(data, '', '\t');
	fs.writeFileSync('src/rebuild/data/analysis/HJXB.json', data1, (err) => {
		console.log('error: ' + err);
	});
}
