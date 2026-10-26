const { test, before, after } = require("node:test");
const assert = require("node:assert");
const app = require("../src/index");

let server, base;
before(() => new Promise(r => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; r(); }); }));
after(() => server.close());

const send = (method, path, body) =>
  fetch(base + path, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    .then(async res => ({ status: res.status, body: await res.json() }));

const valid = { name: "Vamsi", email: "vamsi@example.com", password: "secret123" };
const fields = body => body.details.map(d => d.field);

test("missing email -> 400 with field error", async () => {
  const { email, ...noEmail } = valid;
  const res = await send("POST", "/users", noEmail);
  assert.strictEqual(res.status, 400);
  assert.ok(fields(res.body).includes("email"));
});

test("invalid email format -> 400 with field error", async () => {
  const res = await send("POST", "/users", { ...valid, email: "not-an-email" });
  assert.strictEqual(res.status, 400);
  assert.ok(fields(res.body).includes("email"));
});

test("password too short -> 400", async () => {
  const res = await send("POST", "/users", { ...valid, password: "a1" });
  assert.strictEqual(res.status, 400);
  assert.ok(fields(res.body).includes("password"));
});

test("all valid -> 201, role defaults to user, no password in response", async () => {
  const res = await send("POST", "/users", valid);
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.email, valid.email);
  assert.strictEqual(res.body.role, "user");
  assert.strictEqual(res.body.password, undefined);
});

test("PATCH partial update -> 200, bad data -> 400, unknown id -> 404", async () => {
  const { body: user } = await send("POST", "/users", { ...valid, email: "p@example.com" });
  const ok = await send("PATCH", `/users/${user.id}`, { name: "New Name" });
  assert.strictEqual(ok.status, 200);
  assert.strictEqual(ok.body.name, "New Name");
  assert.strictEqual(ok.body.role, "user");
  assert.strictEqual((await send("PATCH", `/users/${user.id}`, { age: 200 })).status, 400);
  assert.strictEqual((await send("PATCH", "/users/9999", { name: "Nobody" })).status, 404);
});
