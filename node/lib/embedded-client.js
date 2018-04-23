'use strict';
// const request = require('request-promise-native');
const resParser = require('./res-parser');
const Spredis = require('spredis/lib/spredis/Spredis');

class EmbeddedClient {
	constructor(opts, namesapce) {
		// var poolB = pool(opts);
		this.spredis = Spredis.getInstance();
		if (!this.spredis) {
			this.spredis = new Spredis(opts);
			this.spredis.initialize().catch( e=> {console.error(e.stack);} )
		}
		if (namesapce) this.use(namesapce);
		// this.baseUrl = opts.url;
		// let defaults = {
		// 	method: 'POST',
		// 	json:true
		// };
		// if (opts.pool && opts.pool.min) {
		// 	defaults.forever = true,
		// 	defaults.agentOptions = {
		// 		minSockets:opts.pool.min,
		// 		maxSockets:opts.pool.max
		// 	}
		// } else if (opts.pool && opts.pool.max) {
		// 	defaults.pool = {maxSockets: opts.pool.max}
		// }
		// this.assignExpr = opts.assignExpr !== undefined ? opts.assignExpr : true;
		// this.requestor = request.defaults(defaults);
		// this.use(namesapce);
		// this.pool = pool(opts); //new SocketPool(opts);
	}

	use(namespace) {
		this.ns = namespace || null;
		return this;
	}

	async getDocument(id, ns) {
		ns = await this.spredis.useNamespace(ns || this.ns);
		return await ns.getDocument(id);
	}

	async addDocuments(docs, ns) {
		ns = await this.spredis.useNamespace(ns || this.ns);
		return await ns.addDocuments(docs);
	}

	async deleteDocuments(docs, ns) {
		ns = await this.spredis.useNamespace(ns || this.ns);
		return await ns.deleteDocuments(docs);
	}

	async namespaceConfig(ns) {
		ns = await this.spredis.useNamespace(ns || this.ns);
		return await ns.getNamespaceConfig(ns);
	}

	createNamespace(nsConfig) {
		return this.spredis.createNamespace(nsConfig);
	}

	async search(query, ns) {
		ns = await this.spredis.useNamespace(ns || this.ns);
		return await ns.search(query);
	}

	quit() {
		//nothing to do
	}
}

module.exports = EmbeddedClient;

