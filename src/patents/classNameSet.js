const data = require('./data.json');
const fs = require('fs');
const typeSet = require('./mainClass.json');

let obj = data.data;

function findByClass(arr, className) {
	let res = '';
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].mainClass === className) {
			res = arr[i].classCTX;
			break;
		}
	}
	return res;
}

obj.forEach(i => {
	let na = i.mainClass.replace(/\s/g, '');
	i.className = findByClass(typeSet.data, na);
});

function save(data) {
	let data1 = JSON.stringify({ data: data }, '', '\t');
	fs.writeFileSync('./data.json', data1, err => {
		if (!err) {
			console.log(index + ' saved!');
		} else {
			console.log('error: ' + err);
		}
	});
}

save(obj);

console.log(obj[0].className);
