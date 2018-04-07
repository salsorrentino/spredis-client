'use strict';
const request = require('request-promise-native');
const resParser = require('./res-parser');
class HTTPClient {
	constructor(opts, namesapce) {
		// var poolB = pool(opts);
		if (namesapce) this.use(namesapce);
		this.baseUrl = opts.url;
		let defaults = {
			method: 'POST',
			json:true
		};
		if (opts.pool && opts.pool.min) {
			defaults.forever = true,
			defaults.agentOptions = {
				minSockets:opts.pool.min,
				maxSockets:opts.pool.max
			}
		} else if (opts.pool && opts.pool.max) {
			defaults.pool = {maxSockets: opts.pool.max}
		}
		this.assignExpr = opts.assignExpr !== undefined ? opts.assignExpr : true;
		this.requestor = request.defaults(defaults);
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
		return this.requestor({
			url: `${this.baseUrl}/${ns || this.ns}/search`,
			body: query
		}).then( (res) => {
			return resParser(res, this.assignExpr);
		});
	}

	quit() {
		//nothing to do
	}
}

module.exports = HTTPClient;

