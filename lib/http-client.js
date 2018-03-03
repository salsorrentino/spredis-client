'use strict';
const request = require('request-promise-native');

class HTTPClient {
	constructor(opts, namesapce) {
		// var poolB = pool(opts);
		if (namesapce) this.use(namesapce);
		this.baseUrl = opts.url;
		this.requestor = request.defaults({
			method: 'POST',
			json:true,
			pool: {
				maxSockets: opts.pool ? (opts.pool.max || 4) : 4
			}
		})
		// this.use(namesapce);
		// this.pool = pool(opts); //new SocketPool(opts);
	}

	use(namespace) {
		this.ns = namespace || null;
		return this;
	}

	getDocument(id, ns) {
		return this.requestor({
			url: `${this.baseUrl}/${ns || this.ns}/doc/${id}`,
			method: 'GET'
		});
	}

	addDocuments(docs, ns) {
		return this.requestor({
			url: `${this.baseUrl}/${ns || this.ns}/addDocuments`,
			body: docs
		});
	}

	deleteDocuments(docs, ns) {
		return this.requestor({
			url: `${this.baseUrl}/${ns || this.ns}/deleteDocuments`,
			body: docs
		});
	}

	namespaceConfig(ns) {
		return this.requestor({
			url: `${this.baseUrl}/${ns || this.ns}/namespaceConfig`,
			method: 'GET'
		});
	}

	createNamespace(nsConfig) {
		return this.requestor({
			url: `${this.baseUrl}/createNamespace`,
			body: nsConfig
		});
	}

	async search(query, ns) {
		console.log(ns || this.ns);
		return this.requestor({
			url: `${this.baseUrl}/${ns || this.ns}/search`,
			body: query
		}).then( (res) => {
			if (res && res.items) {
				res.items = res.items.map( (doc) => JSON.parse(doc) )
			}
			return res;
		});
	}

	quit() {
		//nothing to do
	}
}

module.exports = HTTPClient;

