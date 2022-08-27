/*
	3CQS Signals Client Sample
	https://www.3cqs.com
	
	(NOT FOR DISTRIBUTION)

	Requirements: Node.JS + socket.io-client

	How to run:
	1. Install Socket.IO client: npm i socket.io-client
	2. Open terminal / command prompt window
	3. Type: node 3cqs-signals-client.js
*/



const version = '0.7';
let fatalError = false;


const socket = require('socket.io-client')('https://stream.3cqs.com', {

	extraHeaders: {

		'api-key': '',
		'user-agent': '3CQS Signal Client/' + version
	},
	transports: ['websocket', 'polling'],
	path: '/stream/v1/signals',
	reconnection: true,
	reconnectionDelay: 10000
});


socket.on('connect', (data) => {

	showLog('Connected to 3CQS Signals');

	let messageId = randomString(15);

	// Get max last n signals

	setTimeout(() => {
	
		socket.emit('signal_history', { 'max': 10, 'message_id_client': messageId });

	}, 500);
});


socket.on('signal', (data) => {

	let content = 'SIGNAL RECEIVED';

	if (data['created_history'] != undefined && data['created_history'] != null && data['created_history'] != '') {

		content += ' (HISTORY)';
	}

	showLog(content);

	console.log(data);
});


socket.on('info', (data) => {

	showLog('INFO');

	console.log(data);
});


socket.on('error', (data) => {

	if (data['code'] == 403) {

		fatalError = true;
	}

	showLog('ERROR');

	console.log(data);
});
 

socket.on('connect_error', (data) => {

	fatalError = true;

	showLog('CONNECT_ERROR');

	console.log(data);
});


socket.on('connect_failed', (data) => {

	fatalError = true;

	showLog('CONNECT_FAILED');

	console.log(data);
});


socket.on('disconnect', (reason) => {

	showLog('Client Disconnected: ' + reason);

	//Either 'io server disconnect' or 'io client disconnect'
	if (!fatalError && reason === 'io server disconnect') {

		showLog('Server disconnected the client. Trying to reconnect.');

		// Disconnected by server,so reconnect again
		socket.connect();
	}
});


function randomString(len) {

	let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

	let str = '';

	for (let i = 0; i < len; i++) {

		str += chars[Math.floor(Math.random() * chars.length)];
	}

	return str;
}


function showLog(content) {

	let contentFormat = '<----{CONTENT}---->';

	content = contentFormat.replace(/\{CONTENT\}/g, content);

	console.log(content);
}
