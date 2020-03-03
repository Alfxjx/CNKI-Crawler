function getPaperId(id) {
  let match = /filename=(\w+)&/i.exec(id);
  return match[1];
}

console.log(
	getPaperId(
		'http://navi.cnki.net/KNavi/Common/RedirectPage?sfield=RD&dbCode=CJFD&filename=HJXB201505001&tablename=CJFDLAST2015&filetype=XML;EPUB'
	)
);
