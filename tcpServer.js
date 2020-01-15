const net = require('net');
const fs = require('fs');
let clients = [];
let ids = 0;


const server = net.createServer();
const output = fs.createWriteStream('server.log');

server.listen(5000, () => log('Server up on port: 5000'));

server.on('connection', socket => {
	socket.id = ids++;
	socket.write('Welcome, connection successfull');
	let successMessage = `User ${socket.id} has connected`;
	for (let i in clients) clients[i].write(successMessage);
	log(successMessage);
	clients.push(socket);

	socket.on('data', chunk => {
		log(`User ${socket.id}: ${chunk}`);
		for (let i in clients) {
			if (clients[i].id !== socket.id) clients[i].write(`User ${socket.id}: ${chunk}`);
		}
	})
	.on('end', () => {
		for (let i in clients) {
			if (clients[i].id === socket.id) clients.splice(i, 1);
		}
		log(`User ${socket.id} has disconnected`)
	})
})

function log(message) {
	console.log(message);
	output.write(message + '\n');
}