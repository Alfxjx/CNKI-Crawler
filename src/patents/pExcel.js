const Excel = require('exceljs');
const data = require('./data.json');

let obj = data.data;
let input = [];
let nameLength = [];
obj.forEach((item, index) => {
	let name = item.name;
	item.name = name.split(';');
	nameLength.push(item.name.length);
	let typeNum = /(\w{6})(\d{1})/i.exec(item.applyNum)[2];
	let patentType = '';
	if (typeNum == 1 || typeNum == 8) {
		patentType = '发明专利';
	}
	if (typeNum == 2 || typeNum == 9) {
		patentType = '实用新型';
	}
	if (typeNum == 3) {
		patentType = '外观设计';
	}
	let patentNum = '';
	if (item.lawState == '授权') {
		patentNum = item.applyNum.replace(/CN/i, 'ZL');
	}
	for (let i = 0; i < item.name.length; i++) {
		input.push({
			index: item.index + 1,
			title: item.title,
			otherTitle: '无',
			abstract: item.abstract,
			patentType: patentType,
			district: item.district,
			disCode: item.disCode,
			H: item.company,
			I: item.company,
			J: item.company,
			K: item.company,
			L: item.name[i],
			M: item.company,
			state: item.lawState,
			applyDate: item.applyDate,
			publishDate: item.publishDate,
			applyNum: item.applyNum,
			publishNum: item.publishNum,
			patentNum: patentNum,
			classType: item.classType,
			source: item.source,
			className: item.className,
			mainClass: item.mainClass,
		});
	}
});

let input1 = [];

input.forEach(item => {
	if (item.lawState !== '发明专利申请公布后的视为撤回') {
		input1.push(item);
	}
});

// excel处理
let workbook = new Excel.Workbook();

workbook.creator = 'xujx';

let sheet = workbook.addWorksheet('sheet 1');

sheet.columns = [
	{ header: '序号', key: 'index', width: 10 },
	{ header: '专利名称', key: 'title', width: 10 },
	{ header: '其他专利名称', key: 'otherTitle', width: 10 },
	{ header: '摘要', key: 'abstract', width: 30 },
	{ header: '专利类型', key: 'patentType', width: 10 },
	{ header: '所属国家地区组织名称', key: 'district', width: 10 },
	{ header: '所属国家地区组织代码', key: 'disCode', width: 10 },
	{ header: '申请人/责任者姓名 ', key: 'H', width: 10 },
	{ header: '申请人/责任者机构', key: 'I', width: 10 },
	{ header: '专利权人/责任者姓名', key: 'J', width: 10 },
	{ header: '专利权人/责任者机构/责任机构名称', key: 'K', width: 10 },
	{ header: '发明人/责任者姓名 ', key: 'L', width: 15 },
	{ header: '发明人/责任者机构/责任机构名称', key: 'M', width: 10 },
	{ header: '专利状态', key: 'state', width: 10 },
	{ header: '申请日期', key: 'applyDate', width: 20 },
	{ header: '发布日期', key: 'publishDate', width: 20 },
	{ header: '申请号', key: 'applyNum', width: 10 },
	{ header: '公开号', key: 'publishNum', width: 10 },
	{ header: '专利号', key: 'patentNum', width: 10 },
	{ header: '主题/主题元素类型 （', key: 'classType', width: 10 },
	{ header: '主题/主题元素来源', key: 'source', width: 10 },
	{ header: '主题/主题名称', key: 'className', width: 10 },
	{ header: '主题/主题号', key: 'mainClass', width: 10 },
];

sheet.addRows(input1);

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
	sheet.mergeCells(`F${ret[j]}:F${ret[j + 1]}`);
	sheet.mergeCells(`G${ret[j]}:G${ret[j + 1]}`);

	sheet.mergeCells(`H${ret[j]}:H${ret[j + 1]}`);
	sheet.mergeCells(`I${ret[j]}:I${ret[j + 1]}`);
	sheet.mergeCells(`J${ret[j]}:J${ret[j + 1]}`);
	sheet.mergeCells(`K${ret[j]}:K${ret[j + 1]}`);
	// sheet.mergeCells(`L${ret[j]}:L${ret[j + 1]}`);
	// sheet.mergeCells(`M${ret[j]}:M${ret[j + 1]}`);
	sheet.mergeCells(`N${ret[j]}:N${ret[j + 1]}`);

	sheet.mergeCells(`O${ret[j]}:O${ret[j + 1]}`);
	sheet.mergeCells(`P${ret[j]}:P${ret[j + 1]}`);
	sheet.mergeCells(`Q${ret[j]}:Q${ret[j + 1]}`);
	sheet.mergeCells(`R${ret[j]}:R${ret[j + 1]}`);
	sheet.mergeCells(`S${ret[j]}:S${ret[j + 1]}`);
	sheet.mergeCells(`T${ret[j]}:T${ret[j + 1]}`);

	sheet.mergeCells(`U${ret[j]}:U${ret[j + 1]}`);
	sheet.mergeCells(`V${ret[j]}:V${ret[j + 1]}`);
	sheet.mergeCells(`W${ret[j]}:W${ret[j + 1]}`);
}

workbook.xlsx.writeFile('./patent.xlsx').then(function() {
	// done
	console.log('done');
});
