"use strict";

const assert = require("assert");

const IRIS = require("..");
console.log(IRIS)

describe("IRIS Database", () => {
  it("should connect", async () => {
    const db = new IRIS("localhost", 1972, "USER", "_SYSTEM", "SYS");
    db.close();
  });
});