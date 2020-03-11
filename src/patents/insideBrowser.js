const pptr = require('puppeteer');
const data = require('./data.json');
const fs = require('fs');
let obj = data.data;

async function getInsideInfo(browser, link) {
	const page = await browser.newPage();
	await page.goto(link, {
		// 网络空闲说明已加载完毕
		waitUntil: 'networkidle2',
	});
	await page.waitFor(2000);
	let table = await page.$('#box');
	let res = await page.evaluate(table => {
		let list = table.querySelectorAll('.checkItem');
		let applyDateDom = table.querySelector('tbody > tr > td:nth-child(4)');
		let publishDateDom = table.querySelector('tbody > tr:nth-child(2) > td:nth-child(4)');
		return {
			abstract: list[10].innerText,
			applyDate: applyDateDom.innerText,
			publishDate: publishDateDom.innerText,
			applyNum: list[0].innerText,
			publishNum: list[1].innerText,
			applyName: list[2].innerText,
			inventor: list[4].innerText,
			mainClass: list[13].innerText,
		};
	}, table);
	await page.waitFor(2000);
	await page.close();
	return res;
}

pptr.launch({
	headless: true,
}).then(async browser => {
	// obj.length
	// 有一个不对 index： 762
	for (let i = 762; i < obj.length; i++) {
		let link = obj[i].link;
    let res = await getInsideInfo(browser, link);
    // TODO 重新跑一遍
		obj[i].abstract = res.abstract;
		obj[i].applyDate = res.applyDate;
		obj[i].publishDate = res.publishDate;
		obj[i].applyNum = res.applyNum;
		obj[i].publishNum = res.publishNum;
		obj[i].district = '中国';
		obj[i].disCode = 156;
		obj[i].applyName = res.applyName;
		obj[i].inventor = res.inventor;
		obj[i].mainClass = res.mainClass;
		obj[i].classType = '分类号';
		obj[i].source = 'IPC';
		console.log(`${i} saving...`);
		await save(obj, i);
	}
});

function save(data, index) {
	let data1 = JSON.stringify({ data: data }, '', '\t');
	fs.writeFileSync('./data.json', data1, err => {
		if (!err) {
			console.log(index + ' saved!');
		} else {
			console.log('error: ' + err);
		}
	});
}
