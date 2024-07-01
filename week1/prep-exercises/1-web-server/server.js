const http = require('http');
const fs = require('fs').promises;
const path = require('path');

let server = http.createServer(async function (request, response) {
  
	try {
		if (request.url === '/') {
			response.writeHead(200, { 'Content-Type': 'text/html' });
			let indexData = await fs.readFile(path.join(__dirname, 'index.html'));
			response.end(indexData);

		} else if (request.url === '/index.js') {
			response.writeHead(200, { 'Content-Type': 'text/javascript' });
			let jsData = await fs.readFile(path.join(__dirname, 'index.js'));
			response.end(jsData);

		} else if (request.url === '/style.css') {
			const cssData = await fs.readFile(path.join(__dirname, 'style.css'));
			response.writeHead(200, { 'Content-Type': 'text/css' });
			response.end(cssData);
			
		} else {
			response.writeHead(404, { 'Content-Type': 'text/html' });
			response.end('<h1>404 Not Found</h1>');
		}
	} catch (error) {
		response.writeHead(500, { 'Content-Type': 'text/html' });
		response.end('<h1>500 Internal Server Error</h1>');
	}
});

server.listen(3000, () => {
	console.log('Server is listening on port 3000');
});