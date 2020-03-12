const data1 = require('./data1.json');
const data2 = require('./data2.json');
// const data3 = require('./data3.json');
const Excel = require('exceljs');

let arr1 = data1.data;
let arr2 = data2.data;
// let arr3 = data3.data;

let res = [].concat(arr1, arr2).slice(0, 200);

console.log(`res length: ${res.length}`);

let input = [];

res.forEach(item => {
	// console.log(item.name[0] + '-' + item.link);
	input.push({
		link: item.link,
	});
});

console.log(input.length);
console.log(input[0]);

// excel处理
let workbook = new Excel.Workbook();

workbook.creator = 'xujx';

let sheet = workbook.addWorksheet('sheet 1');

sheet.columns = [{ header: '链接', key: 'link', width: 50 }];

sheet.addRows(input);
// console.log('added ' + sheet.size());

workbook.xlsx.writeFile('./links.xlsx').then(function() {
	// done

	console.log('done');
});
