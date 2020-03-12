const cheerio = require('cheerio');
const fs = require('fs');
const htmlDom = fs.readFileSync('./data10.html', { encoding: 'utf-8' });
// Usage as of htmlparser2 version 3:
const htmlparser2 = require('htmlparser2');
const dom = htmlparser2.parseDOM(JSON.stringify(htmlDom));
const $ = cheerio.load(dom);
// load the HTML data
$.html();
console.log(`there are ${$('tbody').length} pages.`);
const pages = $('tbody');
const pageLen = pages.length;
// console.log(
// 	$('tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)')
// 		.children()
// 		.text()
// );
const data = [];

// pages.length
for (let i = 0; i < pageLen; i++) {
	const rows = $(`tbody:nth-child(${i + 1}) > tr`);
	console.log(rows.length);
	// rows.length
	for (let j = 1; j < rows.length; j++) {
		let cols = $(`tbody:nth-child(${i + 1}) > tr:nth-child(${j + 1}) > td`);
		let obj = {};
		let href = $(`tbody:nth-child(${i + 1}) > tr:nth-child(${j + 1}) > td:nth-child(2)`)
			.children()
			.attr('href');
		// console.log('title: ' + obj.title);
		// console.log(href);
		const reg = /filename=(\w+)/i;
		const reg2 = /dbcode=(\w+)/i;
		const reg3 = /dbname=(\w+)/i;
		if (!href) {
			obj.id = '';
		} else {
			obj.id = reg.exec(href)[1];
			obj.dbname = reg3.exec(href)[1];
			obj.dbcode = reg2.exec(href)[1];
		}
		// $(`tbody:nth-child(${i+1}) > tr:nth-child(${j+1}) > td:nth-child(3)`).text()
		let name = $(`tbody:nth-child(${i + 1}) > tr:nth-child(${j + 1}) > td:nth-child(3)`).text();
		if (name.split(';').length === 1) {
			obj.link = `http://dbpub.cnki.net/grid2008/dbpub/detail.aspx?dbcode=${obj.dbcode}&dbname=${obj.dbname}&filename=${obj.id}`;
			obj.name = name.split(';');
			// console.log(name);
			data.push(obj);
		}
		// console.log(obj);
	}
}

console.log(data.length);

function save(data) {
	let data1 = JSON.stringify({ data: data }, '', '\t');
	fs.writeFile('./data2.json', data1, err => {
		console.log('error: ' + err);
	});
}

save(data);
