const obj = require('../data1.json');
const fs = require('fs');
const puppeteer = require('puppeteer');

let data = obj;

console.log(`data的长度${data.data.length}`);
console.log('开始获取摘要信息...');

const len = data.data.length;
// const len = 1;
puppeteer
	.launch({
		headless: true,
	})
	.then(async browser => {
		// 0-30-53-90
		for (let i = 19; i < 27; i++) {
			if (data.data[i].link) {
				const res = await getAbstract(i, data.data[i].link, browser);
				console.log(i + ': ' + res.keywords);
				data.data[i].abstract = res.abstract;
				data.data[i].school = res.school;
				data.data[i].keywords = res.keywords;
			}
		}
	})
	.then(() => {
		console.log('获取信息完成！');
		// console.log(data.data[0].abstract);
		save(data);
	});

async function getAbstract(num, link, browser) {
	const page = await browser.newPage();
	await page.goto(link);
	await page.waitFor(3000);
	// await page.screenshot({ path: `${num}-screenshot.png` });
	// await page.close();
	let abs = await page.$('#ChDivSummary');
	let abstract = await page.evaluate(abs => {
		return abs.innerText;
	}, abs);

	let schoolDOM = await page.$('.orgn');
	let school = await page.evaluate(schoolDOM => {
		let arr = schoolDOM.querySelectorAll('span > a');
		let res = '';
		arr.forEach(i => {
			res += i.text + ',';
		});
		return res.slice(0, res.length - 1);
	}, schoolDOM);
	let keysDOM = await page.$('#catalog_KEYWORD');
	let keys = await page.evaluate(keysDOM => {
    // let arr = keysDOM.querySelectorAll('p')[2].querySelectorAll('a');
    let arr = keysDOM.parentNode.children;
    let res = '';
    for(let j=1;j<arr.length;j++){
      res += arr[j].text.replace(/ /g, '').replace(/\n/g, '');
    }
		// arr.forEach(i => {
		// 	res += i.text.replace(/ /g, '').replace(/\n/g, '');
		// });
		return res;
	}, keysDOM);
	await page.waitFor(3000);
	await page.close();
	return {
		abstract: abstract,
		school: school,
		keywords: keys,
	};
}

function save(data) {
	let data1 = JSON.stringify(data, '', '\t');
	fs.writeFile('data1.json', data1, err => {
		console.log('error: ' + err);
	});
}
