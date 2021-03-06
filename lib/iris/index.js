"use strict";

const platform = process.platform.startsWith('win') ? 'windows' : process.platform;
const arch = process.arch;
const { irisConnect, irisClose, irisSQL } = require(`./lib/${platform}-${arch}/intersystems-iris.node`);

console.log(irisConnect, irisClose, irisSQL)
class IRIS {
  constructor(host, port, namespace, username, password) {
    this.db = irisConnect(host, port, namespace, username, password);
  }

  async sql(query) {
    return new Promise((done, reject) => {
      irisSQL(this.db, query, (err, data) => {
        err ? reject(err) : done(data);
      });
    })
  }

  async close() {
    return irisClose(this.db);
  }
}

module.exports = IRIS;