const fs = require("fs/promises");
const path = require("path");

const LOG_FILE = path.join(__dirname, "app.log");  

async function write(message) {
  if (!message) {
    console.error("✗ Please provide a message to log.");
    process.exit(1);
  }
  const entry = `[${new Date().toISOString()}] ${message}`;
  await fs.appendFile(LOG_FILE, entry + "\n");
  console.log(`✓ Logged: ${entry}`);
}

async function read() {
  try {
    const data = await fs.readFile(LOG_FILE, "utf-8");
    process.stdout.write(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("(log is empty)");
    } else {
      throw err;
    }
  }
}

async function clear() {
  await fs.writeFile(LOG_FILE, "");
  console.log("✓ Log cleared");
}

async function count() {
  try {
    const data = await fs.readFile(LOG_FILE, "utf-8");
    const entries = data.split("\n").filter((line) => line.trim() !== "");
    console.log(`${entries.length} entries`);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("0 entries");
    } else {
      throw err;
    }
  }
}

async function main() {
  const [, , command, message] = process.argv;

  switch (command) {
    case "write":
      await write(message);
      break;
    case "read":
      await read();
      break;
    case "clear":
      await clear();
      break;
    case "count":
      await count();
      break;
    default:
      console.log("Usage:");
      console.log('  node logger.js write "message"   Append a timestamped entry');
      console.log("  node logger.js read              Print all entries");
      console.log("  node logger.js clear             Empty the log file");
      console.log("  node logger.js count             Count entries");
  }
}

main().catch((err) => {
  console.error("✗ Error:", err.message);
  process.exit(1);
});