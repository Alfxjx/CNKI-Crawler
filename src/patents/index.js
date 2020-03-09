const url = 'https://kns.cnki.net/kns/brief/result.aspx?dbprefix=SCPD';
const ipcUrl = 'http://epub.sipo.gov.cn/ipc.jsp';
const frameUrl =
	'brief.aspx?pagename=ASP.brief_result_aspx&isinEn=0&dbPrefix=SCPD&dbCatalog=%e4%b8%ad%e5%9b%bd%e4%b8%93%e5%88%a9%e6%95%b0%e6%8d%ae%e5%ba%93&ConfigFile=SCPD.xml&research=off&t=1583676777083&keyValue=&S=1&sorttype=';
const puppeteer = require('puppeteer');
const fs = require('fs');
puppeteer
	.launch({
		headless: false,
		slowMo: 200,
	})
	.then(async browser => {
		const page = await browser.newPage();
		await page.goto(url, {
			// 网络空闲说明已加载完毕
			waitUntil: 'networkidle2',
		});
		// 起始时间
		console.log('选择起始时间：');
		await page.tap('#publishdate_from');
		await page.waitFor(1000);
		await page.select('#oCalendarChs_Month', '3');
		await page.select('#oCalendarChs_Year', '2014');
		await page.tap('#oCalendarChs_DayTD12');
		await page.waitFor(1000);
		// 中止时间
		console.log('选择终止时间：');
		await page.tap('#publishdate_to');
		// await page.select('#oCalendarChs_Month', '3');
		// await page.select('#oCalendarChs_Year', '2014');
		await page.tap('#oCalendarChs_DayTD53');
		// 主分类号
		console.log('选择分类...');
		await page.select('#txt_1_sel', 'CLZ$=|?');
		let mainInput = await page.$('#txt_1_value1');
		await page.evaluate(main => {
			main.value = 'B23K';
		}, mainInput);
		// 开始检索
		console.log('开始检索...');
		await page.tap('#btnSearch');
		await page.waitFor(3000);
		// 存储所有的链接
		console.log('循环开始，遍历table...');
		let Furl = await page.$eval('#iframeResult', el => el.getAttribute('src'));
		let resFrame = await page.frames().find(frame => frame.url().includes(Furl));
		// let resFrame = await page.frames()[2];
    await resFrame.waitFor(1000);
    await resFrame.tap('#id_grid_display_num > a:nth-child(3)');
		for (let i = 0; i < 19; i++) {
			let ctx = await resFrame.content();
			console.log('ctx.length: ' + ctx.length);
			await fs.writeFile(`./pages/ctx-${i}.html`, ctx, err => {
				if (err) {
					console.log('error: ' + err);
				} else {
					console.log('保存成功！');
				}
			});
			// 点击下一页
			await resFrame.tap('#Page_next');
			await resFrame.waitFor(10000);
		}
		// console.log(ctx);
	});
