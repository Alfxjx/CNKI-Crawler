const pptr = require('puppeteer');
const url = 'https://cn.bing.com/';

pptr.launch({
	headless: true,
	args: ['--no-sandbox', '--disable-setuid-sandbox'],
}).then(async (browser) => {
	const page = await browser.newPage();
	await page.goto(url);
	await page.waitFor(2000);
	let bg = await page.$('#bgDiv');
	let res = await page.evaluate((bg) => {
		let css = window.getComputedStyle(bg, null);
		let resUrl = css.backgroundImage;
		return /^url\(\"(\S+)\"\)$/i.exec(resUrl)[1];
	}, bg);
	console.log(res);
});
