const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Testing http in nodejs" }));
});

server.listen(3000, () => console.log("Listening on port 3000"));