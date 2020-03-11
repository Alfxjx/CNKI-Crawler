// 获取分类名称
// item.className
const data = require('./data.json');
const fs = require('fs');

let obj = data.data;

let classNameList = [];

obj.forEach(item => {
	classNameList.push(item.mainClass.replace(/\s/g, ''));
});

console.log(classNameList[0]);
console.log(classNameList.length);
let setList = new Set(classNameList);
let allArr = [...setList];
let sortArr = allArr.sort();
let output = [];
sortArr.forEach(item => {
	output.push({
		mainClass: item,
		classCTX: '',
	});
});

function save(data) {
	let data1 = JSON.stringify({ data: data }, '', '\t');
	fs.writeFileSync('./mainClass.json', data1, err => {
		if (!err) {
			console.log(index + ' saved!');
		} else {
			console.log('error: ' + err);
		}
	});
}

save(output);
