let data = {};
const journal = process.argv.slice(2)[0];
const data0 = require(`../../data/analysis/${journal}.json`);
if (process.argv.slice(2).length !== 1) {
	let year = process.argv.slice(2)[1];
	const data1 = require(`../../data/analysis/${journal}-${year}.json`);
	data = data1;
} else {
	data = data0;
}
const puppeteer = require('puppeteer');
const fs = require('fs');

puppeteer
	.launch({
		headless: true,
	})
	.then(async (browser) => {
		let len = data.data.length;
		// TODO CHECK from 0 HSJJ 到601了 下次跑school-HSJJ的时候
		for (let i = 0; i < len; i++) {
			let author = data.data[i].author;
			if (!author) {
				console.log('undefined author');
			} else {
				if (author.length == 0) {
					console.log(`no author for ${data.data[i].title}`);
				}
				for (let j = 0; j < author.length; j++) {
					let item = author[j];
					let link = '';
					if (item.field && item.name && item.code) {
						link = `https://kns.cnki.net/kcms/detail/knetsearch.aspx?sfield=${item.field}&skey=${item.name}&code=${item.code}`;
						let school = await getSchool(link, browser);
						console.log(`${i}-${j}-${school}`);
						author[j].school = school;
					} else {
						console.log("no name/field/code error")
					}

				}
				await save(data);
			}
		}
	});

async function getSchool(link, browser) {
	const page = await browser.newPage();
	await page.goto(link);
	await page.waitFor(3000);
	let schoolDom = await page.$('.orgn');
	let school = '';
	if (schoolDom) {
		school = await page.evaluate((schoolDom) => {
			return schoolDom.innerText;
		}, schoolDom)
	}
	await page.waitFor(1000);
	await page.close();
	return school;
}

function save(data) {
	let data1 = JSON.stringify(data, '', '\t');
	if (process.argv.slice(2).length !== 1) {
		let year = process.argv.slice(2)[1];
		fs.writeFileSync(`src/rebuild/data/analysis/${journal}-${year}.json`, data1, (err) => {
			console.log('error: ' + err);
		});
	} else {
		fs.writeFileSync(`src/rebuild/data/analysis/${journal}.json`, data1, (err) => {
			console.log('error: ' + err);
		});
	}
	console.log('saved');
}
