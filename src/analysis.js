const out2014S = require('./output2014');
const out2015S = require('./output2015');

const fs = require('fs');
// console.log(out2014.length);
// console.log(out2015.length);

// let arr = out2014.concat(out2015);
let out2014 = out2014S;
let out2015 = out2015S;
while (out2014.some(Array.isArray)) {
	out2014 = [].concat(...out2014);
}

while (out2015.some(Array.isArray)) {
	out2015 = [].concat(...out2015);
}

console.log('type: ' + typeof out2014); // TODO object????
console.log('typeof arr[0]: ' + typeof out2014[0]);
console.log(out2014.length);
console.log('arr[0] = ' + JSON.stringify(out2014[0]));

fs.writeFileSync('data.txt', JSON.stringify(out2014), () => {});

// const url2014 = `http://kns.cnki.net/kcms/detail/detail.aspx?dbcode=CJFD&filename=${paperID}&dbname=CJFD2014`;
// const url2015 = `http://kns.cnki.net/kcms/detail/detail.aspx?dbcode=CJFD&filename=${paperID}&dbname=CJFDLAST2015`;

// const sample = '5052铝合金/镀锌钢涂粉CO2激光熔钎焊工艺特性\n樊丁;蒋锴;余淑荣;张健;\n1-4+113&HJXB201401001';

function SecondeSplit(arr, year) {
	let str = JSON.stringify(arr);
	console.log('str' + str);

	let nArr = str.split('\\n');
	console.log('nArr' + nArr);

	// 0 title
	// 1 string authors
	// 2 pages and link
	let res = {};
	res.title = nArr[0].replace(/\"/i, '');
	let names = nArr[1].split(';');
	res.name = names.slice(0, names.length - 1);
	if (nArr[2]) {
		let linkArr = nArr[2].split('&');
		let link = linkArr[1].replace(/\"/i, '');
		if (year === 2014) {
			res.link = `http://kns.cnki.net/kcms/detail/detail.aspx?dbcode=CJFD&filename=${link}&dbname=CJFD2014`;
		}
		if (year === 2015) {
			res.link = `http://kns.cnki.net/kcms/detail/detail.aspx?dbcode=CJFD&filename=${link}&dbname=CJFDLAST2015`;
		}
		let pages = linkArr[0].split('+');
		let pageArr = pages[0].split('-');
		res.start = pageArr[0];
		res.end = pageArr[1];
	}
	return res;
}
// console.log(SecondeSplit(arr[0]));

// 保存的数据
let ret2014 = [];
out2014.forEach(i => {
	let tmp = SecondeSplit(i, 2014);
	ret2014.push(tmp);
});

let ret2015 = [];
out2015.forEach(i => {
	let tmp = SecondeSplit(i, 2015);
	ret2015.push(tmp);
});

console.log(ret2015[0]);

let ret = ret2014.concat(ret2015);

fs.writeFileSync('ret.txt', ret, err => {
	console.log(err);
});

let jsonObj = {};

jsonObj.data = ret;

let wObj = JSON.stringify(jsonObj, '', '\t');

fs.writeFile('data.json', wObj, err => {
	console.log(err);
});
