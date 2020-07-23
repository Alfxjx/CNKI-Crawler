const Excel = require('exceljs');
const journal = process.argv.slice(2)[0];
const data0 = require(`../../data/analysis/${journal}.json`);
let data = {};
if(process.argv.slice(2).length!==1){
  let year = process.argv.slice(2)[1];
  const data1 = require(`../../data/analysis/${journal}-${year}.json`);
  data = data1;
} else {
  data = data0;
}

// 对于电焊机：http://www.71dhj.com/；收录信息/收录类别代码 ：无
// 对于焊管：http://navi.cnki.net/KNavi/JournalDetail?pcode=CJFD&pykm=HGZZ&Year=&Issue=&Entry=；收录信息/收录类别代码 ：无
// 对于焊接学报：http://hjxb.cnjournals.net/ch/index.aspx；收录信息/收录类别代码 ：EI; Peking
// 对于焊接：http://hj.cnjournals.net/ch/index.aspx；对于收录信息/收录类别代码 ：无
// 对于焊接技术：http://navi.cnki.net/KNavi/JournalDetail?pcode=CJFD&pykm=HSJJ；收录信息/收录类别代码 ：无
let urlLink = '';
let paperName = '';
let typeCode = '';
switch (journal) {
	case 'HJXB':
		urlLink = 'http://hjxb.cnjournals.net/ch/index.aspx';
		paperName = '焊接学报';
		typeCode = 'EI; Peking';
		break;
	case 'HAJA':
		urlLink = 'http://hj.cnjournals.net/ch/index.aspx';
		paperName = '焊接';
		typeCode = '';
		break;
	case 'HSJJ':
		urlLink = 'http://navi.cnki.net/KNavi/JournalDetail?pcode=CJFD&pykm=HSJJ';
		paperName = '焊接技术';
		typeCode = '';
		break;
	case 'DHJI':
		urlLink = 'http://www.71dhj.com/';
		paperName = '电焊机';
		typeCode = '';
		break;
	case 'HGZZ':
		urlLink = 'http://navi.cnki.net/KNavi/JournalDetail?pcode=CJFD&pykm=HGZZ&Year=&Issue=&Entry=';
		paperName = '焊管';
		typeCode = '';
		break;

	default:
		urlLink = 'default';
		paperName = 'default';
		typeCode = 'default';
		break;
}
// 数据预处理
let input = [];
let obj = [];
for (let i = 0; i < data.data.length; i++) {
	if (data.data[i].author && data.data[i].author.length !== 0) {
		obj.push(data.data[i]);
	}
}
console.log(obj[0].link);
console.log(typeof obj[0].link);

obj.forEach((item, index) => {
	let len = item.author.length;

	let link = item.link;
	let reg = /(\S+)201([0-9]{1})([0-9]{2})/i;

	let year = -1;
	let juan = -1;
	let vol = -1;
	if (link) {
		year = link.substring(link.length - 4, link.length);
		switch (journal) {
			case 'HJXB':
				juan = year - 1979;
				break;
			case 'HAJA':
				juan = '';
				break;
			case 'HSJJ':
      juan = year - 1971;
				break;
			case 'DHJI':
				juan = year - 1970;
				break;
			case 'HGZZ':
				juan = year - 1977;
				break;

			default:
				juan = '';
				break;
		}
		vol = reg.exec(link)[3];
	}

	for (let i = 0; i < len; i++) {
		input.push({
			index: index + 1,
			title: item.title,
			name: item.author[i].name,
			lang: '中文',
			school: item.author[i].school,
			abstract: item.abstract,
			year: year,
			juan: juan,
			vol: vol,
			keyType: '关键词',
			paperName: paperName,
			keywords: item.keywords,
			start: item.start,
			end: item.end,
			URI: urlLink,
			typeCode: typeCode,
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
obj.forEach((item) => {
	if (item.author.length) {
		nameLength.push(item.author.length);
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



if(process.argv.slice(2).length!==1){
  let year = process.argv.slice(2)[1];
  workbook.xlsx.writeFile(`./src/rebuild/data/out/${journal}-${year}.xlsx`).then(function () {
    // done
    console.log('done');
  });
} else {
  workbook.xlsx.writeFile(`./src/rebuild/data/out/${journal}.xlsx`).then(function () {
    // done
    console.log('done');
  });
}
