'use strict';


const TCPClient = require('./tcp-client');
const HTTPClient = require('./http-client');

class Client {
	constructor(opts, namesapce) {
		// var poolB = pool(opts);
		let mode = opts.mode || 'tcp';
		if (mode !== 'tcp' && mode !== 'http') throw new Error(`unsupported client mode: ${mode} (must be tcp http)`);
		this.impl = mode === 'tcp' ? new TCPClient(opts, namesapce) : new HTTPClient(opts, namesapce);
		// this.use(namesapce);
		// this.pool = pool(opts); //new SocketPool(opts);
	}

	use(namespace) {
		return this.impl.use(namespace);
	}

	getDocument(id, ns) {
		return this.impl.getDocument(id, ns);
	}

	addDocuments(docs, ns) {
		return this.impl.addDocuments(docs, ns);
	}

	deleteDocuments(docs, ns) {
		return this.impl.deleteDocuments(docs, ns);
	}

	namespaceConfig(ns) {
		return this.impl.deleteDocuments(ns);
	}

	createNamespace(nsConfig) {
		return this.impl.createNamespace(nsConfig);
	}

	search(query, ns) {
		return this.impl.search(query, ns);
	}

	quit() {
		return this.impl.quit();
	}
}

module.exports = Client;

