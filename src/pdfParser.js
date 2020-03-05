// pdf to json
let fs = require('fs'),
	PDFParser = require('pdf2json');

let pdfParser = new PDFParser();
pdfParser.on('pdfParser_dataError', errData => {
	console.log(errData);
});
pdfParser.on('pdfParser_dataReady', pdfData => {
	console.log('start saving...');
	fs.writeFile('./downloads/1.json', JSON.stringify(pdfData), 'utf8', err => {
		if (err) throw err;
		console.log('The file has been saved!');
	});
});

console.log('loading...');
pdfParser.loadPDF('./downloads/1.pdf');
console.log('loaded');
