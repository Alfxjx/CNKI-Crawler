const cheerio = require('cheerio');
const fs = require('fs');
const htmlDom = fs.readFileSync('./data.html', { encoding: 'utf-8' });
// Usage as of htmlparser2 version 3:
const htmlparser2 = require('htmlparser2');
const dom = htmlparser2.parseDOM(JSON.stringify(htmlDom));
const $ = cheerio.load(dom);
// load the HTML data
$.html();
console.log(`there are ${$('tbody').length} pages.`);
const pages = $('tbody');
const pageLen = pages.length;
console.log(
	$('tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)')
		.children()
		.text()
);
const data = [];

// pages.length
for (let i = 0; i < pageLen; i++) {
	const rows = $(`tbody:nth-child(${i+1}) > tr`);
	// rows.length
	for (let j = 1; j < rows.length; j++) {
		let cols = $(`tbody:nth-child(${i+1}) > tr:nth-child(${j+1}) > td`);
		let obj = {};
		obj.index = $(`tbody:nth-child(${i+1}) > tr:nth-child(${j+1}) > td:nth-child(1)`).text();
		obj.title = $(`tbody:nth-child(${i+1}) > tr:nth-child(${j+1}) > td:nth-child(2)`)
			.children()
			.text();
		let href = $(`tbody:nth-child(${i+1}) > tr:nth-child(${j+1}) > td:nth-child(2)`)
			.children()
			.attr('href');
		console.log('title: ' + obj.title);
		console.log(href);
    const reg = /filename=(\w+)/i;
    if(!href){
      obj.id = '';
    } else {
      obj.id = reg.exec(href)[1];
    }
		obj.name = $(`tbody:nth-child(${i+1}) > tr:nth-child(${j+1}) > td:nth-child(3)`).text();
		obj.company = $(`tbody:nth-child(${i+1}) > tr:nth-child(${j+1}) > td:nth-child(4)`).text();
		obj.requestDate = $(`tbody:nth-child(${i+1}) > tr:nth-child(${j+1}) > td:nth-child(5)`).text();
		obj.publishDate = $(`tbody:nth-child(${i+1}) > tr:nth-child(${j+1}) > td:nth-child(6)`).text();
		console.log(obj);
		data.push(obj);
	}
}

function save(data) {
	let data1 = JSON.stringify({ data: data }, '', '\t');
	fs.writeFile('./data1.json', data1, err => {
		console.log('error: ' + err);
	});
}

save(data);
