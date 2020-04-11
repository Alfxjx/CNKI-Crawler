const pptr = require('puppeteer');
const url = 'https://juejin.im/user/5bb5eb00e51d453eb93d896d/likes';
pptr.launch({
	headless: true,
}).then(async browser => {
	const page = await browser.newPage();
	await page.goto(url);
	await page.waitFor(2000);
	let ulDOM = await page.$('.entry-list');
	let res = await page.evaluate(ul => {
		let ret = [];
		let list = ul.querySelectorAll('.item');
		for (let i = 0; i < list.length; i++) {
			let titleDOM = list[i].querySelector('.title');
			let link, title, likeCount;
			if (!titleDOM) {
				link = '';
				title = '';
			} else {
				link = titleDOM.href;
				title = titleDOM.innerText;
			}

			let tags = [];
			let tagsDOM = list[i].querySelectorAll('a.tag');
			if (tagsDOM) {
				for (let tag of tagsDOM) {
					tags.push(tag.innerText);
				}
			}
			let countDOM = list[i].querySelector('.count');
			if (!countDOM) {
				likeCount = 0;
			} else {
				likeCount = countDOM.innerText;
			}
			if (link !== '' && title !== '' && likeCount !== 0 && tags.length !== 0) {
				ret.push({ link, title, likeCount, tags });
			}
		}
		return ret;
	}, ulDOM);
	console.log(res);
});
