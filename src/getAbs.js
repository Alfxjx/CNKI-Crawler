const obj = require('../data.json');
const fs = require('fs');

let data = obj;

console.log(`data的长度${data.data.length}`);
console.log('开始获取摘要信息...');

const len = data.data.length;
for (let i = 0; i < len; i++) {
	let res = getAbstract(data.data[i].link);
	data.data[i].abstract = res;
}

function getAbstract(link) {
	return 'test';
}

console.log('获取信息完成！');
console.log(data.data[0].abstract);

function save(data) {
	let data1 = JSON.stringify(data, '', '\t');
	fs.writeFile('data1.json', data1, err => {
		console.log(err);
	});
}

// save(data);
