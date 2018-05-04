module.exports = function (res, assignExpr) {
	if (res && res.items) {
		res.items = res.items.map( (doc) => JSON.parse(doc) );
		if (assignExpr && res.exprs) {
			let props = Object.getOwnPropertyNames(res.exprs);
			for (let i = 0; i < props.length; i++) {
				let prop = props[i];
				let values = res.exprs[prop] || [];
				for (let k = 0; k < values.length; k++) {
					if (res.items[k]) res.items[k][prop] = values[k];
				}
			}
			delete res.exprs;
		} 
	}
	return res;
}