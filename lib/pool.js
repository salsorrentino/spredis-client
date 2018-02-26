const pooler = require("generic-pool");

const Transformer = require('./transformer');
const JSONDuplexStream = require('./json-stream');
const net = require('net');


class JSONSocketClient {
	constructor(port, host, pool) {
		this.port = port;
		this.host = host;		
	}

	_wrapSocket() {
		this.tx = new Transformer();
		// this.txOut = Transformer();
		this.duplex = JSONDuplexStream();
		
		this.duplex.out
			.pipe(this.socket)
			.pipe(this.duplex.in)
			.pipe(this.tx)

		// this.socket
		// 	.pipe(this.duplex.in)
		// 	.pipe(this.tx);

		// this.socket
		// 	.pipe(this.duplex.in)
		// 	.pipe(this.tx)
		// 	.pipe(this.duplex.out)
		// 	.pipe(this.socket);


		var self = this;
		this.tx.on('data', (obj) => {
			if (self.currentResolve) {
				self.currentResolve(obj);
				self._cleanUpFromCommand();
			}
		});

		this.tx.on('error', (obj) => {
			if (self.currentReject) {
				self.currentReject(obj);
				self._cleanUpFromCommand();
			}
		});
	}

	_cleanUpFromCommand() {
		delete this.currentResolve;
		delete this.currentReject;
	}

	sendCommand(command) {	
		var self = this;
		return new Promise((resolve, reject) => {
			try {
				self.currentResolve = resolve;
				self.currentReject = reject;
				self.duplex.out.write(command);
			} catch(e) {
				self._cleanUpFromCommand();
				console.log(e.stack);
				reject(e);
			}
		});
	}

	connect() {
		var self = this;
		return new Promise((resolve, reject) => {
			try {
				self.socket = net.createConnection(self.port, self.host, () => {
					self._wrapSocket()
					resolve(self);
				});	
			} catch(e) {
				self.destroy()
				reject(e)
			}
		});
	}


	destroy() {
		delete this.tx;
		// delete this.txOut;
		delete this.duplex;
		if (this.socket) {
			this.socket.destroy();
			delete this.socket;
		}
	}
}


class ClientSocketFactory {
	constructor(opts) {
		opts = opts || {};
		this.host = opts.host || '127.0.0.1';
		this.port = opts.port || 5268;
		let poolOpts = opts.pool || {}
		this.poolOptions = {
			min: poolOpts.min || 10,
			max: poolOpts.max || 100,
			idleTimeoutMillis: poolOpts.idleTimeout || 30000 
		};
		// this.poolOptions = opts;
	}

	async create() {
		let client = new JSONSocketClient(this.port, this.host);
		return await client.connect();
	}

	destroy(client) {
		client.destroy();
	}
}

module.exports = function(opts) {
	var factory = new ClientSocketFactory(opts)
	return pooler.createPool(factory, factory.poolOptions)
}