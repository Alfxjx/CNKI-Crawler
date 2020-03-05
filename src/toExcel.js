const Excel = require('exceljs');
const data = require('../data1.json');

// 数据预处理
let input = [];
let obj = data.data;
console.log(obj[0].link);
console.log(typeof obj[0].link);

obj.forEach((item, index) => {
	let len = item.name.length;

	let link = item.link;
	let reg = /HJXB201(4|5)([0-9]{2})/i;

	let year = -1;
	let juan = -1;
	let vol = -1;
	if (link) {
		year = link.substring(link.length - 4, link.length);
		juan = year == 2014 ? 35 : 36;
		vol = reg.exec(link)[2];
	}

	for (let i = 0; i < len; i++) {
		input.push({
			index: index + 1,
			title: item.title,
			name: item.name[i],
			lang: '中文',
			school: item.school,
			abstract: item.abstract,
			year: year,
			juan: juan,
			vol: vol,
			keyType: '关键词',
			paperName: '焊接学报',
			keywords: item.keywords,
			start: item.start,
			end: item.end,
		});
	}
});

// excel处理
let workbook = new Excel.Workbook();

workbook.creator = 'xujx';

let sheet = workbook.addWorksheet('sheet 1');

sheet.columns = [
	{ header: '序号', key: 'index', width: 10 },
	{ header: '唯一标识类型', key: 'onlykey', width: 10 },
	{ header: '唯一标识', key: 'onlyid', width: 10 },
	{ header: '题名', key: 'title', width: 15 },
	{ header: '正文语种', key: 'lang', width: 10 },
	{ header: '责任者/责任者姓名', key: 'name', width: 15 },
	{ header: '责任者/责任者机构/责任机构名称', key: 'school', width: 15 },
	{ header: '摘要', key: 'abstract', width: 15 },
	{ header: '主题/主题元素类型', key: 'keyType', width: 15 },
	{ header: '主题/主题名称', key: 'keywords', width: 15 },
	{ header: '期刊名称', key: 'paperName', width: 15 },
	{ header: '出版年', key: 'year', width: 15 },
	{ header: '规范期刊URI', key: 'URI', width: 15 },
	{ header: '卷', key: 'juan', width: 15 },
	{ header: '期', key: 'vol', width: 15 },
	{ header: '起始页码', key: 'start', width: 15 },
	{ header: '结束页码', key: 'end', width: 15 },
	{ header: '收录信息/收录类别代码', key: 'typeCode', width: 15 },
];

sheet.addRows(input);

// 合并单元格
let nameLength = [];
obj.forEach(item => {
	if (item.name.length) {
		nameLength.push(item.name.length);
	} else {
		nameLength.push(0);
	}
});

console.log('nameLength' + nameLength[0] + ' ' + nameLength[1] + ' ' + nameLength[2]);

let ret = [];
ret.push(2);
for (let i = 0; i < nameLength.length; i++) {
	let head = ret[ret.length - 1];
	if (ret.length % 2 === 0) {
		ret.push(head + 1);
    // console.log('head' + head);
    i--;
	} else {
    ret.push(head + nameLength[i] - 1);
    // i = 0 2 4 6 8?????
		// console.log('name' + nameLength[i] + ' i: ' + i);
		// console.log('head' + head);
	}
}

console.log(ret.slice(0, 6));
console.log(ret.length);

for (let j = 0; j < ret.length; j += 2) {
	sheet.mergeCells(`A${ret[j]}:A${ret[j + 1]}`);
	sheet.mergeCells(`B${ret[j]}:B${ret[j + 1]}`);
	sheet.mergeCells(`C${ret[j]}:C${ret[j + 1]}`);
	sheet.mergeCells(`D${ret[j]}:D${ret[j + 1]}`);
	sheet.mergeCells(`E${ret[j]}:E${ret[j + 1]}`);
	sheet.mergeCells(`H${ret[j]}:H${ret[j + 1]}`);
	sheet.mergeCells(`I${ret[j]}:I${ret[j + 1]}`);
	sheet.mergeCells(`J${ret[j]}:J${ret[j + 1]}`);
	sheet.mergeCells(`K${ret[j]}:K${ret[j + 1]}`);
	sheet.mergeCells(`L${ret[j]}:L${ret[j + 1]}`);
	sheet.mergeCells(`M${ret[j]}:M${ret[j + 1]}`);
	sheet.mergeCells(`N${ret[j]}:N${ret[j + 1]}`);
	sheet.mergeCells(`O${ret[j]}:O${ret[j + 1]}`);
	sheet.mergeCells(`P${ret[j]}:P${ret[j + 1]}`);
	sheet.mergeCells(`Q${ret[j]}:Q${ret[j + 1]}`);
	sheet.mergeCells(`R${ret[j]}:R${ret[j + 1]}`);
}

workbook.xlsx.writeFile('1.xlsx').then(function() {
	// done
	console.log('done');
});
