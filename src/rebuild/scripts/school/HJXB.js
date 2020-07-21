const data = require('../../data/analysis/HJXB.json');
const puppeteer = require('puppeteer');
const fs = require('fs');

puppeteer
	.launch({
		headless: true,
	})
	.then(async (browser) => {
		let len = data.data.length;
		for (let i = 807; i < len; i++) {
			let author = data.data[i].author;
			if (!author) {
				console.log('undefined author');
			} else {
				if (author.length == 0) {
					console.log(`no author for ${data.data[i].title}`);
				}
				for (let j = 0; j < author.length; j++) {
					let item = author[j];
					let link = `https://kns.cnki.net/kcms/detail/knetsearch.aspx?sfield=${item.field}&skey=${item.name}&code=${item.code}`;
					let school = await getSchool(link, browser);
					console.log(`${i}-${j}-${school}`);
					author[j].school = school;
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
  if(schoolDom){
    school = await page.evaluate((schoolDom)=>{
      return schoolDom.innerText;
    },schoolDom)
	}
	await page.waitFor(1000);
  await page.close();
  return school;
}

function save(data) {
	let data1 = JSON.stringify(data, '', '\t');
	fs.writeFileSync('src/rebuild/data/analysis/HJXB.json', data1, (err) => {
		console.log('error: ' + err);
	});
	console.log('saved');
}
