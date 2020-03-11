const data = require('./data.json');
const fs = require('fs');

// 保存
function save(data) {
	let data1 = JSON.stringify({ data: data }, '', '\t');
	fs.writeFileSync('./data.json', data1, err => {
		if (!err) {
			console.log('saved!');
		} else {
			console.log('error: ' + err);
		}
	});
}

let obj = data.data;
console.log(obj[0].index);
let index = obj[0].index.replace(/\\n(\s+)/g, '');

console.log(index);

obj.forEach(item => {
	// console.log(item.index);
	item.index = item.index.replace(/\\n(\s+)/g, '');
	item.link = `http://dbpub.cnki.net/grid2008/dbpub/detail.aspx?dbcode=SCPD&dbname=SCPD2014&filename=${item.id}`;
});

save(obj);
