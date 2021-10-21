node-red-contrib-intersystems-iris
========================

[Node-RED](https://nodered.org) node for [InterSystems IRIS](https://www.intersystems.com/products/intersystems-iris/)

Install
-------

Either use the `Node-RED Menu - Manage Palette - Install`, or run the following command in your Node-RED user directory - typically `~/.node-red`

```shell
npm i node-red-contrib-intersystems-iris
```

Usage
-----

Allows basic access to a InterSystems IRIS database.

This node uses the **sql** operation against the configured database.

By its very nature it allows SQL injection... so *be careful out there...*

The `msg.topic` must hold the *query* for the database, and the result is returned in `msg.payload`.

Typically the returned payload will be an array of the result rows.

It does not support paramaterized queries, yet.

```javascript
msg.topic="INSERT INTO \"users\" (\"userid\", \"username\") VALUES ('36', 'some-user')"
return msg;
```

```javascript
msg.topic="SELECT \"userid\", \"username\" FROM \"users\""
return msg;
```

Demo
---

To run own version of demo, it is possible to use docker compose. Just do

```shell
docker compose up --build -d
```

And after build and start, open link to Node-RED portal http://localhost:1880/

Demo flow file for manual installation is available [here](https://raw.githubusercontent.com/caretdev/node-red-contrib-intersystems-iris/main/node-red/flows.json)

![SQL Flow](https://raw.githubusercontent.com/caretdev/node-red-contrib-intersystems-iris/main/images/example-sql-flow.png)

Production flow
----

![Production flow](https://raw.githubusercontent.com/caretdev/node-red-contrib-intersystems-iris/main/images/production-flow.png)

And dynamically updated Dashboard, which is avialable by link http://localhost:1880/ui/
![Production dashboard](https://raw.githubusercontent.com/caretdev/node-red-contrib-intersystems-iris/main/images/production-dashboard.png)

Some complex flow
----

![Production dashboard](https://raw.githubusercontent.com/caretdev/node-red-contrib-intersystems-iris/main/images/create-table-flow.png)
![Production dashboard](https://raw.githubusercontent.com/caretdev/node-red-contrib-intersystems-iris/main/images/create-table-ui.png)
