const express = require("express");
// FIX: was "../src/middleware/validate" — works, but "./" is the normal path from src/.
const validate = require("./middleware/validate");
// FIX: was `UpdateUserSchema` (capital U) — didn't match the exported name.
const { createUserSchema, updateUserSchema } = require("./schemas/user");

const app = express();
// FIX: missing — without it req.body is undefined and validation never sees the fields.
app.use(express.json());

// FIX: no store and `createUser` was never defined. In-memory store for now (no DB yet).
const users = [];
let nextId = 1;

// FIX: password was sent back in the response. Strip it.
const publicUser = ({ password, ...rest }) => rest;

// FIX: validation was duplicated inline; use the reusable validate() middleware instead.
app.post("/users", validate(createUserSchema), (req, res) => {
  const user = { id: nextId++, ...req.body };
  users.push(user);
  res.status(201).json(publicUser(user));
});

// FIX: handler was empty.
app.patch("/users/:id", validate(updateUserSchema), (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: "User not found" });
  Object.assign(user, req.body);
  res.status(200).json(publicUser(user));
});

// FIX: no app.listen — server never started. Only listen when run directly so tests can import app.
if (require.main === module) {
  app.listen(3000, () => console.log("Listening on http://localhost:3000"));
}

module.exports = app;
