'use strict';


const TCPClient = require('./tcp-client');
const HTTPClient = require('./http-client');
const EmbeddedClient = require('./embedded-client');

class Client {
	constructor(opts, namesapce) {
		this.mode = opts.mode || 'tcp';
		console.log('mode:'. mode);
		switch(this.mode) {
			case 'tcp':
				this.impl = new TCPClient(opts, namesapce);
				break;
			case 'http':
				this.impl = new HTTPClient(opts, namesapce);
				break;
			case 'embedded':
				this.impl = new EmbeddedClient(opts, namesapce);
				break;
			default:
				throw new Error(`unsupported client mode: ${mode} (must be tcp, http or embedded)`);
		}
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

