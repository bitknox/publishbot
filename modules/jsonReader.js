const fs = require('fs');

module.exports = (path) => {
	return new Promise((resolve, reject) => {
		fs.readFile(path, (err, data) => {
			if (err) reject(err);
			else resolve(JSON.parse(data));
		});
	});
};
