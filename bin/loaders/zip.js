// ResponseType: 'stream', for jpg
// response is on `response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))`
// responseType: 'arraybuffer', for zip
// response is on `response`

// zip.file('test.file', 'hello there');
// var data = zip.generate({base64:false,compression:'DEFLATE'});
// console.log(data); // ugly data

// vorpal.log('call', 'http://bit.ly/2mTM3nY');
// axios({
// 	url: 'http://phoenix.eab.com/projects/core-ply-brand_3.8.0.zip',
// 	responseType: 'arraybuffer',
// 	method: 'get'
// }).then(response => {
// 	JSZip
//     .loadAsync(response.data)
//     .then(zip => {
// 	zip
//         .generateNodeStream({
// 	type: 'nodebuffer',
// 	streamFiles: true
// })
//         .pipe(fs.createWriteStream('out.zip'))
//         .on('finish', () => {
// 	vorpal.log('out.zip written.');
// });

// 	return zip;
// })
//     .then(zip => {
// 	return zip
//         .file('bower.json')
//         .async('string');
// })
//     .then(text => {
// 	console.log(text);
// });

//   // Vorpal.log('response', response);
//   // response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
// }).catch(e => {
// 	vorpal.log('error', e);
// });
