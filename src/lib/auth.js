import fs from "fs";
import path from "path";
import os from "os"; // 1. Import the built-in OS module

// 2. Use os.homedir() instead of process.env.HOME
const TOKEN_PATH = path.join(os.homedir(), ".envx-token");

export function saveToken(token) {
  fs.writeFileSync(TOKEN_PATH, token);
}

export function getToken() {
  if (!fs.existsSync(TOKEN_PATH)) return null;
  return fs.readFileSync(TOKEN_PATH, "utf8");
}