const url = 'http://dbpub.cnki.net/GBSearch/SCPDGBSearch.aspx?ID=';
const data = require('./data.json');
const fs = require('fs');
let obj = data.data;

const pptr = require('puppeteer');

pptr.launch({
	headless: true,
}).then(async browser => {
	for (let i = 715; i < obj.length; i++) {
		let link = url + obj[i].applyNum;
		let lawState = await getLawState(link, browser, i);
    obj[i].lawState = lawState; 
    await save(obj)
	}
});

async function getLawState(link, browser, index) {
	let page = await browser.newPage();
	await page.goto(link, {
		waitUntil: 'networkidle2',
	});
	await page.waitFor(1000);
	let table = await page.$('.state');
	let state = await page.evaluate(table => {
		let len = table.querySelectorAll('tbody > tr').length;
		let dom = table.querySelector(`tbody > tr:nth-child(${len - 1}) >td:nth-child(2)`);
		return dom.innerText;
	}, table);
	console.log(`${index} get state: ${state}`);
	await page.waitFor(2000);
	await page.close();
	return state;
}

function save(data) {
	let data1 = JSON.stringify({ data: data }, '', '\t');
	fs.writeFileSync('./data.json', data1, err => {
		if (!err) {
			console.log('saved!');
		} else {
			console.log('error: ' + err);
		}
	});
}