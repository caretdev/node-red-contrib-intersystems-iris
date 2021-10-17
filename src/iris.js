module.exports = function (RED) {
  const IRIS = require('../lib/iris');

  function IRISConfigNode(n) {
    RED.nodes.createNode(this, n);
    this.host = n.host;
    this.port = parseInt(n.port, 10);
    this.namespace = n.namespace;
    this.username = n.username || "_SYSTEM";
    this.password = n.password || "SYS";

    this.connected = false;
    this.connecting = false;

    this.setMaxListeners(0);
    var node = this;

    function doConnect() {
      node.connecting = true;
      node.emit("state", "connecting");
      try {
        node.connection = new IRIS(node.host, node.port, node.namespace, node.username, node.password);
        node.connected = true;
        node.emit("state", "connected");
      } catch (ex) {
        node.emit("state", ex.message);
        node.error(ex);
        node.connecting = false;
      }
    }

    this.connect = function () {
      if (!this.connected && !this.connecting) {
        doConnect();
      }
    }
  }
  RED.nodes.registerType("InterSystemsIRISConfig", IRISConfigNode, {
    credentials: {
      username: { type: "text" },
      password: { type: "password" }
    }
  });

  function IRISNode(config) {
    const node = this;
    console.log('new node', config);
    RED.nodes.createNode(node, config);
    node.topic = config.topic;
    node.config = RED.nodes.getNode(config.InterSystemsIRISConfig);
    this.setMaxListeners(0);
    node.status({ fill: "gray", shape: "ring", text: "not yet connected" });

    if (!node.config) {
      node.error("InterSystems IRIS not configured")
      return;
    }

    node.config.on("state", (info) => {
      console.log('new state', info, node.id);
      if (info === "connecting") {
        node.status({ fill: "grey", shape: "ring", text: info });
      } else if (info === "connected") {
        node.status({ fill: "green", shape: "dot", text: info });
      } else {
        node.status({ fill: "red", shape: "ring", text: info });
      }
    });
    node.config.connect();

    node.on('input', async (msg, send, done) => {
      // send = send || function() { node.send.apply(node,arguments) };
      console.log('new input', msg)
      if (!node.config.connected) {
        node.error("Database not connected", msg);
        node.status({ fill: "red", shape: "ring", text: "not yet connected" });
        return;
      }
      if (typeof msg.topic !== 'string' || msg.topic === '') {
        node.error("msg.topic : the query is not defined as a string");
        node.status({ fill: "red", shape: "ring", text: "error" });
        return;
      }
      node.status({});
      const query = msg.topic;
      node.config.connection
        .sql(query)
        .then(data => {
          node.status({ fill: "green", shape: "dot", text: "OK" });
          console.log('query result', data);
          msg.payload = data.update ? data : data.rows;
          send(msg);
          if (done) { done(); }
        })
        .catch(err => {
          console.log(err);
          node.error(err.message);
          node.status({ fill: "red", shape: "ring", text: "error" });
        });
    });

    node.on('close', () => {
      node.config.removeAllListeners();
      node.status({});
    });

  }
  RED.nodes.registerType("intersystems iris", IRISNode);
}