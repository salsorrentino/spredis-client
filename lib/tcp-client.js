'use strict';



var pool = require('./pool')
class TCPClient {
	constructor(opts, namesapce) {
		// var poolB = pool(opts);
		this.use(namesapce);
		this.pool = pool(opts); //new SocketPool(opts);
	}

	async issueCommand(command, parseItems) {
		let sock = await this.pool.acquire();
		try {
			let res = await sock.sendCommand(command);
			if (parseItems && res && res.items) {
				res.items = res.items.map( (doc) => JSON.parse(doc) )
			}
			return res;
		} catch (e) {
			throw e
		} finally {
			this.pool.release(sock);
		}
		
	};

	use(namespace) {
		this.ns = namespace || null;
		return this;
	}

	getDocument(id, ns) {
		return this.issueCommand({
			action: 'getDocument',
			ns: ns || this.ns,
			input: id
		});
	}

	addDocuments(docs, ns) {
		return this.issueCommand({
			action: 'addDocuments',
			ns: ns || this.ns,
			input: docs
		});
	}

	deleteDocuments(docs, ns) {
		return this.issueCommand({
			action: 'deleteDocuments',
			ns: ns || this.ns,
			input: docs
		});
	}

	namespaceConfig(ns) {
		return this.issueCommand({
			action: 'namespaceConfig',
			ns: ns || this.ns,
			input: ''
		});
	}

	createNamespace(nsConfig) {
		return this.issueCommand({
			action: 'createNamespace',
			input: nsConfig
		});
	}

	search(query, ns) {
		return this.issueCommand({
			action: 'search',
			ns: ns || this.ns,
			input: query
		}, true);
		
	}

	async quit() {
		try {
			await this.pool.drain();
			var a = await this.pool.clear();	
			console.log("Connection pool closed");
			return a;
		} catch(e) {
			console.log(e.stack);
		}
		
	}
}

module.exports = TCPClient;

